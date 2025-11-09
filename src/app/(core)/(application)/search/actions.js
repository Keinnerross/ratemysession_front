'use server';

import { therapistService } from "@/services/therapists/therapistService";
import { commentService } from "@/services/comments/commentService";
import { transformTherapistData } from "@/utils/therapistTransformer";

export async function loadMoreTherapists(page, filteredIds = []) {
  try {
    // Calculate which IDs to fetch based on page
    const startIndex = (page - 1) * 12;
    const endIndex = startIndex + 12;
    const pageIds = filteredIds.slice(startIndex, endIndex);
    
    if (pageIds.length === 0) {
      return {
        therapists: [],
        hasMore: false
      };
    }
    
    // Fetch full data for these specific IDs
    const fullData = await therapistService.getTherapistsByIds(pageIds);
    
    // Fetch comment counts for these therapists
    const commentCounts = await commentService.getCommentCountsForPosts(pageIds);
    
    // Transform data with comment counts
    const transformedData = transformTherapistData(fullData, commentCounts);
    
    // Reorder results to match the filtered order
    const therapistsData = pageIds.map(id => 
      transformedData.find(t => t.id === id)
    ).filter(Boolean);
    
    // Check if there are more results
    const hasMore = endIndex < filteredIds.length;
    
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