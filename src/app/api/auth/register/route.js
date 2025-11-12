import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function POST(request) {
  try {
    const config = getServerConfig();
    const body = await request.json();
    
    // Crear Basic Auth con credenciales del sistema
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');
    
    // Simple JWT Login endpoint para registro
    const response = await fetch(`${config.JWT_BASE}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      },
      body: JSON.stringify({
        email: body.email,
        user_login: body.username, // Simple JWT usa 'user_login' no 'username'
        password: body.password,
        // AUTH_KEY es requerido para registro en Simple JWT Login
        AUTH_KEY: process.env.AUTH_CODE_REGISTER
      })
    });
    
    const data = await response.json();
    
    // Si el registro fue exitoso
    if (response.ok && data.success) {
      // Simple JWT devuelve los datos directamente, no en data.data
      const userData = {
        id: data.user?.ID || data.id,
        username: data.user?.user_login || body.username,
        email: data.user?.user_email || body.email,
        registered: data.user?.user_registered || new Date().toISOString(),
        jwt: data.jwt || null // JWT viene directo en data
      };
      
      return NextResponse.json(userData, { status: 201 });
    }
    
    // Si hay un error, verificar el tipo
    if (!response.ok) {
      const errorMessage = data.data?.message || data.message || 'Registration failed';
      
      // Manejar errores específicos
      if (errorMessage.toLowerCase().includes('username') && errorMessage.toLowerCase().includes('exists')) {
        return NextResponse.json(
          { 
            code: 'username_exists',
            message: 'username already exists',
            data: { status: 400 }
          }, 
          { status: 400 }
        );
      }
      
      if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('exists')) {
        return NextResponse.json(
          { 
            code: 'email_exists',
            message: 'Email already registered',
            data: { status: 400 }
          }, 
          { status: 400 }
        );
      }
      
      // Error genérico
      return NextResponse.json({
        code: data.data?.code || 'registration_failed',
        message: errorMessage,
        data: { status: response.status }
      }, { status: response.status });
    }
    
    // Retornar el error original
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}