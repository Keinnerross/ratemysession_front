import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

/**
 * Image Proxy for WordPress Media
 * Proxies requests to WordPress media files hosted on Local WP
 * This is necessary because http://rms-backend.local is only accessible from the server
 *
 * Example: /api/media/2025/11/photo.jpg -> http://rms-backend.local/wp-content/uploads/2025/11/photo.jpg
 */
export async function GET(request, { params }) {
  try {
    const { path } = await params;
    const config = getServerConfig();

    // Construct the WordPress media URL
    const mediaPath = Array.isArray(path) ? path.join('/') : path;
    const wordpressUrl = `${config.BACKEND_URL}/wp-content/uploads/${mediaPath}`;

    // Create Basic Auth credentials
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');

    // Fetch the image from WordPress with Basic Auth
    const response = await fetch(wordpressUrl, {
      headers: {
        'Authorization': `Basic ${basicAuth}`
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    // Get the image buffer
    const imageBuffer = await response.arrayBuffer();

    // Get content type from WordPress response
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Media proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}
