import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function GET(request) {
  try {
    const config = getServerConfig();
    const { searchParams } = new URL(request.url);

    // Get parameters
    const therapistId = searchParams.get('therapistId');

    // Validate required parameter
    if (!therapistId) {
      return NextResponse.json(
        { error: 'Missing required parameter: therapistId' },
        { status: 400 }
      );
    }

    // Get user email from cookies if available
    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    const userDataString = cookies.userData;

    let userEmail = null;
    if (userDataString) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataString));
        userEmail = userData.email;
      } catch (error) {
        console.error('Error parsing user data from cookies:', error);
      }
    }

    // If no user is logged in, they can review (localStorage check happens on client)
    if (!userEmail) {
      return NextResponse.json({
        canReview: true,
        reason: null
      });
    }

    // Check if logged-in user has already reviewed this therapist
    const url = `${config.BACKEND_URL}/wp-json/rms/v1/user-comments`;
    const params = new URLSearchParams({
      email: userEmail,
      therapist_id: therapistId
    });

    // Make request to WordPress backend
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');

    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      // If API fails, assume user can review (fail open)
      console.error('WordPress User Comments API Error:', {
        status: response.status,
        statusText: response.statusText
      });

      return NextResponse.json({
        canReview: true,
        reason: null
      });
    }

    const data = await response.json();

    // Check the therapist.has_commented field
    const hasReviewed = data?.therapist?.has_commented || false;

    if (hasReviewed) {
      return NextResponse.json({
        canReview: false,
        reason: 'already-reviewed-logged'
      });
    }

    return NextResponse.json({
      canReview: true,
      reason: null
    });

  } catch (error) {
    console.error('Can Review API Error:', error);
    // Fail open: if there's an error, allow review
    return NextResponse.json({
      canReview: true,
      reason: null
    });
  }
}

// Helper function to parse cookies
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=');
    if (name && rest) {
      cookies[name.trim()] = rest.join('=').trim();
    }
  });

  return cookies;
}
