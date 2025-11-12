import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const isLogin = searchParams.get('mode') === 'login';
  
  // Construir la URL de autorización de Google
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  
  // Parámetros OAuth
  googleAuthUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  googleAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/auth/google/callback`);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'email profile openid');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'select_account');
  
  // Guardar el modo (login/register) en el state para recuperarlo después
  googleAuthUrl.searchParams.set('state', JSON.stringify({ mode: isLogin ? 'login' : 'register' }));
  
  // Redirigir a Google
  return NextResponse.redirect(googleAuthUrl.toString());
}