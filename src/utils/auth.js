import { cookies } from 'next/headers';

/**
 * Get auth token from cookies (Server Component only)
 */
export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('authToken')?.value;
}

/**
 * Get user data from cookies (Server Component only)
 */
export async function getUserDataFromCookies() {
  const cookieStore = await cookies();
  const userDataCookie = cookieStore.get('userData')?.value;
  
  if (!userDataCookie) return null;
  
  try {
    return JSON.parse(userDataCookie);
  } catch (error) {
    console.error('Error parsing user data from cookies:', error);
    return null;
  }
}

/**
 * Clear auth cookies (for logout)
 */
export function clearAuthCookies(response) {
  response.cookies.delete('authToken');
  response.cookies.delete('userData');
  return response;
}

/**
 * Get user ID from JWT token (Server Component only)
 * Validates the token and returns the user ID
 */
export async function getUserIdFromToken() {
  const token = await getAuthToken();

  if (!token) return null;

  try {
    const backendUrl = process.env.BACKEND_URL;
    const systemUser = process.env.USER_AUTH;
    const systemPassword = process.env.PASSWORD_AUTH;

    const authString = `${systemUser}:${systemPassword}`;
    const basicAuth = Buffer.from(authString).toString('base64');

    const validateResponse = await fetch(`${backendUrl}/wp-json/simple-jwt-login/v1/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      },
      body: JSON.stringify({ JWT: token }),
      cache: 'no-store'
    });

    if (!validateResponse.ok) {
      return null;
    }

    const validateData = await validateResponse.json();
    return validateData.data?.user?.ID || null;
  } catch (error) {
    console.error('Error validating token:', error);
    return null;
  }
}