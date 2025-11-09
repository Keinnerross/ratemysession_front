import { BACKEND_URL } from '@/services/api/endpoints';

// Transforms WordPress API data to match the app's expected format
export function transformTherapistData(apiData, commentCounts = null) {
  return apiData.map(therapist => {
    // Get featured image URL from embedded data
    let imageUrl = null;
    let thumbnailUrl = null;
    
    if (therapist._embedded && therapist._embedded['wp:featuredmedia'] && therapist._embedded['wp:featuredmedia'][0]) {
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
    const rating = acf.Rating || 0;
    
    // Count approved comments for review count
    const reviewCount = countApprovedComments(therapist, commentCounts);

    return {
      id: therapist.id,
      name: therapist.title.rendered,
      slug: therapist.slug,
      image: imageUrl,
      thumbnail: thumbnailUrl,
      credentials: extractCredentials(therapist.class_list),
      rating: rating,
      reviews: reviewCount,
      specialty: extractSpecialty(therapist), // Extract from credentials
      location: location,
      bio: "Professional therapist specializing in mental health and wellness.", // TODO: Get from excerpt or ACF bio field
      insurance: ["Aetna", "Blue Cross"], // TODO: Get from ACF insurance field
      address: fullAddress,
      website: acf.Website ? formatWebsiteUrl(acf.Website) : therapist.link,
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

// Extract credentials from class list
function extractCredentials(classList) {
  if (!classList || !Array.isArray(classList)) return [];
  
  return classList
    .filter(className => className.startsWith('credential-'))
    .map(credential => {
      // Remove 'credential-' prefix and format
      const cred = credential.replace('credential-', '');
      // Replace hyphens with spaces and uppercase appropriately
      return cred
        .split('-')
        .map(part => part.toUpperCase())
        .join(' ');
    });
}

// Get therapist by ID from API data
export function getTherapistById(apiData, id, commentCounts = null) {
  const therapist = apiData.find(t => t.id === parseInt(id));
  if (!therapist) return null;
  
  const transformed = transformTherapistData([therapist], commentCounts);
  return transformed[0];
}

// Get therapist by slug from API data
export function getTherapistBySlug(apiData, slug, commentCounts = null) {
  const therapist = apiData.find(t => t.slug === slug);
  if (!therapist) return null;
  
  const transformed = transformTherapistData([therapist], commentCounts);
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