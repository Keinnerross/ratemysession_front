import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';

export const commentService = {
  // Get all comments and return a count map by post ID
  async getCommentCountsByPost() {
    try {
      const comments = await apiClient.get(ENDPOINTS.COMMENTS.LIST);
      
      // Create a map of post ID to comment count
      const countMap = {};
      
      if (Array.isArray(comments)) {
        comments.forEach(comment => {
          const postId = comment.post;
          if (postId) {
            countMap[postId] = (countMap[postId] || 0) + 1;
          }
        });
      }
      
      return countMap;
    } catch (error) {
      console.error('Failed to fetch comment counts:', error);
      return {};
    }
  },
  
  // Get comment counts for specific posts
  async getCommentCountsForPosts(postIds) {
    try {
      if (!postIds || postIds.length === 0) return {};

      const url = ENDPOINTS.COMMENTS.BY_POSTS(postIds);

      const comments = await apiClient.get(url);

      // Create a map of post ID to comment count
      const countMap = {};
      
      // Initialize all requested posts with 0
      postIds.forEach(id => {
        countMap[id] = 0;
      });
      
      if (Array.isArray(comments)) {
        comments.forEach(comment => {
          const postId = comment.post;
          if (postId && countMap.hasOwnProperty(postId)) {
            countMap[postId]++;
          }
        });
      }

      return countMap;
    } catch (error) {
      console.error('Failed to fetch comment counts for posts:', error);
      return {};
    }
  },
  
  // Get comments for a specific post
  async getCommentsByPost(postId) {
    try {
      return await apiClient.get(ENDPOINTS.COMMENTS.BY_POST(postId));
    } catch (error) {
      console.error(`Failed to fetch comments for post ${postId}:`, error);
      return [];
    }
  },
  
  // Get paginated comments for a therapist
  async getCommentsPaginated(therapistId, options = {}) {
    try {
      const params = new URLSearchParams();
      params.append('therapistId', therapistId);
      
      // Add optional parameters
      if (options.page) params.append('page', options.page);
      if (options.perPage) params.append('per_page', options.perPage);
      if (options.rating) params.append('rate', options.rating);
      if (options.sortBy) params.append('sort_by', options.sortBy);
      if (options.sortOrder) params.append('sort_order', options.sortOrder);
      
      const url = `${ENDPOINTS.COMMENTS.PAGINATED}?${params.toString()}`;
      return await apiClient.get(url);
    } catch (error) {
      console.error(`Failed to fetch paginated comments for therapist ${therapistId}:`, error);
      return {
        comments: [],
        pagination: {
          total_comments: 0,
          total_pages: 1,
          current_page: 1,
          per_page: 10,
          has_next_page: false,
          has_prev_page: false
        },
        rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
  }
};