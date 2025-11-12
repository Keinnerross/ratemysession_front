import { API_ROUTES } from '@/config/api';

// Exportar los endpoints desde la configuración centralizada
export const ENDPOINTS = {
  AUTH: API_ROUTES.AUTH,
  THERAPISTS: API_ROUTES.THERAPISTS,
  COMMENTS: API_ROUTES.COMMENTS,
  USERS: API_ROUTES.USERS
};

// Para compatibilidad con el código existente
export const BACKEND_URL = null; // Ya no se expone