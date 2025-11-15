import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function GET(request) {
  try {
    const config = getServerConfig();
    const { searchParams } = new URL(request.url);
    
    // Get parameters
    const email = searchParams.get('email');
    const therapistId = searchParams.get('therapist_id');
    const page = searchParams.get('page');
    const perPage = searchParams.get('per_page');
    const order = searchParams.get('order');
    const rate = searchParams.get('rate');
    
    // Validate required parameters - only email is required
    if (!email) {
      return NextResponse.json(
        { error: 'Missing required parameter: email' },
        { status: 400 }
      );
    }
    
    // Build the URL for the WordPress custom endpoint
    const url = `${config.BACKEND_URL}/wp-json/rms/v1/user-comments`;
    const params = new URLSearchParams({
      email: email
    });
    
    // Add optional parameters if they exist
    if (therapistId) params.append('therapist_id', therapistId);
    if (page) params.append('page', page);
    if (perPage) params.append('per_page', perPage);
    if (order) params.append('order', order);
    if (rate) params.append('rate', rate);
    
    // Make request to WordPress backend
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');
    
    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('WordPress User Comments API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch user comments',
          details: errorText
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Return the complete response from WordPress
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('User Comments API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}