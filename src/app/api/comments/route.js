import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

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