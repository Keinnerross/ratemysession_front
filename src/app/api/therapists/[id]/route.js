import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function GET(request, { params }) {
  try {
    const config = getServerConfig();
    const { id } = await params;
    
    // Crear Basic Auth con credenciales del sistema
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');
    
    const response = await fetch(`${config.WP_API_BASE}/therapists/${id}?_embed=wp:featuredmedia`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      }
    });
    
    if (!response.ok && response.status === 404) {
      return NextResponse.json(
        { error: 'Therapist not found' },
        { status: 404 }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Therapist detail API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}