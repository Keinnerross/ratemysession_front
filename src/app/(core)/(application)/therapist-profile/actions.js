'use server';

import { commentService } from "@/services/comments/commentService";
import { transformCommentData } from "@/utils/commentTransformer";

export async function loadMoreReviews(therapistId, page, sortBy = 'recent', filterRating = 'all') {
  try {
    // Por ahora usamos el endpoint existente que trae todos los comentarios
    // En el futuro, esto debería usar paginación real del servidor
    const allComments = await commentService.getCommentsByPost(therapistId);
    
    if (!allComments || !Array.isArray(allComments)) {
      return {
        reviews: [],
        hasMore: false,
        totalCount: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
    
    // Transform all comments
    const transformedComments = transformCommentData(allComments);
    
    // Calculate distribution from all comments (before filtering)
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    transformedComments.forEach(comment => {
      if (comment.rating >= 1 && comment.rating <= 5) {
        distribution[comment.rating]++;
      }
    });
    
    // Apply rating filter
    let filteredComments = transformedComments;
    if (filterRating !== 'all') {
      filteredComments = transformedComments.filter(comment => 
        comment.rating === parseInt(filterRating)
      );
    }
    
    // Apply sorting
    const sortedComments = [...filteredComments].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'helpful') {
        // Sort by total positive reactions (useful + helpful + insightful)
        // Don't count 'inappropriate' (oh-no) as it's negative
        const positiveReactionsA = (a.reactions.useful || 0) + 
                                  (a.reactions.helpful || 0) + 
                                  (a.reactions.insightful || 0);
        const positiveReactionsB = (b.reactions.useful || 0) + 
                                  (b.reactions.helpful || 0) + 
                                  (b.reactions.insightful || 0);
        return positiveReactionsB - positiveReactionsA;
      }
      return 0;
    });
    
    // Paginate results
    const perPage = 2;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedReviews = sortedComments.slice(startIndex, endIndex);
    
    // Check if there are more results
    const hasMore = endIndex < sortedComments.length;
    
    return {
      reviews: paginatedReviews,
      hasMore,
      totalCount: sortedComments.length,
      distribution
    };
  } catch (error) {
    console.error('Failed to load more reviews:', error);
    return {
      reviews: [],
      hasMore: false,
      totalCount: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }
}