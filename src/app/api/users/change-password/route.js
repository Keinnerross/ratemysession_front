import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function POST(request) {
  try {
    const config = getServerConfig();
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization token' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Validate required fields
    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength (minimum 6 characters)
    if (body.newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Create Basic Auth credentials for WordPress API calls
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');

    // Validate token and get user data
    const validateResponse = await fetch(`${config.JWT_BASE}/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      },
      body: JSON.stringify({ JWT: token })
    });

    if (!validateResponse.ok) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const validateData = await validateResponse.json();
    const userEmail = validateData.data?.user?.user_email;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Could not determine user email from token' },
        { status: 401 }
      );
    }

    // Verify current password by attempting to login
    const loginResponse = await fetch(`${config.JWT_BASE}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      },
      body: JSON.stringify({
        email: userEmail,
        password: body.currentPassword
      })
    });

    if (!loginResponse.ok) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Get user ID
    const userId = validateData.data?.user?.ID;

    // Update password via WordPress REST API
    const updateResponse = await fetch(`${config.WP_API_BASE}/users/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: body.newPassword
      })
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('WordPress Password Update Error:', {
        status: updateResponse.status,
        statusText: updateResponse.statusText,
        error: errorText
      });

      return NextResponse.json(
        {
          error: 'Failed to update password',
          details: errorText
        },
        { status: updateResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Password Change Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}
