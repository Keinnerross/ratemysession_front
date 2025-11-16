import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function GET(request) {
  try {
    const config = getServerConfig();
    const { searchParams } = new URL(request.url);

    // Get limit parameter (default 12)
    const limit = searchParams.get('limit') || '12';

    // Setup Basic Auth for WordPress API
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');

    // Extract userId from JWT token if present
    let userId = null;
    const authHeader = request.headers.get('authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      // Validate token to get userId

      try {
        const validateResponse = await fetch(`${config.JWT_BASE}/auth/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
          body: JSON.stringify({ JWT: token })
        });

        if (validateResponse.ok) {
          const validateData = await validateResponse.json();
          userId = validateData.data?.user?.ID || null;
        }
      } catch (err) {
        console.warn('Could not validate token for userId:', err.message);
        // Continue without userId if validation fails
      }
    }

    // Build the URL for the WordPress custom endpoint
    const url = `${config.BACKEND_URL}/wp-json/custom/v1/recent-reviews`;
    const params = new URLSearchParams({ limit });

    // Add userId to params if available
    if (userId) {
      params.append('userId', userId);
    }

    // Make request to WordPress backend with Basic Auth

    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Don't cache to always get fresh data
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WordPress Recent Reviews API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      return NextResponse.json(
        {
          error: 'Failed to fetch recent reviews',
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the complete response from WordPress
    return NextResponse.json(data);

  } catch (error) {
    console.error('Recent Reviews API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}
