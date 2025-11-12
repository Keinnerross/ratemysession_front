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
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user_display_name));
        localStorage.setItem('userEmail', response.user_email);
        return { 
          success: true, 
          user: {
            displayName: response.user_display_name,
            email: response.user_email,
            nicename: response.user_nicename
          }
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

  async loginWithGoogle(credential) {
    try {
      const response = await apiClient.post('/api/auth/google', {
        credential,
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      });
      
      if (response.success && response.token) {
        // Guardar los datos de la sesión
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user.displayName));
        localStorage.setItem('userEmail', response.user.email);
        
        // Si hay una foto de perfil de Google, guardarla también
        if (response.user.picture) {
          localStorage.setItem('userPicture', response.user.picture);
        }
        
        return { 
          success: true, 
          user: response.user,
          isNewUser: response.user.isNewUser
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

  async validateToken() {
    try {
      const token = this.getToken();
      if (!token) return false;
      
      const response = await apiClient.post(ENDPOINTS.AUTH.VALIDATE, {}, 'user');
      return response.data && response.data.status === 200;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPicture');
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  getUser() {
    const displayName = localStorage.getItem('user');
    const email = localStorage.getItem('userEmail');
    if (displayName) {
      return { displayName, email };
    }
    return null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();