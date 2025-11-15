import { apiClient } from '../api/client';
import { API_ROUTES } from '@/config/api';

/**
 * Service for managing user's favorite therapists
 * Handles fetching paginated favorite therapists with filtering and sorting
 */
class FavoritesTherapistsService {
  /**
   * Get user's favorite therapists with pagination and filters
   * @param {number} page - Page number (default 1)
   * @param {number} perPage - Items per page (default 6)
   * @param {Object} filters - Optional filters
   * @param {string} filters.order - Sort order ('asc' or 'desc')
   * @param {string} filters.rating - Filter by rating range, e.g., "4,5"
   * @returns {Promise<Object>} Therapists data with pagination info
   */
  async getFavoriteTherapists(page = 1, perPage = 6, filters = {}) {
    try {
      const params = {
        page,
        per_page: perPage
      };

      // Add optional filters
      if (filters.order) {
        params.order = filters.order;
      }

      if (filters.rating) {
        params.rating = filters.rating;
      }

      const response = await apiClient.get(API_ROUTES.USERS.FAVORITES_THERAPISTS, { params });

      return {
        therapists: response.therapists || [],
        pagination: {
          currentPage: response.pagination?.currentPage || 1,
          totalPages: response.pagination?.totalPages || 1,
          perPage: response.pagination?.perPage || perPage,
          total: response.pagination?.total || 0,
          hasNextPage: response.pagination?.hasNextPage || false,
          hasPrevPage: response.pagination?.hasPrevPage || false
        },
        userInfo: response.userInfo || null
      };
    } catch (error) {
      console.error('Error fetching favorite therapists:', error);
      throw error;
    }
  }

  /**
   * Transform backend therapist data to match frontend format
   * @param {Object} therapist - Therapist from backend
   * @returns {Object} Transformed therapist
   */
  transformTherapist(therapist) {
    // Get featured image URL from embedded data
    let imageUrl = null;
    let thumbnailUrl = null;

    if (therapist._embedded && therapist._embedded['wp:featuredmedia'] && therapist._embedded['wp:featuredmedia'][0]) {
      const media = therapist._embedded['wp:featuredmedia'][0];

      // Get thumbnail for cards (150x150 or medium)
      if (media.media_details?.sizes) {
        thumbnailUrl = media.media_details.sizes.thumbnail?.source_url ||
                      media.media_details.sizes.medium?.source_url ||
                      media.source_url;
      }

      // Full image for profile
      imageUrl = media.source_url || media.media_details?.sizes?.large?.source_url;
    }

    // Extract ACF data
    const acf = therapist.acf || {};

    // Build full address from ACF fields
    const addressParts = [];
    if (acf.Address) addressParts.push(acf.Address);
    if (acf.city) addressParts.push(acf.city);
    if (acf.state_address) {
      addressParts.push(`${acf.state_address}${acf.zip_code ? ' ' + acf.zip_code : ''}`);
    }
    const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : "New York, NY";

    // Determine location from ACF data
    const location = acf.city || "New York";

    // Use ACF rating directly
    const rating = parseFloat(acf.Rating || 0);

    // Extract credentials from class_list
    const credentials = this._extractCredentials(therapist.class_list);

    // Extract specialty
    const specialty = this._extractSpecialty(therapist);

    // Count reviews (use embedded replies if available)
    const reviewCount = this._countReviews(therapist);

    return {
      id: therapist.id,
      name: therapist.title?.rendered || '',
      slug: therapist.slug || '',
      image: imageUrl,
      thumbnail: thumbnailUrl,
      credentials: credentials,
      rating: rating,
      reviews: reviewCount,
      specialty: specialty,
      location: location,
      bio: "Professional therapist specializing in mental health and wellness.",
      insurance: ["Aetna", "Blue Cross"],
      address: fullAddress,
      website: acf.Website ? this._formatWebsiteUrl(acf.Website) : therapist.link,
      // Keep original data for reference
      _original: therapist,
      _acf: acf
    };
  }

  /**
   * Extract credentials from class list
   * @private
   */
  _extractCredentials(classList) {
    if (!classList || !Array.isArray(classList)) return [];

    return classList
      .filter(className => className.startsWith('credential-'))
      .map(credential => {
        // Remove 'credential-' prefix and format
        const cred = credential.replace('credential-', '');
        // Replace hyphens with spaces and uppercase appropriately
        return cred
          .split('-')
          .map(part => part.toUpperCase())
          .join(' ');
      });
  }

  /**
   * Extract specialty from therapist data
   * @private
   */
  _extractSpecialty(therapist) {
    // Check if ACF category exists and is not false or "Uncategorized"
    if (therapist.acf && therapist.acf.category &&
        therapist.acf.category !== false &&
        therapist.acf.category !== "Uncategorized") {
      return therapist.acf.category;
    }

    // Fallback to credentials-based category
    const credClasses = therapist.class_list || [];

    if (credClasses.some(c => c.includes('lcsw'))) return "Clinical Social Worker";
    if (credClasses.some(c => c.includes('lmhc'))) return "Mental Health Counselor";
    if (credClasses.some(c => c.includes('lmsw'))) return "Social Worker";
    if (credClasses.some(c => c.includes('lpc'))) return "Professional Counselor";
    if (credClasses.some(c => c.includes('mhc-lp'))) return "Mental Health Counselor";
    return "Other Specialties";
  }

  /**
   * Count approved comments/reviews
   * @private
   */
  _countReviews(therapist) {
    // Check if replies are embedded
    if (!therapist._embedded || !therapist._embedded.replies) {
      return 0;
    }

    const replies = therapist._embedded.replies;

    // Case 1: Array with count object [{count: N}]
    if (Array.isArray(replies) && replies[0]?.count !== undefined) {
      return replies[0].count;
    }

    // Case 2: Direct count object {count: N}
    if (replies.count !== undefined) {
      return replies.count;
    }

    // Case 3: Array of individual comments (fallback)
    if (Array.isArray(replies)) {
      return replies.length;
    }

    return 0;
  }

  /**
   * Format website URL to ensure it has a protocol
   * @private
   */
  _formatWebsiteUrl(url) {
    if (!url) return '';

    // If URL already has protocol, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Add https:// if no protocol
    return `https://${url}`;
  }

  /**
   * Transform multiple therapists
   * @param {Array} therapists - Therapists from backend
   * @returns {Array} Transformed therapists
   */
  transformTherapists(therapists) {
    return therapists.map(therapist => this.transformTherapist(therapist));
  }

  /**
   * Build filters object for API request
   * @param {string} sortBy - Sort option ('recent', 'rating', 'name')
   * @param {string} ratingFilter - Rating filter value
   * @returns {Object} Filters object for API
   */
  buildFilters(sortBy = 'recent', ratingFilter = '') {
    const filters = {};

    // Map sortBy to order parameter
    switch (sortBy) {
      case 'rating':
        filters.order = 'desc'; // Highest rating first
        break;
      case 'name':
        filters.order = 'asc'; // Alphabetical
        break;
      case 'recent':
      default:
        filters.order = 'desc'; // Most recent first
        break;
    }

    // Add rating filter if provided
    if (ratingFilter) {
      filters.rating = ratingFilter;
    }

    return filters;
  }
}

export default new FavoritesTherapistsService();
