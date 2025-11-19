import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function GET(request) {
  try {
    const config = getServerConfig();
    const { searchParams } = new URL(request.url);

    // Crear Basic Auth con credenciales del sistema
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');

    // Parámetros de búsqueda y filtros
    const page = searchParams.get('page') || 1;
    const perPage = searchParams.get('per_page') || 12;
    const searchTerm = searchParams.get('q') || '';
    const rating = searchParams.get('rating');
    const location = searchParams.get('location') || '';
    const categories = searchParams.get('categories') || '';
    const sort = searchParams.get('sort') || 'recommended';

    // Construir URL para el endpoint personalizado
    let url = `${config.BACKEND_URL}/wp-json/custom/v1/therapists/search?page=${page}&per_page=${perPage}`;

    // Búsqueda general: usar parámetro 'search' con lógica OR
    // Busca en nombre, dirección, ciudad, estado, categoría
    if (searchTerm) {
      const encodedTerm = encodeURIComponent(searchTerm);
      url += `&search=${encodedTerm}`;
    }

    // Filtro por rating (estrellas exactas)
    if (rating) {
      url += `&stars=${rating}`;
    }

    // Filtro por ubicación
    if (location) {
      url += `&city=${encodeURIComponent(location)}`;
    }

    // Filtro por categoría (singular)
    if (categories) {
      // Si hay múltiples categorías separadas por coma, tomar solo la primera
      let category = categories.split(',')[0];

      // Mapear "Other Specialties" (UI label) → "Uncategorized" (WordPress internal)
      if (category === "Other Specialties") {
        category = "Uncategorized";
      }

      url += `&category=${encodeURIComponent(category)}`;
    }

    // Ordenamiento
    const orderbyMap = {
      'recommended': 'recommended',
      'name-asc': 'title_asc',
      'name-desc': 'title_desc'
    };
    const orderby = orderbyMap[sort] || 'recommended';
    url += `&orderby=${orderby}`;

    // Llamar al endpoint personalizado
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // El endpoint personalizado devuelve un objeto con estructura:
    // {
    //   page: 1,
    //   per_page: 12,
    //   total_posts: 25,
    //   total_pages: 3,
    //   orderby: "recommended",
    //   order: "ASC",
    //   therapists: [ ... ]
    // }

    const therapists = data.therapists || [];
    const totalPosts = data.total_posts || 0;
    const totalPages = data.total_pages || 0;

    // Normalizar estructura para que coincida con formato WordPress estándar
    // El custom endpoint retorna title como string, pero el transformer espera {rendered: "..."}
    const normalizedTherapists = therapists.map(therapist => ({
      ...therapist,
      // Convertir title string a objeto {rendered: "..."}
      title: typeof therapist.title === 'string'
        ? { rendered: therapist.title }
        : therapist.title,
      // Agregar estructura _embedded vacía si no existe
      // (custom endpoint no incluye imágenes embebidas, usaremos featured_media ID si está disponible)
      _embedded: therapist._embedded || {}
    }));

    // Crear headers de paginación
    const headers = new Headers();
    headers.set('x-wp-total', totalPosts.toString());
    headers.set('x-wp-totalpages', totalPages.toString());

    // Devolver el array de terapeutas normalizado
    return NextResponse.json(normalizedTherapists, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Therapists search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
