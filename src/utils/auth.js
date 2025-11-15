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