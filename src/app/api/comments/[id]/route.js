import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function PUT(request, { params }) {
  try {
    const config = getServerConfig();
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    // Prepare auth
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');

    // Update comment via WordPress API
    const updateData = {
      acf: body.acf || {}
    };

    // If updating other fields besides ACF
    if (body.content !== undefined) {
      updateData.content = body.content;
    }
    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    const response = await fetch(`${config.WP_API_BASE}/comments/${id}`, {
      method: 'POST', // WordPress uses POST for updates
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WordPress Comment Update Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      return NextResponse.json(
        {
          error: 'Failed to update comment',
          details: errorText
        },
        { status: response.status }
      );
    }

    const updatedComment = await response.json();

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Comment Update Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const config = getServerConfig();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    // Prepare auth
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');

    // Delete comment via WordPress API
    const response = await fetch(`${config.WP_API_BASE}/comments/${id}?force=true`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WordPress Comment Delete Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      return NextResponse.json(
        {
          error: 'Failed to delete comment',
          details: errorText
        },
        { status: response.status }
      );
    }

    const deletedComment = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
      data: deletedComment
    });
  } catch (error) {
    console.error('Comment Delete Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}
