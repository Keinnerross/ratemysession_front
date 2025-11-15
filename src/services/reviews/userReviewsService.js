import { apiClient } from '../api/client';
import { API_ROUTES } from '@/config/api';

class UserReviewsService {
  /**
   * Get user reviews with pagination and filters
   * @param {string} email - User email
   * @param {number} page - Page number (default 1)
   * @param {number} perPage - Items per page (default 10)
   * @param {Object} filters - Optional filters
   * @param {string} filters.rate - Filter by rating (1-5)
   * @param {string} filters.order - Sort order ('asc' or 'desc')
   * @param {string} filters.therapistId - Filter by specific therapist
   * @returns {Promise<Object>} Reviews data with pagination info
   */
  async getUserReviews(email, page = 1, perPage = 10, filters = {}) {
    if (!email) {
      throw new Error('Email is required to fetch user reviews');
    }

    try {
      const params = {
        email,
        page,
        per_page: perPage
      };

      // Add optional filters
      if (filters.rate) {
        params.rate = filters.rate;
      }

      if (filters.order) {
        params.order = filters.order;
      }

      if (filters.therapistId) {
        params.therapist_id = filters.therapistId;
      }

      const response = await apiClient.get(API_ROUTES.COMMENTS.USER_COMMENTS, { params });

      return {
        reviews: response.comments || [],
        pagination: {
          currentPage: response.current_page || 1,
          totalPages: response.total_pages || 1,
          perPage: response.per_page || perPage,
          totalComments: response.total_comments || 0,
          hasNextPage: response.has_next_page || false,
          hasPrevPage: response.has_prev_page || false
        },
        filters: response.filters_applied || {},
        hasComments: response.has_comments || false,
        userEmail: response.user_email
      };
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  }

  /**
   * Transform backend review data to match frontend format
   * @param {Object} review - Review from backend
   * @returns {Object} Transformed review
   */
  transformReview(review) {
    return {
      id: review.id,
      therapistId: review.post_id || review.post,
      therapistName: review.therapist_name || review.post_title,
      therapistImage: review.therapist_image || review.therapist_photo || review.featured_image || null,
      content: review.content,
      date: review.date,
      dateGmt: review.date_gmt,
      rating: parseInt(review.meta?.rate || review.acf?.rate || 0),
      isAnonymous: review.meta?.anonymous === '1' || review.acf?.anonymous === '1',
      status: review.status === 'approved' ? 'completed' : 'pending',
      statusCode: review.status_code,
      authorName: review.author_name,
      authorEmail: review.author_email,
      meta: review.meta || review.acf,
      postLink: review.post_link,
      commentLink: review.comment_link
    };
  }

  /**
   * Transform multiple reviews
   * @param {Array} reviews - Reviews from backend
   * @returns {Array} Transformed reviews
   */
  transformReviews(reviews) {
    return reviews.map(review => this.transformReview(review));
  }

  /**
   * Toggle review visibility (anonymous <-> public)
   * @param {number} reviewId - Review ID
   * @param {boolean} currentIsAnonymous - Current anonymous status
   * @returns {Promise<Object>} Updated review
   */
  async toggleVisibility(reviewId, currentIsAnonymous) {
    if (!reviewId) {
      throw new Error('Review ID is required');
    }

    try {
      const newAnonymousValue = currentIsAnonymous ? '0' : '1';

      const response = await apiClient.put(
        API_ROUTES.COMMENTS.UPDATE(reviewId),
        {
          acf: {
            anonymous: newAnonymousValue
          }
        },
        'user'
      );

      return response;
    } catch (error) {
      console.error('Error toggling review visibility:', error);
      throw error;
    }
  }

  /**
   * Delete a review
   * @param {number} reviewId - Review ID
   * @returns {Promise<Object>} Delete response
   */
  async deleteReview(reviewId) {
    if (!reviewId) {
      throw new Error('Review ID is required');
    }

    try {
      const response = await apiClient.delete(
        API_ROUTES.COMMENTS.DELETE(reviewId),
        'user'
      );

      return response;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
}

export default new UserReviewsService();