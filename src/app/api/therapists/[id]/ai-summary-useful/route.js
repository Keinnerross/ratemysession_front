import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization token' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const config = getServerConfig();

    // Create Basic Auth credentials
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');

    // Validate JWT token with WordPress
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

    // Get current therapist data to read current useful reactions
    const backendUrl = `${config.BACKEND_URL}/wp-json/wp/v2/therapists/${id}`;
    const getResponse = await fetch(backendUrl, {
      headers: {
        'Authorization': `Basic ${basicAuth}`,
      },
    });

    if (!getResponse.ok) {
      throw new Error('Failed to fetch therapist data');
    }

    const therapistData = await getResponse.json();
    const currentUseful = therapistData.acf?.ai_review_summary_useful || '';

    // Toggle user ID in the comma-separated list
    let userIds = currentUseful ? currentUseful.split(',').filter(id => id) : [];
    const userIdString = userId.toString();
    const userIndex = userIds.indexOf(userIdString);

    if (userIndex > -1) {
      // Remove user ID (un-useful)
      userIds.splice(userIndex, 1);
    } else {
      // Add user ID (mark as useful)
      userIds.push(userIdString);
    }

    const newUseful = userIds.join(',');

    // Update therapist ACF field
    const updateResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        acf: {
          ai_review_summary_useful: newUseful,
        },
      }),
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update useful reaction');
    }

    const updatedTherapist = await updateResponse.json();

    return NextResponse.json({
      success: true,
      usefulCount: userIds.length,
      isUseful: userIndex === -1, // true if we added, false if we removed
      ai_review_summary_useful: updatedTherapist.acf.ai_review_summary_useful,
    });
  } catch (error) {
    console.error('Error toggling AI summary useful:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to toggle useful reaction' },
      { status: 500 }
    );
  }
}
