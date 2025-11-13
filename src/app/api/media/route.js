import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function POST(request) {
  try {
    const config = getServerConfig();
    const body = await request.json();
    
    // Crear Basic Auth con credenciales del sistema
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');
    
    if (!body.image || !body.filename) {
      return NextResponse.json(
        { error: 'Image and filename are required' },
        { status: 400 }
      );
    }
    
    // Convert base64 to buffer
    const base64Data = body.image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create form data for WordPress
    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    formData.append('file', blob, body.filename || 'profile.jpg');
    
    // Upload to WordPress Media Library
    const response = await fetch(`${config.WP_API_BASE}/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('WordPress Media API error:', data);
      return NextResponse.json(
        { error: data.message || 'Error uploading image' },
        { status: response.status }
      );
    }
    
    // Return the media ID
    return NextResponse.json({ 
      id: data.id,
      url: data.source_url 
    });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}