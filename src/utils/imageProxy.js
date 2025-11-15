/**
 * Image Proxy Utilities
 * Handles conversion between WordPress media URLs and Next.js proxy URLs
 */

/**
 * Converts WordPress media URL to Next.js proxy URL
 * WordPress URL: http://rms-backend.local/wp-content/uploads/2025/11/photo.jpg
 * Proxy URL: /api/media/2025/11/photo.jpg
 *
 * Google URLs (or other external URLs) are returned as-is
 *
 * @param {string} url - The original image URL
 * @returns {string} - The converted proxy URL or original URL if external
 */
export function convertToProxyUrl(url) {
  if (!url) return null;

  // If it's already a proxy URL, return as-is
  if (url.startsWith('/api/media/')) {
    return url;
  }

  // If it's a WordPress upload URL, convert to proxy
  if (url.includes('/wp-content/uploads/')) {
    const match = url.match(/\/wp-content\/uploads\/(.+)$/);
    if (match) {
      return `/api/media/${match[1]}`;
    }
  }

  // External URLs (Google, etc.) are returned as-is
  return url;
}

/**
 * Converts Next.js proxy URL back to WordPress URL
 * This is mainly for debugging/logging purposes
 *
 * @param {string} proxyUrl - The proxy URL
 * @param {string} backendUrl - The WordPress backend URL (default: http://rms-backend.local)
 * @returns {string} - The WordPress URL
 */
export function convertFromProxyUrl(proxyUrl, backendUrl = 'http://rms-backend.local') {
  if (!proxyUrl) return null;

  if (proxyUrl.startsWith('/api/media/')) {
    const path = proxyUrl.replace('/api/media/', '');
    return `${backendUrl}/wp-content/uploads/${path}`;
  }

  return proxyUrl;
}
