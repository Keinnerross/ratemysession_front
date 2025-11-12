import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function POST(request) {
  try {
    const config = getServerConfig();
    
    // Obtener el token del header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }
    
    // Simple JWT Login endpoint para validar - usa GET no POST
    const response = await fetch(`${config.JWT_BASE}/auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader // Pasar el token del usuario
      }
    });
    
    const data = await response.json();
    
    // Simple JWT devuelve un formato diferente, adaptarlo
    if (response.ok && data.success) {
      return NextResponse.json({
        code: 'jwt_auth_valid_token',
        data: {
          status: 200,
          user: data.data?.user || {}
        }
      }, { status: 200 });
    }
    
    // Si el token no es válido
    return NextResponse.json({
      code: data.data?.code || 'jwt_auth_invalid_token',
      message: data.data?.message || 'Invalid token',
      data: { status: response.status }
    }, { status: response.status });
  } catch (error) {
    console.error('Validate token API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}