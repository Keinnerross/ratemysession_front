import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function POST(request) {
  try {
    const config = getServerConfig();
    const body = await request.json();
    
    // Get JWT from request body
    const token = body.JWT;
    if (!token) {
      return NextResponse.json(
        { error: 'No JWT token provided' },
        { status: 401 }
      );
    }
    
    // Create Basic Authentication for system credentials
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');
    
    // Simple JWT Login endpoint para validar
    // POST method with JWT in body
    const response = await fetch(`${config.JWT_BASE}/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      },
      body: JSON.stringify({
        JWT: token
      })
    });
    
    const data = await response.json();
    
    // Simple JWT Login validation response format
    if (response.ok && data.success !== false) {
      // Si la validación es exitosa, data contiene la información del usuario
      return NextResponse.json({
        code: 'jwt_auth_valid_token',
        data: {
          status: 200,
          user: {
            id: data.data?.user?.ID || data.data?.ID,
            email: data.data?.user?.user_email || data.data?.user_email,
            displayName: data.data?.user?.display_name || data.data?.display_name,
            nicename: data.data?.user?.user_nicename || data.data?.user_nicename,
            ...data.data
          }
        }
      }, { status: 200 });
    }
    
    // Si el token no es válido o expiró
    return NextResponse.json({
      code: 'jwt_auth_invalid_token',
      message: data.message || 'Invalid or expired token',
      data: { status: response.status }
    }, { status: response.status || 401 });
  } catch (error) {
    console.error('Validate token API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}