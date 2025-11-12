import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

// Cache de categorías para evitar llamadas repetidas
let categoriesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

export async function GET(request) {
  try {
    // Verificar si tenemos cache válido
    if (categoriesCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
      return NextResponse.json(categoriesCache);
    }
    
    const config = getServerConfig();
    
    // Crear Basic Auth con credenciales del sistema
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');
    
    // Obtener una muestra representativa de terapeutas para extraer categorías
    // Usamos un límite alto para asegurarnos de capturar todas las categorías posibles
    const url = `${config.WP_API_BASE}/therapists?per_page=100&_fields=id,acf,class_list`;
    
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
    
    const therapists = await response.json();
    
    // Extraer categorías únicas
    const categoriesSet = new Set();
    const locationsSet = new Set();
    
    therapists.forEach(therapist => {
      // Extraer categoría
      if (therapist.acf && therapist.acf.category && 
          therapist.acf.category !== false && 
          therapist.acf.category !== "Uncategorized") {
        categoriesSet.add(therapist.acf.category);
      } else {
        // Fallback a credenciales
        const credClasses = therapist.class_list || [];
        let category = "Other Specialties";
        
        if (credClasses.some(c => c.includes('lcsw'))) category = "Clinical Social Worker";
        else if (credClasses.some(c => c.includes('lmhc'))) category = "Mental Health Counselor";
        else if (credClasses.some(c => c.includes('lmsw'))) category = "Social Worker";
        else if (credClasses.some(c => c.includes('lpc'))) category = "Professional Counselor";
        else if (credClasses.some(c => c.includes('mhc-lp'))) category = "Mental Health Counselor";
        
        categoriesSet.add(category);
      }
      
      // Extraer ubicación
      if (therapist.acf && therapist.acf.city) {
        locationsSet.add(therapist.acf.city);
      }
    });
    
    // Convertir a arrays y ordenar
    const categories = Array.from(categoriesSet).sort();
    const locations = Array.from(locationsSet).sort();
    
    const result = {
      categories,
      locations,
      totalCategories: categories.length,
      totalLocations: locations.length,
      timestamp: new Date().toISOString()
    };
    
    // Actualizar cache
    categoriesCache = result;
    cacheTimestamp = Date.now();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}