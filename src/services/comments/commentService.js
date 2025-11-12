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
      
      console.log('Fetching comments for post IDs:', postIds);
      const url = ENDPOINTS.COMMENTS.BY_POSTS(postIds);
      console.log('Comments URL:', url);
      
      const comments = await apiClient.get(url);
      console.log('Comments API response:', comments);
      console.log('Comments is array?', Array.isArray(comments));
      console.log('Comments length:', comments?.length);
      
      // Create a map of post ID to comment count
      const countMap = {};
      
      // Initialize all requested posts with 0
      postIds.forEach(id => {
        countMap[id] = 0;
      });
      
      if (Array.isArray(comments)) {
        comments.forEach(comment => {
          const postId = comment.post;
          console.log('Comment post ID:', postId, 'Type:', typeof postId);
          if (postId && countMap.hasOwnProperty(postId)) {
            countMap[postId]++;
          }
        });
      }
      
      console.log('Final comment count map:', countMap);
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
  }
};