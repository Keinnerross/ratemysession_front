import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';
import { cookies } from 'next/headers';

// DELETE - Quitar terapeuta de favoritos
export async function DELETE(request, { params }) {
  try {
    const config = getServerConfig();
    const cookieStore = await cookies();
    const authToken = cookieStore.get('authToken');
    const { id: therapistId } = await params;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (!therapistId) {
      return NextResponse.json(
        { error: 'Therapist ID required' },
        { status: 400 }
      );
    }
    
    // Validar token y obtener ID de usuario
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');
    
    const validateResponse = await fetch(`${config.JWT_BASE}/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      },
      body: JSON.stringify({
        JWT: authToken.value
      })
    });
    
    if (!validateResponse.ok) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const validationData = await validateResponse.json();
    const userId = validationData.data?.user?.ID;
    
    // Obtener favoritos actuales
    const userResponse = await fetch(`${config.WP_API_BASE}/users/${userId}?context=edit`, {
      headers: {
        'Authorization': `Basic ${basicAuth}`
      }
    });
    
    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user data: ${userResponse.status}`);
    }
    
    const userData = await userResponse.json();
    const currentFavorites = userData.acf?.favorites_therapists || '';
    
    // Convertir a array y filtrar el ID a eliminar
    const favoriteIds = currentFavorites
      .split(',')
      .filter(id => id.trim() !== '' && id.trim() !== therapistId.toString())
      .map(id => id.trim());
    
    const newFavorites = favoriteIds.join(',');
    
    // Actualizar usuario con favoritos actualizados
    const updateResponse = await fetch(`${config.WP_API_BASE}/users/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      },
      body: JSON.stringify({
        acf: {
          favorites_therapists: newFavorites
        }
      })
    });
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Update error:', errorText);
      throw new Error(`Failed to update favorites: ${updateResponse.status}`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Therapist removed from favorites'
    });
    
  } catch (error) {
    console.error('Remove favorite error:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}