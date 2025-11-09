import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const therapistService = {
  async getTherapists(page = 1, perPage = 12) {
    try {
      const data = await apiClient.get(ENDPOINTS.THERAPISTS.LIST(page, perPage));
      return data;
    } catch (error) {
      console.error('Error fetching therapists:', error);
      throw error;
    }
  },
  
  async getTherapistById(id) {
    try {
      const data = await apiClient.get(ENDPOINTS.THERAPISTS.SINGLE(id));
      return data;
    } catch (error) {
      console.error(`Error fetching therapist ${id}:`, error);
      throw error;
    }
  },
  
  // Get lightweight therapist data for filtering
  async getTherapistsLight() {
    try {
      const data = await apiClient.get(ENDPOINTS.THERAPISTS.LIST_LIGHT);
      return data;
    } catch (error) {
      console.error('Error fetching light therapists:', error);
      throw error;
    }
  },
  
  // Get therapists by specific IDs
  async getTherapistsByIds(ids) {
    try {
      if (!ids || ids.length === 0) return [];
      const data = await apiClient.get(ENDPOINTS.THERAPISTS.BY_IDS(ids));
      return data;
    } catch (error) {
      console.error('Error fetching therapists by IDs:', error);
      throw error;
    }
  },
};