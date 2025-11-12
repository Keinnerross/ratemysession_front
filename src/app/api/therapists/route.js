import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function GET(request) {
  try {
    const config = getServerConfig();
    const { searchParams } = new URL(request.url);
    
    // Crear Basic Auth con credenciales del sistema
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');
    
    // Construir URL con parámetros
    const page = searchParams.get('page') || 1;
    const perPage = searchParams.get('per_page') || 12;
    const include = searchParams.get('include');
    
    let url = `${config.WP_API_BASE}/therapists?_embed=wp:featuredmedia&page=${page}&per_page=${perPage}`;
    
    // Para obtener terapeutas específicos por IDs
    if (include) {
      url = `${config.WP_API_BASE}/therapists?_embed=wp:featuredmedia&include=${include}&per_page=${perPage}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      }
    });
    
    const data = await response.json();
    
    // Pasar headers de paginación
    const headers = new Headers();
    if (response.headers.get('x-wp-total')) {
      headers.set('x-wp-total', response.headers.get('x-wp-total'));
    }
    if (response.headers.get('x-wp-totalpages')) {
      headers.set('x-wp-totalpages', response.headers.get('x-wp-totalpages'));
    }
    
    return NextResponse.json(data, { 
      status: response.status,
      headers 
    });
  } catch (error) {
    console.error('Therapists API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}