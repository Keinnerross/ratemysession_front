import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function GET(request) {
  try {
    const config = getServerConfig();
    const { searchParams } = new URL(request.url);
    
    // Extract therapist ID from the path
    const therapistId = searchParams.get('therapistId');
    
    if (!therapistId) {
      return NextResponse.json(
        { error: 'Therapist ID is required' },
        { status: 400 }
      );
    }
    
    // Build URL with all query params
    const params = new URLSearchParams();
    
    // Add all supported parameters
    if (searchParams.has('page')) params.append('page', searchParams.get('page'));
    if (searchParams.has('per_page')) params.append('per_page', searchParams.get('per_page'));
    if (searchParams.has('rate')) params.append('rate', searchParams.get('rate'));
    if (searchParams.has('sort_by')) params.append('sort_by', searchParams.get('sort_by'));
    if (searchParams.has('sort_order')) params.append('sort_order', searchParams.get('sort_order'));
    
    // Use the custom endpoint
    const url = `${config.WORDPRESS_URL}/wp-json/rms/v1/therapist-comments/${therapistId}${params.toString() ? `?${params.toString()}` : ''}`;
    
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('WordPress API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: url
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch paginated comments',
          details: errorText
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Paginated Comments API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}