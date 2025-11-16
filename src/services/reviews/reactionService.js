import { apiClient } from '../api/client';
import { API_ROUTES } from '@/config/api';

class ReactionService {
  /**
   * Toggle a reaction on a comment
   * @param {number|string} commentId - Comment ID
   * @param {string} reactionType - Type of reaction: 'useful', 'helpful', 'insightful', 'inappropriate'
   * @returns {Promise<Object>} Updated reaction data
   */
  async toggleReaction(commentId, reactionType) {
    if (!commentId) {
      throw new Error('Comment ID is required');
    }

    if (!reactionType) {
      throw new Error('Reaction type is required');
    }

    const validReactions = ['useful', 'helpful', 'insightful', 'inappropriate'];
    if (!validReactions.includes(reactionType)) {
      throw new Error(`Invalid reaction type. Must be one of: ${validReactions.join(', ')}`);
    }

    try {
      const response = await apiClient.post(
        API_ROUTES.COMMENTS.TOGGLE_REACTION(commentId),
        { reactionType },
        'user' // Use user auth token
      );

      return response;
    } catch (error) {
      console.error('Error toggling reaction:', error);
      throw error;
    }
  }
}

export default new ReactionService();
