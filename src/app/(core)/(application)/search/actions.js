'use server';

import { therapistService } from "@/services/therapists/therapistService";
import { commentService } from "@/services/comments/commentService";
import { transformTherapistData } from "@/utils/therapistTransformer";

export async function loadMoreTherapists(page, searchParams = {}) {
  try {
    // Usar el nuevo servicio de búsqueda con paginación
    const searchResults = await therapistService.searchTherapists({
      page,
      perPage: 12,
      q: searchParams.q,
      rating: searchParams.rating,
      location: searchParams.location,
      categories: searchParams.categories,
      sort: searchParams.sort
    });
    
    // Extraer IDs de los resultados
    const therapistIds = searchResults.map(t => t.id);
    
    // Si hay resultados, obtener los conteos de comentarios
    let therapistsData = [];
    if (therapistIds.length > 0) {
      const commentCounts = await commentService.getCommentCountsForPosts(therapistIds);
      therapistsData = transformTherapistData(searchResults, commentCounts);
    }
    
    // Determinar si hay más resultados
    const hasMore = searchResults.length === 12;
    
    return {
      therapists: therapistsData,
      hasMore
    };
  } catch (error) {
    console.error('Failed to load more therapists:', error);
    return {
      therapists: [],
      hasMore: false
    };
  }
}