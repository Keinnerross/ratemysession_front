import { BACKEND_URL } from '@/services/api/endpoints';

// Transforms WordPress API data to match the app's expected format
export function transformTherapistData(apiData, commentCounts = null, currentUserId = null) {
  return apiData.map(therapist => {
    // Get featured image URL - supports both new and old formats
    let imageUrl = null;
    let thumbnailUrl = null;

    // Nuevo formato: featured_media como objeto con URLs directas (custom endpoint)
    if (therapist.featured_media && typeof therapist.featured_media === 'object' && therapist.featured_media.url) {
      // Usar thumbnail (150x150) para tarjetas - más ligero y rápido
      thumbnailUrl = therapist.featured_media.thumbnail ||
                     therapist.featured_media.medium ||
                     therapist.featured_media.url;

      // Usar large para imágenes completas en perfiles
      imageUrl = therapist.featured_media.large ||
                 therapist.featured_media.url;
    }
    // Formato antiguo: _embedded (WordPress estándar) - fallback
    else if (therapist._embedded && therapist._embedded['wp:featuredmedia'] && therapist._embedded['wp:featuredmedia'][0]) {
      const media = therapist._embedded['wp:featuredmedia'][0];

      // Obtener thumbnail para las tarjetas (150x150 o medium)
      if (media.media_details?.sizes) {
        thumbnailUrl = media.media_details.sizes.thumbnail?.source_url ||
                      media.media_details.sizes.medium?.source_url ||
                      media.source_url;
      }

      // Imagen completa para el perfil
      imageUrl = media.source_url || media.media_details?.sizes?.large?.source_url;
    }

    // Extract ACF data
    const acf = therapist.acf || {};
    
    // Build full address from ACF fields
    const addressParts = [];
    if (acf.Address) addressParts.push(acf.Address);
    if (acf.city) addressParts.push(acf.city);
    if (acf.state_address) {
      addressParts.push(`${acf.state_address}${acf.zip_code ? ' ' + acf.zip_code : ''}`);
    }
    const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : "New York, NY";
    
    // Determine location from ACF data
    const location = acf.city || "New York";
    
    // Use ACF rating directly (WordPress manages this)
    // Handle both ACF format (standard endpoint) and direct rating (custom endpoint)
    const rating = (() => {
      const value = acf.Rating || therapist.rating || 0;
      if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
      }
      return typeof value === 'number' ? value : 0;
    })();
    
    // Count approved comments for review count
    const reviewCount = countApprovedComments(therapist, commentCounts);

    // Extract AI review summary data
    const aiSummary = extractAISummaryData(therapist, currentUserId);

    return {
      id: therapist.id,
      name: therapist.title.rendered,
      slug: therapist.slug,
      image: imageUrl,
      thumbnail: thumbnailUrl,
      credentials: extractCredentials(acf.credentials_therapist),
      rating: rating,
      reviews: reviewCount,
      specialty: extractSpecialty(therapist), // Extract from credentials
      location: location,
      bio: "Professional therapist specializing in mental health and wellness.", // TODO: Get from excerpt or ACF bio field
      insurance: ["Aetna", "Blue Cross"], // TODO: Get from ACF insurance field
      address: fullAddress,
      website: acf.Website ? formatWebsiteUrl(acf.Website) : therapist.link,
      aiSummary: aiSummary,
      // Keep original data for reference
      _original: therapist,
      _acf: acf
    };
  });
}

// Extract specialty from therapist data
function extractSpecialty(therapist) {
  // Check if ACF category exists and is not false or "Uncategorized"
  if (therapist.acf && therapist.acf.category && 
      therapist.acf.category !== false && 
      therapist.acf.category !== "Uncategorized") {
    return therapist.acf.category;
  }
  
  // Fallback to credentials-based category
  const credClasses = therapist.class_list || [];
  
  if (credClasses.some(c => c.includes('lcsw'))) return "Clinical Social Worker";
  if (credClasses.some(c => c.includes('lmhc'))) return "Mental Health Counselor";
  if (credClasses.some(c => c.includes('lmsw'))) return "Social Worker";
  if (credClasses.some(c => c.includes('lpc'))) return "Professional Counselor";
  if (credClasses.some(c => c.includes('mhc-lp'))) return "Mental Health Counselor";
  return "Other Specialties";
}

