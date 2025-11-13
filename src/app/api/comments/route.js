import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function POST(request) {
  try {
    const config = getServerConfig();
    const body = await request.json();
    
    // Validate required fields
    if (!body.post || !body.content || !body.rating) {
      return NextResponse.json(
        { error: 'Missing required fields: post, content, rating' },
        { status: 400 }
      );
    }
    
    // Validate rating range
    const rating = parseInt(body.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Use content as is (rating will be stored in ACF field)
    const formattedContent = body.content;
    
    // Prepare comment data
    const commentData = {
      post: body.post,
      content: formattedContent,
      status: 'hold', // Comments pending approval
      // ACF fields with correct data types
      acf: {
        rate: body.rating.toString(), // ACF expects string for rate
        anonymous: body.isAnonymous ? '1' : '0', // String for checkbox
        proof: body.proof || null // Integer or null for proof
      }
    };
    
    // For anonymous comments, don't include author field at all
    // WordPress will treat it as anonymous if author is not provided
    if (!body.isAnonymous && body.author) {
      commentData.author = body.author;
      commentData.author_name = body.author_name || '';
      commentData.author_email = body.author_email || '';
    } else {
      // For anonymous, only set author_name if provided
      commentData.author_name = body.author_name || 'Anonymous';
      commentData.author_email = body.author_email || 'anonymous@ratemysession.com';
    }
    
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');
    
    // Create comment via WordPress API
    const response = await fetch(`${config.WP_API_BASE}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commentData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('WordPress Comment Creation Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to create comment',
          details: errorText
        },
        { status: response.status }
      );
    }
    
    const createdComment = await response.json();
    
    // Update ACF fields if comment was created successfully
    if (createdComment.id) {
      try {
        // Try to update the comment with ACF fields
        const updateData = {
          acf: {
            rate: body.rating.toString(),
            anonymous: body.isAnonymous ? '1' : '0',
            proof: body.proof || null
          }
        };
        
        const updateResponse = await fetch(`${config.WP_API_BASE}/comments/${createdComment.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });
        
        if (!updateResponse.ok) {
          console.error('Failed to update ACF fields:', await updateResponse.text());
          // Try alternative method - using meta fields
          const metaUpdateData = {
            meta: {
              rate: body.rating.toString(),
              anonymous: body.isAnonymous ? '1' : '0'
            }
          };
          
          const metaResponse = await fetch(`${config.WP_API_BASE}/comments/${createdComment.id}`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${basicAuth}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(metaUpdateData)
          });
          
          if (!metaResponse.ok) {
            console.error('Also failed to update meta fields:', await metaResponse.text());
          }
        }
        
      } catch (acfError) {
        console.error('Failed to update ACF fields:', acfError);
        // Continue anyway as the comment was created
      }
    }
    
    return NextResponse.json(createdComment);
  } catch (error) {
    console.error('Comment Creation Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const config = getServerConfig();
    const { searchParams } = new URL(request.url);
    
    // Si estamos buscando comentarios para múltiples posts
    if (searchParams.has('include')) {
      const postIds = searchParams.get('include').split(',').map(id => parseInt(id));
      console.log('Fetching comments for multiple posts:', postIds);
      
      const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
      const basicAuth = Buffer.from(authString).toString('base64');
      
      // WordPress no soporta buscar comentarios por múltiples post IDs
      // Así que obtenemos todos los comentarios y filtramos
      let allComments = [];
      let page = 1;
      let hasMore = true;
      
      while (hasMore) {
        const url = `${config.WP_API_BASE}/comments?per_page=100&page=${page}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const pageComments = await response.json();
        allComments = [...allComments, ...pageComments];
        
        // Check if there are more pages
        const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');
        hasMore = page < totalPages;
        page++;
        
        // Limit to prevent infinite loops
        if (page > 10) break;
      }
      
      // Filtrar solo los comentarios que pertenecen a los posts solicitados
      const filteredComments = allComments.filter(comment => 
        postIds.includes(comment.post)
      );
      
      console.log(`Found ${filteredComments.length} comments for posts:`, postIds);
      
      return NextResponse.json(filteredComments);
    }
    
    // Para búsquedas normales (por un solo post)
    let url = `${config.WP_API_BASE}/comments`;
    const params = new URLSearchParams();
    
    if (searchParams.has('post')) {
      params.append('post', searchParams.get('post'));
    }
    
    params.append('per_page', '100');
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('WordPress API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch comments',
          details: errorText
        },
        { status: response.status }
      );
    }
    
    const comments = await response.json();
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Comments API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}