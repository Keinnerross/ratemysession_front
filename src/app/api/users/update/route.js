import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function PUT(request) {
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

    // Create Basic Auth credentials for WordPress API calls
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');

    // Validate token and get user ID
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
    const userId = validateData.data?.user?.ID;

    if (!userId) {
      return NextResponse.json(
        { error: 'Could not determine user ID from token' },
        { status: 401 }
      );
    }

    // Prepare update data
    const updateData = {};

    if (body.displayName !== undefined) {
      updateData.name = body.displayName;
    }

    if (body.firstName !== undefined) {
      updateData.first_name = body.firstName;
    }

    if (body.lastName !== undefined) {
      updateData.last_name = body.lastName;
    }

    // Update user via WordPress API
    const response = await fetch(`${config.WP_API_BASE}/users/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WordPress User Update Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      return NextResponse.json(
        {
          error: 'Failed to update user',
          details: errorText
        },
        { status: response.status }
      );
    }

    const updatedUser = await response.json();

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.email
      }
    });
  } catch (error) {
    console.error('User Update Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}
