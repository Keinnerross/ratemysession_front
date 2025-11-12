'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle } = useAuth();
  
  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const mode = searchParams.get('mode');
      const error = searchParams.get('error');
      
      if (error) {
        console.error('Auth error:', error);
        router.push(`/${mode === 'register' ? 'register' : 'login'}?error=${error}`);
        return;
      }
      
      if (token) {
        // Guardar el token directamente
        localStorage.setItem('authToken', token);
        
        // Decodificar el JWT para obtener información del usuario
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          
          const payload = JSON.parse(jsonPayload);
          
          // Guardar información del usuario
          if (payload.email) {
            localStorage.setItem('userEmail', payload.email);
          }
          if (payload.name || payload.user_display_name) {
            localStorage.setItem('user', JSON.stringify(payload.name || payload.user_display_name));
          }
          
          // Redirigir al perfil
          router.push('/user-profile');
        } catch (e) {
          console.error('Error parsing token:', e);
          router.push('/login?error=invalid_token');
        }
      } else {
        router.push('/login?error=no_token');
      }
    };
    
    handleCallback();
  }, [searchParams, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Autenticando con Google...</p>
      </div>
    </div>
  );
}