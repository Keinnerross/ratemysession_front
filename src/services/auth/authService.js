import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

class AuthService {
  async login(username, password) {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
        username,
        password
      });

      if (response.token) {
        const userId = response.user_id || this.extractUserIdFromToken(response.token);

        // Standardized user object structure
        const userObject = {
          id: userId,
          displayName: response.user_display_name,
          email: response.user_email,
          nicename: response.user_nicename,
          avatar: null,
          loginMethod: 'password'
        };

        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(userObject));

        // Keep legacy fields for backward compatibility
        localStorage.setItem('userId', userId);
        localStorage.setItem('userEmail', response.user_email);

        return {
          success: true,
          user: userObject
        };
      }

      return { success: false, message: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      // Si el error viene del response body, intentar extraer el mensaje
      if (error.message && error.message.includes('HTTP error')) {
        return {
          success: false,
          message: 'Error de autenticación. Verifica tus credenciales.'
        };
      }
      return {
        success: false,
        message: error.message || 'Error during login'
      };
    }
  }

  async register(email, password) {
    try {
      // Generar username desde el email (parte antes del @)
      const username = email.split('@')[0].toLowerCase();
      
      const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, {
        username,
        email,
        password
      });
      
      if (response.id) {
        // Auto login after successful registration
        // Simple JWT Login usa el email como username
        return await this.login(email, password);
      }
      
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      console.error('Register error:', error);
      
      // Si el error es por username duplicado, intentar con un sufijo
      if (error.message && error.message.includes('username already exists')) {
        // Generar username con número aleatorio
        const baseUsername = email.split('@')[0].toLowerCase();
        const randomSuffix = Math.floor(Math.random() * 1000);
        const newUsername = `${baseUsername}${randomSuffix}`;
        
        try {
          const retryResponse = await apiClient.post(ENDPOINTS.AUTH.REGISTER, {
            username: newUsername,
            email,
            password
          });
          
          if (retryResponse.id) {
            // Simple JWT Login usa el email como username
            return await this.login(email, password);
          }
        } catch (retryError) {
          return { 
            success: false, 
            message: 'Error al crear cuenta. Intenta con otro email.' 
          };
        }
      }
      
      return { 
        success: false, 
        message: error.message || 'Error durante el registro' 
      };
    }
  }

  async loginWithGoogle(googleUserInfo) {
    try {
      const response = await apiClient.post('/api/auth/google', googleUserInfo);
      console.log('Google login response:', response);

      if (response.success && response.data.token) {
        // Standardized user object structure
        const userObject = {
          id: response.data.user.id,
          displayName: response.data.user.displayName,
          email: response.data.user.email,
          username: response.data.user.username,
          avatar: response.data.user.avatar || null,
          loginMethod: 'google'
        };

        // Save authentication data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(userObject));

        // Keep legacy fields for backward compatibility
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('userEmail', response.data.user.email);
        if (response.data.user.avatar) {
          localStorage.setItem('userPicture', response.data.user.avatar);
        }

        console.log('Token saved:', response.data.token);
        console.log('User data saved:', userObject);

        return {
          success: true,
          user: userObject
        };
      }

      return { success: false, message: 'Google login failed' };
    } catch (error) {
      console.error('Google login error:', error);
      return {
        success: false,
        message: error.message || 'Error during Google login'
      };
    }
  }

  async loginWithFacebook(facebookUserInfo) {
    try {
      const response = await apiClient.post('/api/auth/facebook', facebookUserInfo);
      console.log('Facebook login response:', response);

      if (response.success && response.data.token) {
        // Standardized user object structure
        const userObject = {
          id: response.data.user.id,
          displayName: response.data.user.displayName,
          email: response.data.user.email,
          username: response.data.user.username,
          avatar: response.data.user.avatar || null,
          loginMethod: 'facebook'
        };

        // Save authentication data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(userObject));

        // Keep legacy fields for backward compatibility
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('userEmail', response.data.user.email);
        if (response.data.user.avatar) {
          localStorage.setItem('userPicture', response.data.user.avatar);
        }

        console.log('Token saved:', response.data.token);
        console.log('User data saved:', userObject);

        return {
          success: true,
          user: userObject
        };
      }

      return { success: false, message: 'Facebook login failed' };
    } catch (error) {
      console.error('Facebook login error:', error);
      return {
        success: false,
        message: error.message || 'Error during Facebook login'
      };
    }
  }

  async validateToken() {
    try {
      const token = this.getToken();
      console.log('Validating token:', token ? `Token exists (length: ${token.length})` : 'No token found');
      
      if (!token) return false;
      
      // Log first 20 chars of token for debugging (don't log full token for security)
      console.log('Token preview:', token.substring(0, 20) + '...');
      
      // Send JWT in the body as expected by Simple JWT Login
      const response = await apiClient.post(ENDPOINTS.AUTH.VALIDATE, {
        JWT: token
      }, 'none'); // Use 'none' to avoid sending Authorization header
      
      console.log('Validation response:', response);
      
      // Check for successful validation based on Simple JWT Login response format
      return response.success === true && response.data?.user;
    } catch (error) {
      console.error('Token validation error:', error.message);
      // Don't throw, just return false
      return false;
    }
  }
  async logout() {
    try {
      // Call logout endpoint to clear cookies
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Error calling logout endpoint:', error);
      // Continue with logout even if the endpoint fails
    }
    
    // Clear localStorage as well for backward compatibility
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPicture');
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Extract user ID from JWT token payload
   * @param {string} token - JWT token
   * @returns {string|null} User ID or null
   */
  extractUserIdFromToken(token) {
    if (!token) return null;

    try {
      // JWT format: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      // Decode base64 payload
      const payload = JSON.parse(atob(parts[1]));

      // Extract user ID from payload (could be 'id', 'user_id', or nested in 'data.user.id')
      return payload.id || payload.user_id || payload.data?.user?.id || payload.data?.user?.ID || null;
    } catch (error) {
      console.error('[AuthService] Error extracting userId from token:', error);
      return null;
    }
  }

  getUser() {
    const userString = localStorage.getItem('user');
    const email = localStorage.getItem('userEmail');
    const userPicture = localStorage.getItem('userPicture');
    let userId = localStorage.getItem('userId');

    // Fallback: if userId is not in localStorage, try to extract from token
    if (!userId) {
      const token = this.getToken();
      if (token) {
        userId = this.extractUserIdFromToken(token);
        if (userId) {
          // Save it for next time
          localStorage.setItem('userId', userId);
        }
      }
    }

    if (userString) {
      try {
        const parsedUser = JSON.parse(userString);

        // If parsed result is an object with user properties (new standardized format)
        if (typeof parsedUser === 'object' && parsedUser !== null && !Array.isArray(parsedUser)) {
          return {
            id: parsedUser.id || (userId ? parseInt(userId) : null),
            displayName: parsedUser.displayName,  // Extract displayName as string
            email: parsedUser.email || email,
            nicename: parsedUser.nicename,
            username: parsedUser.username,
            avatar: parsedUser.avatar || userPicture,
            loginMethod: parsedUser.loginMethod || null
          };
        }

        // Legacy format: if it's just a string (old format where user = displayName only)
        if (typeof parsedUser === 'string') {
          return {
            id: userId ? parseInt(userId) : null,
            displayName: parsedUser,
            email,
            avatar: userPicture
          };
        }
      } catch (e) {
        // Not valid JSON, treat as legacy plain string (very old format)
        return {
          id: userId ? parseInt(userId) : null,
          displayName: userString,
          email,
          avatar: userPicture
        };
      }
    }

    return null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();