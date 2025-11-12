import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function GET(request) {
  try {
    const config = getServerConfig();
    const { searchParams } = new URL(request.url);
    
    // Crear Basic Auth con credenciales del sistema
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');
    
    // Parámetros de búsqueda
    const page = searchParams.get('page') || 1;
    const perPage = searchParams.get('per_page') || 12;
    const searchTerm = searchParams.get('q') || '';
    const rating = searchParams.get('rating');
    const location = searchParams.get('location') || '';
    const categories = searchParams.get('categories') || '';
    
    // Construir URL base
    let url = `${config.WP_API_BASE}/therapists?_embed=wp:featuredmedia&page=${page}&per_page=${perPage}`;
    
    // Agregar búsqueda por texto si existe
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    
    // Construir meta_query para filtros ACF
    const metaQueries = [];
    
    // Filtro por rating
    if (rating) {
      metaQueries.push({
        key: 'Rating',
        value: rating,
        compare: '>=',
        type: 'NUMERIC'
      });
    }
    
    // Filtro por ubicación
    if (location) {
      metaQueries.push({
        key: 'city',
        value: location,
        compare: 'LIKE'
      });
    }
    
    // Filtro por categorías
    if (categories) {
      const categoryList = categories.split(',');
      if (categoryList.length === 1) {
        metaQueries.push({
          key: 'category',
          value: categoryList[0],
          compare: '='
        });
      } else {
        // Para múltiples categorías, necesitamos un OR relation
        const categoryQueries = categoryList.map(cat => ({
          key: 'category',
          value: cat,
          compare: '='
        }));
        metaQueries.push({
          relation: 'OR',
          queries: categoryQueries
        });
      }
    }
    
    // Si hay meta queries, agregarlas a la URL
    if (metaQueries.length > 0) {
      // WordPress REST API no soporta meta_query directamente
      // Necesitamos usar un enfoque diferente
      
      // Opción 1: Usar filtros personalizados si están disponibles
      // Opción 2: Obtener todos y filtrar del lado del servidor (no ideal)
      // Por ahora, usaremos los parámetros básicos disponibles
      
      // Nota: Esto requeriría personalización en el lado de WordPress
      // para soportar estos filtros via REST API
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filtrar manualmente los resultados basados en ACF
    // Esto es temporal hasta que tengamos soporte del lado de WordPress
    let filteredData = data;
    
    if (rating || location || categories) {
      filteredData = data.filter(therapist => {
        const acf = therapist.acf || {};
        
        // Verificar rating
        if (rating && (!acf.Rating || parseFloat(acf.Rating) < parseFloat(rating))) {
          return false;
        }
        
        // Verificar ubicación
        if (location && acf.city && !acf.city.toLowerCase().includes(location.toLowerCase())) {
          return false;
        }
        
        // Verificar categoría
        if (categories) {
          const categoryList = categories.split(',');
          if (!acf.category || !categoryList.includes(acf.category)) {
            return false;
          }
        }
        
        return true;
      });
    }
    
    // Recalcular el total después del filtrado
    const filteredTotal = filteredData.length;
    
    // Pasar headers de paginación
    const headers = new Headers();
    headers.set('x-wp-total', filteredTotal.toString());
    headers.set('x-wp-totalpages', Math.ceil(filteredTotal / perPage).toString());
    
    return NextResponse.json(filteredData, { 
      status: 200,
      headers 
    });
  } catch (error) {
    console.error('Therapists search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}