// Extract credentials from ACF credentials field (comma-separated string)
function extractCredentials(credentialsString) {
  if (!credentialsString || typeof credentialsString !== 'string') return [];

  return credentialsString
    .split(',')
    .map(credential => credential.trim())
    .filter(credential => credential.length > 0);
}

// Get therapist by ID from API data
export function getTherapistById(apiData, id, commentCounts = null, currentUserId = null) {
  const therapist = apiData.find(t => t.id === parseInt(id));
  if (!therapist) return null;

  const transformed = transformTherapistData([therapist], commentCounts, currentUserId);
  return transformed[0];
}

// Get therapist by slug from API data
export function getTherapistBySlug(apiData, slug, commentCounts = null, currentUserId = null) {
  const therapist = apiData.find(t => t.slug === slug);
  if (!therapist) return null;

  const transformed = transformTherapistData([therapist], commentCounts, currentUserId);
  return transformed[0];
}

// Format website URL to ensure it has a protocol
function formatWebsiteUrl(url) {
  if (!url) return '';

  // If URL already has protocol, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Add https:// if no protocol
  return `https://${url}`;
}

/**
 * Extracts clean domain from URL
 * Removes protocol (http://, https://), www., paths, and query params
 *
 * @param {string} url - The URL to extract domain from
 * @returns {string} - Clean domain (e.g., "example.com")
 *
 * @example
 * extractDomain("https://www.example.com/path?query=1") // "example.com"
 * extractDomain("http://example.com") // "example.com"
 * extractDomain("www.example.com") // "example.com"
 * extractDomain("example.com/about") // "example.com"
 * extractDomain("https://app.example.com") // "app.example.com"
 */
export function extractDomain(url) {
  if (!url || typeof url !== 'string') return '';

  try {
    // Remove leading/trailing whitespace
    let cleanUrl = url.trim();

    // If URL doesn't have protocol, add it temporarily for parsing
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    // Parse URL
    const urlObj = new URL(cleanUrl);
    let domain = urlObj.hostname;

    // Remove 'www.' prefix if present
    if (domain.startsWith('www.')) {
      domain = domain.substring(4);
    }

    return domain;
  } catch (error) {
    // Fallback for invalid URLs
    console.warn('Invalid URL format:', url);

    // Manual extraction as fallback
    let cleanUrl = url
      .replace(/^https?:\/\//, '')  // Remove protocol
      .replace(/^www\./, '')         // Remove www.
      .split('/')[0]                 // Get domain part only
      .split('?')[0];                // Remove query params

    return cleanUrl;
  }
}

// Count approved comments for review count
function countApprovedComments(therapist, commentCounts = null) {
  // If we have a pre-calculated comment count map, use it
  if (commentCounts && typeof commentCounts[therapist.id] !== 'undefined') {
    return commentCounts[therapist.id];
  }

  // Fallback: Check if replies are embedded (for individual pages)
  if (!therapist._embedded || !therapist._embedded.replies || !Array.isArray(therapist._embedded.replies)) {
    return 0;
  }

  // All comments from API are already approved
  return therapist._embedded.replies.length;
}

// Extract AI review summary data from ACF fields
function extractAISummaryData(therapist, currentUserId = null) {
  const acf = therapist.acf || {};

  const content = acf.ai_review_summary || '';
  const usefulString = acf.ai_review_summary_useful || '';

  // Parse user IDs who marked as useful
  const usefulUserIds = usefulString
    ? usefulString.split(',').filter(id => id.trim())
    : [];

  const usefulCount = usefulUserIds.length;

  // Check if current user has marked as useful
  const isUseful = currentUserId
    ? usefulUserIds.includes(currentUserId.toString())
    : false;

  return {
    content: content,
    usefulCount: usefulCount,
    isUseful: isUseful,
    hasContent: content.trim().length > 0
  };
}