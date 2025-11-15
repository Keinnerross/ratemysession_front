import { apiClient } from '../api/client';
import { API_ROUTES } from '@/config/api';

class UserService {
  /**
   * Update user profile data (name, etc.)
   * @param {Object} data - Data to update
   * @param {string} data.displayName - Display name
   * @param {string} data.firstName - First name (optional)
   * @param {string} data.lastName - Last name (optional)
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(data) {
    try {
      const response = await apiClient.put(
        API_ROUTES.USERS.UPDATE,
        data,
        'user'
      );

      return response;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Success response
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.post(
        API_ROUTES.USERS.CHANGE_PASSWORD,
        {
          currentPassword,
          newPassword
        },
        'user'
      );

      return response;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * Upload profile photo
   * @param {File} imageFile - Image file to upload
   * @returns {Promise<Object>} Response with image URL
   */
  async uploadProfilePhoto(imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      // Get token for auth
      const token = typeof window !== 'undefined'
        ? localStorage.getItem('authToken')
        : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(API_ROUTES.USERS.UPLOAD_PHOTO, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload photo');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      throw error;
    }
  }
}

export default new UserService();
