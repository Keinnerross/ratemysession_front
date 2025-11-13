import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const therapistService = {
  async getTherapists(page = 1, perPage = 12) {
    try {
      const url = `${ENDPOINTS.THERAPISTS.LIST}?page=${page}&per_page=${perPage}`;
      const data = await apiClient.get(url);
      return data;
    } catch (error) {
      console.error('Error fetching therapists:', error);
      throw error;
    }
  },
  
  async getTherapistById(id) {
    try {
      const data = await apiClient.get(ENDPOINTS.THERAPISTS.DETAIL(id));
      return data;
    } catch (error) {
      console.error(`Error fetching therapist ${id}:`, error);
      throw error;
    }
  },
  
  // Search therapists with filters
  async searchTherapists(params = {}) {
    try {
      const { page = 1, perPage = 12, q, rating, location, categories } = params;
      const queryParams = new URLSearchParams();
      
      queryParams.append('page', page);
      queryParams.append('per_page', perPage);
      
      if (q) queryParams.append('q', q);
      if (rating) queryParams.append('rating', rating);
      if (location) queryParams.append('location', location);
      if (categories && categories.length > 0) {
        queryParams.append('categories', categories.join(','));
      }
      
      const url = `${ENDPOINTS.THERAPISTS.SEARCH}?${queryParams.toString()}`;
      const data = await apiClient.get(url);
      return data;
    } catch (error) {
      console.error('Error searching therapists:', error);
      throw error;
    }
  },
  
  // Get available categories and locations
  async getCategories() {
    try {
      const data = await apiClient.get('/api/therapists/categories');
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  // Get therapists by specific IDs
  async getTherapistsByIds(ids) {
    try {
      if (!ids || ids.length === 0) return [];
      const url = `${ENDPOINTS.THERAPISTS.LIST}?include=${ids.join(',')}`;
      const data = await apiClient.get(url);
      return data;
    } catch (error) {
      console.error('Error fetching therapists by IDs:', error);
      throw error;
    }
  },
  
  // Create a new therapist
  async createTherapist(therapistData, isAnonymous = false) {
    try {
      const payload = {
        ...therapistData,
        isAnonymous
      };
      const data = await apiClient.post(ENDPOINTS.THERAPISTS.CREATE, payload);
      return data;
    } catch (error) {
      console.error('Error creating therapist:', error);
      throw error;
    }
  },
  
  // Save therapist draft for later submission
  saveTherapistDraft(therapistData) {
    try {
      localStorage.setItem('therapistDraft', JSON.stringify(therapistData));
    } catch (error) {
      console.error('Error saving therapist draft:', error);
    }
  },
  
  // Get saved therapist draft
  getTherapistDraft() {
    try {
      const draft = localStorage.getItem('therapistDraft');
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Error getting therapist draft:', error);
      return null;
    }
  },
  
  // Clear therapist draft
  clearTherapistDraft() {
    try {
      localStorage.removeItem('therapistDraft');
    } catch (error) {
      console.error('Error clearing therapist draft:', error);
    }
  },
};