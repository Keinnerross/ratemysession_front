// Configuración centralizada de la API

// Solo para uso en el servidor (API routes)
export const getServerConfig = () => {
  if (typeof window !== 'undefined') {
    throw new Error('getServerConfig solo puede ser usado en el servidor');
  }

  const required = ['BACKEND_URL', 'USER_AUTH', 'PASSWORD_AUTH'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Variables de entorno faltantes: ${missing.join(', ')}`);
  }

  return {
    BACKEND_URL: process.env.BACKEND_URL,
    WORDPRESS_URL: process.env.BACKEND_URL,
    SYSTEM_USER: process.env.USER_AUTH,
    SYSTEM_PASSWORD: process.env.PASSWORD_AUTH,
    // Construir URLs base
    WP_API_BASE: `${process.env.BACKEND_URL}/wp-json/wp/v2`,
    JWT_BASE: `${process.env.BACKEND_URL}/wp-json/simple-jwt-login/v1`
  };
};

// Para uso en el cliente - solo rutas de API internas
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    VALIDATE: '/api/auth/validate',
    LOGOUT: '/api/auth/logout'
  },
  THERAPISTS: {
    LIST: '/api/therapists',
    DETAIL: (id) => `/api/therapists/${id}`,
    SEARCH: '/api/therapists/search',
    CREATE: '/api/therapists'
  },
  COMMENTS: {
    LIST: '/api/comments',
    BY_POST: (postId) => `/api/comments?post=${postId}`,
    BY_POSTS: (postIds) => `/api/comments?include=${postIds.join(',')}`,
    PAGINATED: '/api/comments/paginated',
    USER_COMMENTS: '/api/comments/user-comments',
    UPDATE: (id) => `/api/comments/${id}`,
    DELETE: (id) => `/api/comments/${id}`
  },
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE: '/api/users/update',
    CHANGE_PASSWORD: '/api/users/change-password',
    UPLOAD_PHOTO: '/api/users/upload-photo',
    FAVORITES: '/api/users/favorites',
    FAVORITE_ADD: '/api/users/favorites',
    FAVORITE_REMOVE: (id) => `/api/users/favorites/${id}`,
    FAVORITES_THERAPISTS: '/api/users/favorites-therapists'
  }
};