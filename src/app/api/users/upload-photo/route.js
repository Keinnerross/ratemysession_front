import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function POST(request) {
  try {
    const config = getServerConfig();
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

    // Get form data with image
    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    // Convert File to Buffer for upload
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to WordPress media library
    const uploadResponse = await fetch(`${config.WP_API_BASE}/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Disposition': `attachment; filename="${imageFile.name}"`,
        'Content-Type': imageFile.type
      },
      body: buffer
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('WordPress Media Upload Error:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        error: errorText
      });

      return NextResponse.json(
        {
          error: 'Failed to upload image',
          details: errorText
        },
        { status: uploadResponse.status }
      );
    }

    const mediaData = await uploadResponse.json();
    const originalImageUrl = mediaData.source_url;
    const mediaId = mediaData.id;

    // Convert WordPress URL to proxy URL for browser access
    // WordPress returns: http://rms-backend.local/wp-content/uploads/2025/11/photo.jpg
    // We convert to: /api/media/2025/11/photo.jpg
    let imageUrl = originalImageUrl;
    if (imageUrl && imageUrl.includes('/wp-content/uploads/')) {
      // Extract the path after /wp-content/uploads/
      const match = imageUrl.match(/\/wp-content\/uploads\/(.+)$/);
      if (match) {
        imageUrl = `/api/media/${match[1]}`;
      }
    }

    // Save the image URL to user's ACF field for persistence
    const updateUserResponse = await fetch(`${config.WP_API_BASE}/users/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        acf: {
          user_profile_picture_url: imageUrl
        }
      })
    });

    if (!updateUserResponse.ok) {
      const errorText = await updateUserResponse.text();
      console.error('WordPress User ACF Update Error:', {
        status: updateUserResponse.status,
        statusText: updateUserResponse.statusText,
        error: errorText
      });
      // Don't fail the request if ACF update fails, just log it
      console.warn('Profile photo uploaded but ACF field update failed');
    }

    return NextResponse.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      imageUrl: imageUrl,
      mediaId: mediaId
    });
  } catch (error) {
    console.error('Photo Upload Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}
