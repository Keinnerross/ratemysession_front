// Transform WordPress comment data to match app's expected format
export function transformCommentData(apiComments, currentUserId = null) {
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

    // Parse reaction IDs from comma-separated strings
    const parseReactionIds = (value) => {
      // Handle empty values, null, undefined, or numbers (0)
      if (!value || value === '' || typeof value === 'number') return [];
      // Ensure value is a string
      const strValue = String(value);
      if (strValue === '' || strValue === '0') return [];
      return strValue.split(',').map(id => id.trim()).filter(id => id);
    };

    const usefulIds = parseReactionIds(comment.acf?.useful);
    const lovedIds = parseReactionIds(comment.acf?.loved);
    const thankfulIds = parseReactionIds(comment.acf?.thankful);
    const ohNoIds = parseReactionIds(comment.acf?.['oh-no']);

    // Determine user's current reaction if userId is provided
    let userReaction = null;
    if (currentUserId) {
      const userIdStr = String(currentUserId);
      if (usefulIds.includes(userIdStr)) userReaction = 'useful';
      else if (lovedIds.includes(userIdStr)) userReaction = 'helpful';
      else if (thankfulIds.includes(userIdStr)) userReaction = 'insightful';
      else if (ohNoIds.includes(userIdStr)) userReaction = 'inappropriate';
    }

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
        useful: usefulIds.length,        // Count of IDs
        helpful: lovedIds.length,        // Count of IDs (loved → helpful)
        insightful: thankfulIds.length,  // Count of IDs (thankful → insightful)
        inappropriate: ohNoIds.length    // Count of IDs (oh-no → inappropriate)
      },
      userReaction: userReaction, // Current user's reaction
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