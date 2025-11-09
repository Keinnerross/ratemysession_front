const BACKEND_URL = process.env.BACKEND_URL || 'http://rms-backend.local';
const API_BASE = `${BACKEND_URL}/wp-json/wp/v2`;

export const ENDPOINTS = {
  THERAPISTS: {
    LIST: (page = 1, perPage = 12) => `${API_BASE}/therapists?_embed=wp:featuredmedia&page=${page}&per_page=${perPage}`,
    LIST_LIGHT: `${API_BASE}/therapists?per_page=100&_fields=id,title,slug,acf,class_list`, // Lightweight version for filtering
    SINGLE: (id) => `${API_BASE}/therapists/${id}?_embed=wp:featuredmedia`,
    BY_IDS: (ids) => `${API_BASE}/therapists?include=${ids.join(',')}&_embed=wp:featuredmedia`,
  },
  MEDIA: {
    SINGLE: (id) => `${API_BASE}/media/${id}`,
  },
  COMMENTS: {
    BY_POST: (postId) => `${API_BASE}/comments?post=${postId}`,
    ALL: `${API_BASE}/comments?per_page=100`,
    BY_POSTS: (postIds) => `${API_BASE}/comments?post=${postIds.join(',')}&per_page=100`,
  },
};

// Export backend URL for use in other files
export { BACKEND_URL };