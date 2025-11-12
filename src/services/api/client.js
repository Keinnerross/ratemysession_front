// Helper function to get user auth token from localStorage
const getUserToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper function to get headers
// authType: 'user' o 'none'
// Ya no necesitamos 'system' porque las API routes manejan eso
const getHeaders = (authType = 'none') => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (authType === 'user') {
    const token = getUserToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Helper function to build full URL
const buildUrl = (url) => {
  // Si estamos en el servidor y la URL es relativa, necesitamos construir la URL completa
  if (typeof window === 'undefined' && url.startsWith('/')) {
    // En el servidor, usar el host del request o un valor por defecto
    const host = process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3000}`;
    return `${host}${url}`;
  }
  return url;
};

export const apiClient = {
  async get(url, authType = 'none') {
    try {
      const fullUrl = buildUrl(url);
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: getHeaders(authType),
      });

      if (!response.ok) {
        // Intentar obtener el mensaje de error del response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // Si no se puede parsear el JSON, usar el mensaje por defecto
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in GET request:', error);
      throw error;
    }
  },

  async post(url, body, authType = 'none') {
    try {
      const fullUrl = buildUrl(url);
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: getHeaders(authType),
        body: JSON.stringify(body),
      });

      // Aceptar tanto 200 como 201 como respuestas exitosas
      if (!response.ok && response.status !== 201) {
        // Intentar obtener el mensaje de error del response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // Si no se puede parsear el JSON, usar el mensaje por defecto
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in POST request:', error);
      throw error;
    }
  },

  async put(url, body, authType = 'user') {
    try {
      const fullUrl = buildUrl(url);
      const response = await fetch(fullUrl, {
        method: 'PUT',
        headers: getHeaders(authType),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        // Intentar obtener el mensaje de error del response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // Si no se puede parsear el JSON, usar el mensaje por defecto
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in PUT request:', error);
      throw error;
    }
  },

  async delete(url, authType = 'user') {
    try {
      const fullUrl = buildUrl(url);
      const response = await fetch(fullUrl, {
        method: 'DELETE',
        headers: getHeaders(authType),
      });

      if (!response.ok) {
        // Intentar obtener el mensaje de error del response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // Si no se puede parsear el JSON, usar el mensaje por defecto
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error('Error in DELETE request:', error);
      throw error;
    }
  },
};