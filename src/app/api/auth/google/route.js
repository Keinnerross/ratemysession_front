import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function POST(request) {
  try {
    const config = getServerConfig();
    const { credential, clientId } = await request.json();
    
    // Verificar que el clientId coincida
    if (clientId !== process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { error: 'Invalid client ID' },
        { status: 401 }
      );
    }
    
    // Decodificar el JWT de Google para obtener info del usuario
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const googleUser = JSON.parse(jsonPayload);
    console.log('Google user info:', { email: googleUser.email, name: googleUser.name });
    
    // Crear Basic Auth con credenciales del sistema
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');
    
    // Primero, intentar buscar si el usuario existe
    const searchUrl = `${config.WP_API_BASE}/users?search=${encodeURIComponent(googleUser.email)}`;
    const searchResponse = await fetch(searchUrl, {
      headers: {
        'Authorization': `Basic ${basicAuth}`
      }
    });
    
    const users = await searchResponse.json();
    let userId = null;
    
    if (users && users.length > 0 && users[0].email === googleUser.email) {
      // Usuario existe
      userId = users[0].id;
      console.log('User found:', userId);
    } else {
      // Crear nuevo usuario
      console.log('Creating new user...');
      const username = googleUser.email.split('@')[0].toLowerCase() + '_' + Date.now();
      
      const createUserResponse = await fetch(`${config.WP_API_BASE}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          email: googleUser.email,
          name: googleUser.name,
          first_name: googleUser.given_name || '',
          last_name: googleUser.family_name || '',
          password: Math.random().toString(36).slice(-16) + 'Aa1!',
          roles: ['subscriber']
        })
      });
      
      if (!createUserResponse.ok) {
        const errorData = await createUserResponse.json();
        console.error('Error creating user:', errorData);
        return NextResponse.json(
          { error: 'Failed to create user', details: errorData },
          { status: 500 }
        );
      }
      
      const newUser = await createUserResponse.json();
      userId = newUser.id;
      console.log('User created:', userId);
    }
    
    // Ahora autenticar con Simple JWT Login usando email/password temporal o generar JWT directamente
    // Opción: Generar JWT para el usuario
    const authUrl = `${config.JWT_BASE}/auth`;
    
    // Intentar autenticar con el email (Simple JWT Login debe estar configurado para permitir esto)
    const authResponse = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: googleUser.email,
        password: 'google_oauth', // Simple JWT Login debería estar configurado para aceptar esto como bypass
        google_id_token: credential // Enviar el token por si el plugin lo puede validar
      })
    });
    
    const authData = await authResponse.json();
    
    if (authResponse.ok && authData.success && authData.data?.jwt) {
      return NextResponse.json({
        success: true,
        token: authData.data.jwt,
        user: {
          email: googleUser.email,
          displayName: googleUser.name,
          picture: googleUser.picture,
          isNewUser: !users || users.length === 0
        }
      });
    }
    
    // Si la autenticación falla, devolver error
    return NextResponse.json({
      success: false,
      message: 'Authentication failed. Please configure Simple JWT Login to accept Google OAuth.'
    }, { status: 401 });
    
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed', message: error.message },
      { status: 500 }
    );
  }
}