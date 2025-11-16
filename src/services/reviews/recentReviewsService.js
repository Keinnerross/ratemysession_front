import { apiClient } from '../api/client';
import { API_ROUTES } from '@/config/api';

class RecentReviewsService {
  /**
   * Get recent reviews from all therapists
   * @param {number} limit - Number of reviews to fetch (default 12)
   * @returns {Promise<Array>} Array of recent reviews
   */
  async getRecentReviews(limit = 12) {
    try {
      // Get userId from localStorage to use in transformation
      let userId = null;
      if (typeof window !== 'undefined') {
        const userIdFromStorage = localStorage.getItem('userId');
        if (userIdFromStorage) {
          userId = parseInt(userIdFromStorage);
        }
      }

      const response = await apiClient.get(API_ROUTES.RECENT_REVIEWS, {
        params: { limit },
        authType: 'user' // Include Authorization header with JWT token
      });

      // Transform the response with userId
      return this.transformReviews(response, userId);
    } catch (error) {
      console.error('Error fetching recent reviews:', error);
      throw error;
    }
  }

  /**
   * Transform backend review data to frontend format
   * @param {Array} reviews - Reviews from backend
   * @param {number|null} userId - Current user ID to determine userReaction
   * @returns {Array} Transformed reviews
   */
  transformReviews(reviews, userId = null) {
    if (!Array.isArray(reviews)) return [];

    return reviews.map(review => this.transformReview(review, userId));
  }

  /**
   * Transform single review
   * @param {Object} review - Review from backend
   * @param {number|null} userId - Current user ID to determine userReaction
   * @returns {Object} Transformed review
   */
  transformReview(review, userId = null) {
    // Parse reaction IDs to get counts
    const parseReactionCount = (value) => {
      if (!value || value === '' || typeof value === 'number') return 0;
      const strValue = String(value);
      if (strValue === '' || strValue === '0') return 0;
      // Count comma-separated IDs
      return strValue.split(',').filter(id => id.trim()).length;
    };

    // Parse reaction IDs array
    const parseReactionIds = (value) => {
      if (!value || value === '') return [];
      const strValue = String(value);
      if (strValue === '' || strValue === '0') return [];
      return strValue.split(',').map(id => id.trim()).filter(id => id);
    };

    const usefulIds = parseReactionIds(review.reactions?.useful);
    const lovedIds = parseReactionIds(review.reactions?.loved);
    const thankfulIds = parseReactionIds(review.reactions?.thankful);
    const ohNoIds = parseReactionIds(review.reactions?.oh_no);

    // Determine user's current reaction if userId is provided
    let userReaction = null;
    if (userId) {
      const userIdStr = String(userId);

      if (usefulIds.includes(userIdStr)) userReaction = 'useful';
      else if (lovedIds.includes(userIdStr)) userReaction = 'helpful';
      else if (thankfulIds.includes(userIdStr)) userReaction = 'insightful';
      else if (ohNoIds.includes(userIdStr)) userReaction = 'inappropriate';
    }

    return {
      id: review.comment_id,
      authorName: review.author_name,
      authorAvatar: review.author_avatar,
      date: review.date,
      content: review.content,
      rating: parseInt(review.rating) || 0,
      isAnonymous: review.anonymous === true || review.anonymous === 'true',
      therapist: {
        id: review.therapist?.id,
        name: review.therapist?.name,
        photo: review.therapist?.photo,
        link: review.therapist?.link,
        specialty: review.therapist?.specialty
      },
      reactions: {
        useful: parseReactionCount(review.reactions?.useful),
        helpful: parseReactionCount(review.reactions?.loved), // loved → helpful
        insightful: parseReactionCount(review.reactions?.thankful), // thankful → insightful
        inappropriate: parseReactionCount(review.reactions?.oh_no) // oh_no → inappropriate
      },
      userReaction: userReaction, // Current user's reaction
      // Keep original reaction IDs for potential future use
      _reactionIds: {
        useful: review.reactions?.useful || '',
        loved: review.reactions?.loved || '',
        thankful: review.reactions?.thankful || '',
        oh_no: review.reactions?.oh_no || ''
      }
    };
  }
}

export default new RecentReviewsService();
