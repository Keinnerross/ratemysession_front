import SearchLayout from "@/components/app/search-page/layout";
import { therapists as mockTherapists } from "@/data/therapists";
import { therapistService } from "@/services/therapists/therapistService";
import { commentService } from "@/services/comments/commentService";
import { transformTherapistData } from "@/utils/therapistTransformer";
import { transformTherapistLightData } from "@/utils/therapistLightTransformer";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  
  const searchTerm = params.q || "";
  const rating = params.rating ? parseInt(params.rating) : null;
  const location = params.location || "";
  const categories = params.categories ? params.categories.split(',') : [];
  
  let therapistsData = [];
  let filteredIds = [];
  let availableCategories = [];
  let availableLocations = [];
  
  try {
    // Paso 1: Fetch datos ligeros
    const allLightData = await therapistService.getTherapistsLight();
    const lightTransformed = transformTherapistLightData(allLightData);
    
    // Debug: verificar datos iniciales
    console.log('Total therapists light:', lightTransformed.length);
    console.log('First few therapists:', lightTransformed.slice(0, 3));
    
    availableCategories = [...new Set(lightTransformed.map(t => t.specialty))].sort();
    availableLocations = [...new Set(lightTransformed.map(t => t.location).filter(loc => loc))].sort();
    
    // Aplicar filtros
    let filtered = [...lightTransformed];
    
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (rating) {
      filtered = filtered.filter(t => Math.floor(t.rating || 0) === rating);
    }
    
    if (location) {
      filtered = filtered.filter(t => 
        t.location?.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (categories.length > 0) {
      filtered = filtered.filter(t => categories.includes(t.specialty));
    }
    
    filteredIds = filtered.map(t => t.id);
    
    console.log('After filtering - Found:', filtered.length);
    console.log('Filtered IDs:', filteredIds);
    
    // Paso 2: Fetch datos completos solo si hay resultados
    if (filteredIds.length > 0) {
      const pageIds = filteredIds.slice(0, 12);
      
      console.log('Fetching full data for IDs:', pageIds);
      
      const [fullData, commentCounts] = await Promise.all([
        therapistService.getTherapistsByIds(pageIds),
        commentService.getCommentCountsForPosts(pageIds)
      ]);
      
      const transformedData = transformTherapistData(fullData, commentCounts);
      
      console.log('Transformed data count:', transformedData.length);
      console.log('Transformed IDs:', transformedData.map(t => t.id));
      
      // Mapeo más robusto
      therapistsData = pageIds.map(id => {
        const therapist = transformedData.find(t => t.id === id);
        if (!therapist) {
          console.warn(`Therapist with ID ${id} not found in full data`);
          return null;
        }
        return therapist;
      }).filter(Boolean);
      
      console.log('Final therapists data:', therapistsData.length);
      
    } else {
      console.log('No therapists found after filtering');
    }
    
  } catch (error) {
    console.error('Error completo:', error);
    // Fallback a mock data
    therapistsData = mockTherapists.slice(0, 12);
    filteredIds = mockTherapists.map(t => t.id);
    availableCategories = [...new Set(mockTherapists.map(t => t.specialty))].sort();
    availableLocations = [...new Set(mockTherapists.map(t => t.location).filter(loc => loc))].sort();
  }
  
  const hasMore = filteredIds.length > 12;
  
  return <SearchLayout 
    data={therapistsData} 
    searchParams={params}
    availableCategories={availableCategories}
    availableLocations={availableLocations}
    hasMore={hasMore}
    filteredIds={filteredIds}
    totalResults={filteredIds.length}
  />;
}