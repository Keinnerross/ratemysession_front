import { apiClient } from '../api/client';
import { API_ROUTES } from '@/config/api';

export const aiSummaryService = {
  /**
   * Toggle useful reaction for AI review summary
   * @param {number} therapistId - The therapist ID
   * @returns {Promise<{success: boolean, usefulCount: number, isUseful: boolean}>}
   */
  async toggleUsefulReaction(therapistId) {
    try {
      const response = await apiClient.post(
        API_ROUTES.THERAPISTS.aiSummaryUseful(therapistId),
        {},        // Empty body (no data needed for toggle)
        'user'     // User authentication required
      );

      return response;  // apiClient already returns parsed JSON
    } catch (error) {
      console.error('Error toggling AI summary useful reaction:', error);
      throw error;
    }
  },
};
