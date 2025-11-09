// Transform WordPress comment data to match app's expected format
export function transformCommentData(apiComments) {
  return apiComments.map(comment => {
    // Extract rating from ACF field
    const rating = parseInt(comment.acf?.rate || 0);
    
    // Parse content to extract the actual review text
    // The content has format: <p>Review text</p>\n<p><strong>Rate:</strong> X Stars</p>
    const contentHtml = comment.content?.rendered || '';
    const reviewText = extractReviewText(contentHtml);
    
    // Determine author name
    const authorName = comment.author_name || 'Anonymous';
    const isAnonymous = comment.acf?.anonymous === "1" || !comment.author_name;
    
    return {
      id: comment.id,
      therapistId: comment.post,
      userId: comment.author || null,
      userName: isAnonymous ? "Anonymous" : authorName,
      userAvatar: comment.author_avatar_urls?.['96'] || null,
      rating: rating,
      date: comment.date,
      content: reviewText, // TherapistCardRated expects 'content' not 'reviewText'
      reactions: {
        useful: comment.acf?.useful || 0,        // Útil (directo)
        helpful: comment.acf?.loved || 0,        // Me encanta → helpful
        insightful: comment.acf?.thankful || 0,  // Agradecido → insightful
        inappropriate: comment.acf?.['oh-no'] || 0  // Oh no → inappropriate
      },
      userReaction: null, // This would need to be tracked separately
      isAnonymous: isAnonymous,
      hasProof: !!comment.acf?.proof,
      // Keep original data for reference
      _original: comment
    };
  });
}

// Extract review text from HTML content
function extractReviewText(html) {
  // Remove HTML tags and extract text before "Rate:" line
  const tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null;
  if (tempDiv) {
    tempDiv.innerHTML = html;
    const paragraphs = tempDiv.querySelectorAll('p');
    
    // Get all paragraphs except the rating one
    const reviewParagraphs = Array.from(paragraphs).filter(p => 
      !p.textContent.includes('Rate:')
    );
    
    return reviewParagraphs.map(p => p.textContent).join(' ').trim();
  }
  
  // Fallback for server-side rendering
  // Simple regex to extract text between <p> tags, excluding the Rate line
  const matches = html.match(/<p>([^<]*)<\/p>/g);
  if (matches) {
    return matches
      .map(match => match.replace(/<\/?p>/g, ''))
      .filter(text => !text.includes('Rate:'))
      .join(' ')
      .trim();
  }
  
  return '';
}

// Get comment by ID from API data
export function getCommentById(apiComments, id) {
  const comment = apiComments.find(c => c.id === parseInt(id));
  if (!comment) return null;
  
  const transformed = transformCommentData([comment]);
  return transformed[0];
}