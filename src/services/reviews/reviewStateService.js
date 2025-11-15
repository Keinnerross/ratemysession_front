import { apiClient } from '../api/client';

const ANONYMOUS_REVIEWS_KEY = 'anonymous_reviews';

class ReviewStateService {
  // Check if a logged-in user has already reviewed a therapist
  async hasUserReviewedTherapist(therapistId, userEmail) {
    if (!userEmail || !therapistId) return false;
    
    try {
      const response = await apiClient.get('/api/comments/user-comments', {
        params: {
          email: userEmail,
          therapist_id: therapistId
        }
      });
      
      // Check the therapist.has_commented field from the new endpoint
      const hasReviewed = response?.therapist?.has_commented || false;
      
      return hasReviewed;
    } catch (error) {
      console.error('Error checking user reviews:', error);
      return false;
    }
  }

  // Get list of therapist IDs that have been reviewed anonymously from this browser
  getAnonymousReviews() {
    try {
      if (typeof window === 'undefined') return [];
      
      const reviewsString = localStorage.getItem(ANONYMOUS_REVIEWS_KEY);
      if (!reviewsString) return [];
      
      const reviews = JSON.parse(reviewsString);
      return Array.isArray(reviews) ? reviews : [];
    } catch (error) {
      console.error('Error getting anonymous reviews:', error);
      return [];
    }
  }

  // Save that an anonymous review was made for a therapist
  saveAnonymousReview(therapistId) {
    try {
      if (typeof window === 'undefined') return;
      
      const reviews = this.getAnonymousReviews();
      if (!reviews.includes(therapistId)) {
        reviews.push(therapistId);
        localStorage.setItem(ANONYMOUS_REVIEWS_KEY, JSON.stringify(reviews));
      }
    } catch (error) {
      console.error('Error saving anonymous review:', error);
    }
  }

  // Check if user has already reviewed this therapist anonymously from this browser
  hasAnonymouslyReviewed(therapistId) {
    const anonymousReviews = this.getAnonymousReviews();
    return anonymousReviews.includes(therapistId);
  }

  // Determine if user can review and why they can't (if applicable)
  async canUserReview(therapistId, user) {
    // If user is logged in, check backend for any reviews (anonymous or not)
    if (user && user.email) {
      const hasReviewed = await this.hasUserReviewedTherapist(therapistId, user.email);
      if (hasReviewed) {
        return {
          canReview: false,
          reason: 'already-reviewed-logged',
          message: 'You have already reviewed this therapist'
        };
      }
    } else {
      // Only check localStorage for non-logged users
      if (this.hasAnonymouslyReviewed(therapistId)) {
        return {
          canReview: false,
          reason: 'already-reviewed-anonymous',
          message: 'You have already reviewed this therapist anonymously from this browser'
        };
      }
    }

    // User can review
    return {
      canReview: true,
      reason: null,
      message: null
    };
  }

  // Clear all anonymous reviews (useful for testing or user preference)
  clearAnonymousReviews() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(ANONYMOUS_REVIEWS_KEY);
      }
    } catch (error) {
      console.error('Error clearing anonymous reviews:', error);
    }
  }
}

export default new ReviewStateService();