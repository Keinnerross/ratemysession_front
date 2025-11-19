import SearchLayout from "@/components/app/search-page/layout";
import { therapists as mockTherapists } from "@/data/therapists";
import { therapistService } from "@/services/therapists/therapistService";
import { commentService } from "@/services/comments/commentService";
import { transformTherapistData } from "@/utils/therapistTransformer";
import { getAuthToken } from '@/utils/auth';

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;

  const searchTerm = params.q || "";
  const rating = params.rating ? parseInt(params.rating) : null;
  const location = params.location || "";
  const categories = params.categories ? params.categories.split(',') : [];
  const sort = params.sort || "recommended";

  let therapistsData = [];
  let availableCategories = [];
  let availableLocations = [];
  let totalResults = 0;
  let hasMore = false;
  let favoriteIds = [];
  
  try {
    // Paso 1: Obtener categorías y ubicaciones disponibles
    const categoriesData = await therapistService.getCategories();
    availableCategories = categoriesData.categories || [];
    availableLocations = categoriesData.locations || [];
    
    // Obtener favoritos del usuario si está autenticado
    const token = await getAuthToken();
    if (token) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/users/favorites`, {
          headers: {
            'Cookie': `authToken=${token}`,
          },
          cache: 'no-store'
        });
        
        if (response.ok) {
          const data = await response.json();
          favoriteIds = data.favorites || [];
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }
    
    // Paso 2: Buscar terapeutas con filtros aplicados del lado del servidor
    const searchResults = await therapistService.searchTherapists({
      page: 1,
      perPage: 12,
      q: searchTerm,
      rating,
      location,
      categories,
      sort
    });

    // Extraer IDs de los resultados
    const therapistIds = searchResults.map(t => t.id);
    
    // Paso 3: Si hay resultados, obtener los conteos de comentarios
    if (therapistIds.length > 0) {
      const commentCounts = await commentService.getCommentCountsForPosts(therapistIds);

      // Transformar los datos con los conteos de comentarios
      therapistsData = transformTherapistData(searchResults, commentCounts);
    }
    
    // Obtener información de paginación de los headers (si el API los proporciona)
    // Por ahora, asumimos que hay más si recibimos 12 resultados
    totalResults = searchResults.length;
    hasMore = searchResults.length === 12;

  } catch (error) {
    console.error('Error en búsqueda:', error);
    // Fallback a mock data
    therapistsData = mockTherapists.slice(0, 12);
    totalResults = mockTherapists.length;
    hasMore = mockTherapists.length > 12;
    availableCategories = [...new Set(mockTherapists.map(t => t.specialty))].sort();
    availableLocations = [...new Set(mockTherapists.map(t => t.location).filter(loc => loc))].sort();
    
    // Intentar obtener favoritos incluso si falla la búsqueda
    const token = await getAuthToken();
    if (token) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/users/favorites`, {
          headers: {
            'Cookie': `authToken=${token}`,
          },
          cache: 'no-store'
        });
        
        if (response.ok) {
          const data = await response.json();
          favoriteIds = data.favorites || [];
        }
      } catch (error) {
        console.error('Error fetching favorites in fallback:', error);
      }
    }
  }
  
  return <SearchLayout 
    data={therapistsData} 
    searchParams={params}
    availableCategories={availableCategories}
    availableLocations={availableLocations}
    hasMore={hasMore}
    totalResults={totalResults}
    initialFavoriteIds={favoriteIds}
  />;
}