import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function POST(request) {
  try {
    const config = getServerConfig();
    const body = await request.json();
    
    // Crear Basic Auth con credenciales del sistema
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');
    
    // Simple JWT Login usa 'email' según la documentación
    const response = await fetch(`${config.JWT_BASE}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      },
      body: JSON.stringify({
        email: body.username, // Simple JWT usa 'email' no 'username'
        password: body.password
      })
    });
    
    const data = await response.json();
    
    // Simple JWT devuelve: {"success": true, "data": {"jwt": "TOKEN"}}
    // Necesitamos mantener compatibilidad con el formato anterior
    if (response.ok && data.success && data.data?.jwt) {
      // Obtener información del usuario validando el token
      const userResponse = await fetch(`${config.JWT_BASE}/auth/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${data.data.jwt}`
        }
      });
      
      const userData = await userResponse.json();
      
      // Formato compatible con el plugin anterior
      return NextResponse.json({
        token: data.data.jwt,
        user_email: userData.data?.user?.user_email || body.username,
        user_nicename: userData.data?.user?.user_nicename || '',
        user_display_name: userData.data?.user?.display_name || ''
      }, { status: 200 });
    }
    
    // Si hay error, devolver el mensaje
    return NextResponse.json({
      code: data.data?.code || 'invalid_credentials',
      message: data.data?.message || 'Invalid username or password',
      data: { status: response.status }
    }, { status: response.status });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}