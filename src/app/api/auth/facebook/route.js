import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function POST(request) {
  try {
    const config = getServerConfig();
    const userInfo = await request.json();

    // Facebook returns: { id, email, name, picture: { data: { url } } }
    const { email, name, id: facebookId, picture } = userInfo;
    const profilePictureUrl = picture?.data?.url || picture;

    // Validate required fields - email is mandatory
    if (!email) {
      return NextResponse.json({
        error: 'Tu cuenta de Facebook debe tener un email público. Por favor verifica la configuración de privacidad de tu cuenta de Facebook e intenta nuevamente.'
      }, { status: 400 });
    }

    if (!facebookId) {
      return NextResponse.json({
        error: 'Invalid Facebook account information'
      }, { status: 400 });
    }

    // Crear Basic Auth con credenciales del sistema
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');

    // Generate simple username and password for Facebook users
    const username = email.split('@')[0];
    const password = facebookId; // Use Facebook ID as password

    // Try to login first
    let loginResponse = await fetch(`${config.JWT_BASE}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      },
      body: JSON.stringify({ email, password })
    });

    let token;

    // If login fails, create user then login
    if (!loginResponse.ok) {
      // Register user
      const registerResponse = await fetch(`${config.JWT_BASE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        },
        body: JSON.stringify({
          email,
          user_login: username,
          password,
          AUTH_KEY: process.env.AUTH_CODE_REGISTER,
          display_name: name || username
        })
      });

      if (!registerResponse.ok) {
        const error = await registerResponse.json();
        // Si el usuario ya existe, intentar login con el password original
        if (error.message?.toLowerCase().includes('already') ||
            error.message?.toLowerCase().includes('exists') ||
            error.message?.toLowerCase().includes('registered')) {
          throw new Error('Este email ya está registrado. Por favor inicia sesión con tu email y contraseña.');
        }
        throw new Error(error.message || 'No se pudo crear la cuenta. Por favor intenta nuevamente.');
      }

      // Try login again after registration
      loginResponse = await fetch(`${config.JWT_BASE}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        },
        body: JSON.stringify({ email, password })
      });

      if (!loginResponse.ok) {
        throw new Error('No se pudo iniciar sesión. Por favor intenta nuevamente.');
      }
    }

    const loginData = await loginResponse.json();
    token = loginData.data.jwt;

    // Get user details
    const userResponse = await fetch(`${config.JWT_BASE}/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      },
      body: JSON.stringify({
        JWT: token
      })
    });

    let userData = {};
    if (userResponse.ok) {
      const userValidation = await userResponse.json();
      userData = userValidation.data?.user || {};
    }

    // Fetch existing user data to preserve custom profile settings
    let customAvatar = null;
    let customDisplayName = null;

    if (userData.ID) {
      try {
        const userDetailsResponse = await fetch(
          `${config.WP_API_BASE}/users/${userData.ID}?context=edit`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${basicAuth}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (userDetailsResponse.ok) {
          const userDetails = await userDetailsResponse.json();

          // Check if user has custom profile picture
          if (userDetails.acf?.user_profile_picture_url) {
            customAvatar = userDetails.acf.user_profile_picture_url;
          }

          // Check if user has custom display name (different from username)
          if (userDetails.name && userDetails.name !== userDetails.user_login) {
            customDisplayName = userDetails.name;
          }
        }
      } catch (error) {
        console.error('Error fetching existing user data:', error);
      }
    }

    // Save Facebook profile picture only if user doesn't have a custom one
    if (profilePictureUrl && userData.ID && !customAvatar) {
      try {
        const updateUserResponse = await fetch(`${config.WP_API_BASE}/users/${userData.ID}`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            acf: {
              user_profile_picture_url: profilePictureUrl
            }
          })
        });

        if (!updateUserResponse.ok) {
          console.warn('Failed to save Facebook profile picture to ACF field');
        }
      } catch (error) {
        console.error('Error saving Facebook profile picture to ACF:', error);
      }
    }

    // Prepare response data with preserved custom data
    const responseData = {
      success: true,
      data: {
        token,
        user: {
          id: userData.ID,
          email: email,
          displayName: customDisplayName || name || userData.display_name || username,
          username: userData.user_login || username,
          avatar: customAvatar || profilePictureUrl
        }
      }
    };

    const response = NextResponse.json(responseData);

    // Set httpOnly cookie with the token
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    // Also set user data in cookies
    response.cookies.set('userData', JSON.stringify({
      id: userData.ID,
      email: email,
      displayName: name || userData.display_name || username,
      avatar: profilePictureUrl,
      loginMethod: 'facebook'
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Facebook login error:', error.message);
    return NextResponse.json({
      error: error.message || 'Autenticación fallida. Por favor intenta nuevamente.'
    }, { status: 500 });
  }
}
