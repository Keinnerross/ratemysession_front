import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';
import { cookies } from 'next/headers';

/**
 * GET - Obtener terapeutas favoritos del usuario con paginación y filtros
 *
 * Query params soportados:
 * - page: Número de página (default: 1)
 * - per_page: Items por página (default: 6)
 * - order: Orden de resultados 'asc' o 'desc' (default: 'desc')
 * - rating: Filtrar por rating, ej: "4,5" o "4.2,5"
 */
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

    // Validar token para obtener la información del usuario
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');

    const validateResponse = await fetch(`${config.JWT_BASE}/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      },
      body: JSON.stringify({
        JWT: authToken.value
      })
    });

    if (!validateResponse.ok) {
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

    // Extraer query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '6';
    const order = searchParams.get('order') || 'desc';
    const rating = searchParams.get('rating') || '';

    // Construir URL del endpoint de WordPress
    const wpEndpoint = `${config.BACKEND_URL}/wp-json/rms/v1/users/${userId}/favorites-therapists`;
    const params = new URLSearchParams({
      page,
      perpage: perPage,
      order,
      _embed: 'true' // Include embedded data (featured media, replies, etc.)
    });

    // Agregar rating solo si está presente
    if (rating) {
      params.append('rating', rating);
    }

    const wpUrl = `${wpEndpoint}?${params.toString()}`;

    // Hacer petición al endpoint de WordPress
    const wpResponse = await fetch(wpUrl, {
      headers: {
        'Authorization': `Basic ${basicAuth}`
      }
    });

    if (!wpResponse.ok) {
      const errorText = await wpResponse.text();
      console.error('WordPress API error:', errorText);
      throw new Error(`WordPress API error: ${wpResponse.status}`);
    }

    const data = await wpResponse.json();

    // Transformar la respuesta al formato esperado por el frontend
    return NextResponse.json({
      therapists: data.therapists || [],
      pagination: {
        currentPage: data.pagination?.page || 1,
        perPage: data.pagination?.per_page || 6,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.total_pages || 0,
        hasNextPage: (data.pagination?.page || 1) < (data.pagination?.total_pages || 0),
        hasPrevPage: (data.pagination?.page || 1) > 1
      },
      userInfo: data.user_info || null
    });

  } catch (error) {
    console.error('Get favorite therapists error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorite therapists' },
      { status: 500 }
    );
  }
}
