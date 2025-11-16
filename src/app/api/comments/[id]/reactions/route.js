import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function POST(request, { params }) {
  try {
    const config = getServerConfig();
    const { id } = await params;
    const body = await request.json();
    const { reactionType } = body; // 'useful', 'loved', 'thankful', 'oh-no'

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

    // Map frontend reaction names to WordPress ACF field names
    const reactionFieldMap = {
      'useful': 'useful',
      'helpful': 'loved',
      'insightful': 'thankful',
      'inappropriate': 'oh-no'
    };

    const acfFieldName = reactionFieldMap[reactionType];

    if (!acfFieldName) {
      return NextResponse.json(
        { error: 'Invalid reaction type' },
        { status: 400 }
      );
    }

    // Get current comment data
    const getCommentResponse = await fetch(`${config.WP_API_BASE}/comments/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      }
    });

    if (!getCommentResponse.ok) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    const comment = await getCommentResponse.json();
    const currentAcf = comment.acf || {};

    // Parse current reaction IDs (all fields)
    const reactionFields = ['useful', 'loved', 'thankful', 'oh-no'];
    const currentReactions = {};

    reactionFields.forEach(field => {
      const value = currentAcf[field] || '';
      currentReactions[field] = value ? value.split(',').map(id => id.trim()).filter(id => id) : [];
    });

    // Check if user already has this reaction
    const userIdStr = String(userId);
    const hasThisReaction = currentReactions[acfFieldName].includes(userIdStr);

    // Remove user from all reaction arrays (since only one reaction is allowed)
    reactionFields.forEach(field => {
      currentReactions[field] = currentReactions[field].filter(id => id !== userIdStr);
    });

    // If user didn't have this reaction, add it (toggle on)
    // If user had it, it stays removed (toggle off)
    if (!hasThisReaction) {
      currentReactions[acfFieldName].push(userIdStr);
    }

    // Convert arrays back to comma-separated strings
    const updatedAcf = {};
    reactionFields.forEach(field => {
      updatedAcf[field] = currentReactions[field].join(',');
    });

    // Update comment in WordPress
    const updateResponse = await fetch(`${config.WP_API_BASE}/comments/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        acf: updatedAcf
      })
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('WordPress Comment Update Error:', {
        status: updateResponse.status,
        statusText: updateResponse.statusText,
        error: errorText
      });

      return NextResponse.json(
        {
          error: 'Failed to update reaction',
          details: errorText
        },
        { status: updateResponse.status }
      );
    }

    const updatedComment = await updateResponse.json();

    // Calculate counts and determine user's current reaction
    const counts = {};
    let userReaction = null;

    reactionFields.forEach(field => {
      const ids = currentReactions[field];
      counts[field] = ids.length;

      if (ids.includes(userIdStr)) {
        // Map back to frontend names
        const frontendName = Object.keys(reactionFieldMap).find(
          key => reactionFieldMap[key] === field
        );
        userReaction = frontendName || field;
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Reaction updated successfully',
      reactions: {
        useful: counts.useful,
        helpful: counts.loved,
        insightful: counts.thankful,
        inappropriate: counts['oh-no']
      },
      userReaction: userReaction
    });

  } catch (error) {
    console.error('Reaction Toggle Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}
