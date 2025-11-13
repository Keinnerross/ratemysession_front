import { apiClient } from '../api/client';

const REVIEW_DRAFT_KEY = 'pendingReview';

class ReviewService {
  // Submit a review to WordPress Comments
  async submitReview(postId, content, rating, isAnonymous = true, userData = null) {
    try {
      const reviewData = {
        post: postId,
        content,
        rating,
        isAnonymous,
        author: !isAnonymous && userData?.id ? userData.id : null,
        author_name: isAnonymous ? 'Anonymous' : userData?.displayName || userData?.email?.split('@')[0] || 'User',
        author_email: userData?.email || (isAnonymous ? 'anonymous@ratemysession.com' : '')
      };

      const response = await apiClient.post('/api/comments', reviewData);
      
      if (response.id) {
        // Clear any saved draft after successful submission
        this.clearReviewDraft();
        return { success: true, data: response };
      }
      
      // Check if it's a duplicate review error
      if (response.code === 'DUPLICATE_REVIEW' || response.error?.includes('already reviewed')) {
        return { success: false, error: 'You have already reviewed this therapist' };
      }
      
      return { success: false, error: response.error || 'Failed to create review' };
    } catch (error) {
      console.error('Review submission error:', error);
      return { 
        success: false, 
        error: error.message || 'Error submitting review' 
      };
    }
  }

  // Save review draft to localStorage
  saveReviewDraft(therapistId, reviewData) {
    try {
      const draft = {
        therapistId,
        rating: reviewData.rating,
        title: reviewData.title || '',
        content: reviewData.content,
        savedAt: new Date().toISOString()
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(REVIEW_DRAFT_KEY, JSON.stringify(draft));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save review draft:', error);
      return false;
    }
  }

  // Get saved review draft
  getReviewDraft() {
    try {
      if (typeof window === 'undefined') return null;
      
      const draftString = localStorage.getItem(REVIEW_DRAFT_KEY);
      if (!draftString) return null;
      
      const draft = JSON.parse(draftString);
      
      // Check if draft is older than 24 hours
      const savedAt = new Date(draft.savedAt);
      const now = new Date();
      const hoursDiff = (now - savedAt) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        this.clearReviewDraft();
        return null;
      }
      
      return draft;
    } catch (error) {
      console.error('Failed to get review draft:', error);
      return null;
    }
  }

  // Clear saved review draft
  clearReviewDraft() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(REVIEW_DRAFT_KEY);
      }
    } catch (error) {
      console.error('Failed to clear review draft:', error);
    }
  }

  // Check if there's a pending review
  hasPendingReview() {
    return this.getReviewDraft() !== null;
  }
}

export default new ReviewService();