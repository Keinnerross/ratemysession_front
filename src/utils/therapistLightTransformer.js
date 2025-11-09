// Lightweight transformer for filtering purposes
export function transformTherapistLightData(apiData) {
  return apiData.map(therapist => {
    // Extract ACF data
    const acf = therapist.acf || {};
    
    // Determine location from ACF data
    const location = acf.city || "New York";
    
    // Use ACF rating directly
    const rating = acf.Rating || 0;
    
    return {
      id: therapist.id,
      name: therapist.title.rendered,
      slug: therapist.slug,
      rating: rating,
      specialty: extractSpecialty(therapist),
      location: location,
    };
  });
}

// Extract specialty from therapist data (same logic as main transformer)
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