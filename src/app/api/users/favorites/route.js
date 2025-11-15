import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';
import { cookies } from 'next/headers';

/**
 * Helper function to fetch with timeout
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds (default: 5000)
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

// GET - Obtener IDs de terapeutas favoritos del usuario
export async function GET(request) {
  try {
    const config = getServerConfig();
    const cookieStore = await cookies();
    const authToken = cookieStore.get('authToken');
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Primero validar el token para obtener la información del usuario
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');

    const validateResponse = await fetchWithTimeout(
      `${config.JWT_BASE}/auth/validate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        },
        body: JSON.stringify({
          JWT: authToken.value
        })
      },
      8000 // 8 second timeout for JWT validation
    );

    if (!validateResponse.ok) {
      console.error('JWT validation failed:', validateResponse.status);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const validationData = await validateResponse.json();
    const userId = validationData.data?.user?.ID;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 400 }
      );
    }
    
    // Obtener datos del usuario incluyendo ACF
    const userResponse = await fetchWithTimeout(
      `${config.WP_API_BASE}/users/${userId}?context=edit`,
      {
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      },
      8000 // 8 second timeout
    );

    if (!userResponse.ok) {
      console.error('Failed to fetch user data:', userResponse.status);
      throw new Error(`Failed to fetch user data: ${userResponse.status}`);
    }
    
    const userData = await userResponse.json();
    const favoritesString = userData.acf?.favorites_therapists || '';
    
    // Convertir string de IDs separados por comas en array
    const favoriteIds = favoritesString
      .split(',')
      .filter(id => id.trim() !== '')
      .map(id => parseInt(id.trim()));
    
    return NextResponse.json({
      success: true,
      favorites: favoriteIds
    });
    
  } catch (error) {
    console.error('Get favorites error:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to fetch favorites';
    let statusCode = 500;

    if (error.message.includes('timeout')) {
      errorMessage = 'Request timeout - WordPress server not responding';
      statusCode = 504;
    } else if (error.message.includes('ECONNRESET')) {
      errorMessage = 'Connection error - Please check WordPress server';
      statusCode = 503;
    }

    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: statusCode }
    );
  }
}

// POST - Agregar terapeuta a favoritos
export async function POST(request) {
  try {
    const config = getServerConfig();
    const cookieStore = await cookies();
    const authToken = cookieStore.get('authToken');
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { therapistId } = body;
    
    if (!therapistId) {
      return NextResponse.json(
        { error: 'Therapist ID required' },
        { status: 400 }
      );
    }
    
    // Validar token y obtener ID de usuario
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');

    const validateResponse = await fetchWithTimeout(
      `${config.JWT_BASE}/auth/validate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        },
        body: JSON.stringify({
          JWT: authToken.value
        })
      },
      8000 // 8 second timeout for JWT validation
    );

    if (!validateResponse.ok) {
      console.error('JWT validation failed:', validateResponse.status);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const validationData = await validateResponse.json();
    const userId = validationData.data?.user?.ID;
    
    // Obtener favoritos actuales
    const userResponse = await fetchWithTimeout(
      `${config.WP_API_BASE}/users/${userId}?context=edit`,
      {
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      },
      8000 // 8 second timeout
    );

    if (!userResponse.ok) {
      console.error('Failed to fetch user data:', userResponse.status);
      throw new Error(`Failed to fetch user data: ${userResponse.status}`);
    }
    
    const userData = await userResponse.json();
    const currentFavorites = userData.acf?.favorites_therapists || '';
    
    // Convertir a array y verificar si ya existe
    const favoriteIds = currentFavorites
      .split(',')
      .filter(id => id.trim() !== '')
      .map(id => id.trim());
    
    if (favoriteIds.includes(therapistId.toString())) {
      return NextResponse.json({
        success: true,
        message: 'Therapist already in favorites'
      });
    }
    
    // Agregar nuevo ID
    favoriteIds.push(therapistId.toString());
    const newFavorites = favoriteIds.join(',');
    
    // Actualizar usuario con nuevos favoritos
    const updateResponse = await fetchWithTimeout(
      `${config.WP_API_BASE}/users/${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        },
        body: JSON.stringify({
          acf: {
            favorites_therapists: newFavorites
          }
        })
      },
      10000 // 10 second timeout for update operation
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Update error:', errorText);
      throw new Error(`Failed to update favorites: ${updateResponse.status}`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Therapist added to favorites'
    });
    
  } catch (error) {
    console.error('Add favorite error:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to add favorite';
    let statusCode = 500;

    if (error.message.includes('timeout')) {
      errorMessage = 'Request timeout - WordPress server not responding';
      statusCode = 504;
    } else if (error.message.includes('ECONNRESET')) {
      errorMessage = 'Connection error - Please check WordPress server';
      statusCode = 503;
    } else if (error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Cannot connect to WordPress server';
      statusCode = 503;
    }

    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: statusCode }
    );
  }
}