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

export async function POST(request) {
  try {
    const config = getServerConfig();
    const body = await request.json();
    
    // Crear Basic Auth con credenciales del sistema
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');
    
    // Preparar datos para WordPress
    const wpData = {
      title: body.therapistName,
      status: 'pending',
      type: 'therapists',
      acf: {
        Address: body.address || '',
        city: body.city || '',
        state_address: body.state || body.city || '',
        zip_code: body.zipcode ? parseInt(body.zipcode) : 0,
        Website: body.website || '',
        credentials_therapist: typeof body.credentials === 'string' ? body.credentials : '',
        Rating: 0,
        category: body.specialization || 'Uncategorized',
        created_by: body.selectedOption === 'therapist' ? 'Therapist' : 'User',
        user_therapist_relation: body.selectedOption === 'user' ? (body.relationship || '') : ''
      }
    };
    
    // Si hay una foto de perfil, primero subirla a WordPress Media
    if (body.profilePhoto && body.profilePhotoName) {
      try {
        // Make internal API call to upload media
        const baseUrl = request.headers.get('origin') || `http://localhost:${process.env.PORT || 3000}`;
        const mediaResponse = await fetch(`${baseUrl}/api/media`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            image: body.profilePhoto,
            filename: body.profilePhotoName
          })
        });
        
        if (mediaResponse.ok) {
          const mediaData = await mediaResponse.json();
          wpData.featured_media = mediaData.id;
        }
      } catch (error) {
        console.error('Error uploading profile photo:', error);
        // Continue without image if upload fails
      }
    }
    
    const response = await fetch(`${config.WP_API_BASE}/therapists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      },
      body: JSON.stringify(wpData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('WordPress API error:', data);
      return NextResponse.json(
        { error: data.message || 'Error creating therapist' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Create therapist API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}