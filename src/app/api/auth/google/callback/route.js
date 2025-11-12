import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    // Si hay un error de Google
    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/login?error=google_auth_denied`);
    }
    
    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/login?error=no_code`);
    }
    
    const config = getServerConfig();
    
    // Crear Basic Auth
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');
    
    // Llamar a Simple JWT Login con el código de autorización
    const oauthUrl = `${config.JWT_BASE}/oauth/token?provider=google&code=${encodeURIComponent(code)}`;
    
    console.log('Calling Simple JWT OAuth with authorization code...');
    
    const response = await fetch(oauthUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Simple JWT OAuth response:', data);
    
    if (response.ok && data.success) {
      // Éxito: guardar el token en una cookie httpOnly y redirigir
      const redirectUrl = new URL(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/auth/callback`);
      redirectUrl.searchParams.set('token', data.data?.jwt || data.jwt);
      
      // Parse state para saber si era login o register
      try {
        const stateData = JSON.parse(state || '{}');
        redirectUrl.searchParams.set('mode', stateData.mode || 'login');
      } catch (e) {
        console.error('Error parsing state:', e);
      }
      
      return NextResponse.redirect(redirectUrl.toString());
    }
    
    // Error en la autenticación
    const errorMessage = data.data?.message || data.message || 'Authentication failed';
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/login?error=${encodeURIComponent(errorMessage)}`);
    
  } catch (error) {
    console.error('Google callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/login?error=callback_error`);
  }
}