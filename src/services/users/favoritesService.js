import { apiClient } from '../api/client';
import { API_ROUTES } from '@/config/api';

class FavoritesService {
  // Obtener lista de IDs de terapeutas favoritos
  async getFavorites() {
    try {
      const response = await apiClient.get(API_ROUTES.USERS.FAVORITES);
      return response.favorites || [];
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  }

  // Agregar terapeuta a favoritos
  async addFavorite(therapistId) {
    try {
      const response = await apiClient.post(API_ROUTES.USERS.FAVORITE_ADD, {
        therapistId
      });
      return response.success;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  // Quitar terapeuta de favoritos
  async removeFavorite(therapistId) {
    try {
      const response = await apiClient.delete(API_ROUTES.USERS.FAVORITE_REMOVE(therapistId));
      return response.success;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  // Verificar si un terapeuta está en favoritos
  async isFavorite(therapistId) {
    try {
      const favorites = await this.getFavorites();
      return favorites.includes(parseInt(therapistId));
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  // Toggle favorito (agregar si no existe, quitar si existe)
  async toggleFavorite(therapistId, currentState) {
    try {
      if (currentState) {
        return await this.removeFavorite(therapistId);
      } else {
        return await this.addFavorite(therapistId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }
}

export default new FavoritesService();