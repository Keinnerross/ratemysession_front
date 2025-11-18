'use server';

import { commentService } from "@/services/comments/commentService";
import { transformCommentData } from "@/utils/commentTransformer";

export async function loadMoreReviews(therapistId, page, sortBy = 'recent', filterRating = 'all', userId = null) {
  try {
    // Map frontend sort values to API values
    const sortMapping = {
      'recent': 'date',
      'helpful': 'helpful'
    };

    // Use the new paginated endpoint
    const response = await commentService.getCommentsPaginated(therapistId, {
      page: page,
      perPage: 5,
      rating: filterRating === 'all' ? null : filterRating,
      sortBy: sortMapping[sortBy] || 'date',
      sortOrder: 'desc' // Always descending for now
    });

    if (!response || !response.comments) {
      return {
        reviews: [],
        hasMore: false,
        totalCount: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    // Transform the comments from the API with userId for reaction state
    const transformedComments = transformCommentData(response.comments, userId);

    // Normalize the distribution from the API response
    // Backend returns keys as strings ("1", "2", etc.), convert to numbers
    const rawDistribution = response.rating_distribution || {};
    const distribution = {
      5: parseInt(rawDistribution["5"] || rawDistribution[5] || 0),
      4: parseInt(rawDistribution["4"] || rawDistribution[4] || 0),
      3: parseInt(rawDistribution["3"] || rawDistribution[3] || 0),
      2: parseInt(rawDistribution["2"] || rawDistribution[2] || 0),
      1: parseInt(rawDistribution["1"] || rawDistribution[1] || 0)
    };

    return {
      reviews: transformedComments,
      hasMore: response.pagination?.has_next_page || false,
      totalCount: response.pagination?.total_comments || 0,
      distribution: distribution
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