import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function POST(request) {
  try {
    const config = getServerConfig();
    const userInfo = await request.json();
    const { email, name, sub: googleId, picture } = userInfo;
    
    if (!email || !googleId) {
      return NextResponse.json({ 
        error: 'Invalid Google account information' 
      }, { status: 400 });
    }

    // Crear Basic Auth con credenciales del sistema
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');

    // Generate simple username and password for Google users
    const username = email.split('@')[0];
    const password = googleId;

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
          throw new Error('This email is already registered. Please sign in with your email and password.');
        }
        throw new Error(error.message || 'Unable to create account. Please try again.');
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
        throw new Error('Unable to sign in. Please try again.');
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

    // Save Google profile picture to user's ACF field for persistence
    if (picture && userData.ID) {
      try {
        const updateUserResponse = await fetch(`${config.WP_API_BASE}/users/${userData.ID}`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            acf: {
              user_profile_picture_url: picture
            }
          })
        });

        if (!updateUserResponse.ok) {
          console.warn('Failed to save Google profile picture to ACF field');
        }
      } catch (error) {
        console.error('Error saving Google profile picture to ACF:', error);
      }
    }

    // Prepare response data
    const responseData = {
      success: true,
      data: {
        token,
        user: {
          id: userData.ID,
          email: email,
          displayName: name || userData.display_name || username,
          username: userData.user_login || username,
          avatar: picture
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
      avatar: picture
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    return response;

  } catch (error) {
    console.error('Google login error:', error.message);
    return NextResponse.json({ 
      error: error.message || 'Authentication failed. Please try again.' 
    }, { status: 500 });
  }
}