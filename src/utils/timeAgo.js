/**
 * Format a date string to a human-readable "time ago" format in Spanish
 * @param {string} dateString - Date in format "YYYY-MM-DD HH:mm:ss" or ISO string
 * @returns {string} Formatted time ago string (e.g., "hace 2 horas", "hace 3 días")
 */
export function formatTimeAgo(dateString) {
  if (!dateString) return '';

  const now = new Date();
  const past = new Date(dateString.replace(' ', 'T')); // Handle "YYYY-MM-DD HH:mm:ss" format

  const diffInSeconds = Math.floor((now - past) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return 'hace unos segundos';
  } else if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? 'hace 1 minuto' : `hace ${diffInMinutes} minutos`;
  } else if (diffInHours < 24) {
    return diffInHours === 1 ? 'hace 1 hora' : `hace ${diffInHours} horas`;
  } else if (diffInDays < 7) {
    return diffInDays === 1 ? 'hace 1 día' : `hace ${diffInDays} días`;
  } else if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? 'hace 1 semana' : `hace ${diffInWeeks} semanas`;
  } else if (diffInMonths < 12) {
    return diffInMonths === 1 ? 'hace 1 mes' : `hace ${diffInMonths} meses`;
  } else {
    return diffInYears === 1 ? 'hace 1 año' : `hace ${diffInYears} años`;
  }
}

/**
 * Format a date string to a human-readable "time ago" format in English
 * @param {string} dateString - Date in format "YYYY-MM-DD HH:mm:ss" or ISO string
 * @returns {string} Formatted time ago string (e.g., "2 hours ago", "3 days ago")
 */
export function formatTimeAgoEnglish(dateString) {
  if (!dateString) return '';

  const now = new Date();
  const past = new Date(dateString.replace(' ', 'T'));

  const diffInSeconds = Math.floor((now - past) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  } else if (diffInDays < 7) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  } else if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
  } else if (diffInMonths < 12) {
    return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
  } else {
    return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
  }
}
