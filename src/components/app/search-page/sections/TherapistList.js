'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TherapistCard from '@/components/app/therapists/cards/therapistCard';
import TherapistCardSkeleton from '@/components/app/therapists/cards/TherapistCardSkeleton';
import { ButtonCustom } from '@/components/global/buttons/buttons';
import AddTherapistBanner from './AddTherapistBanner';
import { FaSpinner } from 'react-icons/fa';
import { sortTherapists } from '@/utils/sortTherapists';
import favoritesService from '@/services/users/favoritesService';
import { useAuth } from '@/context/AuthContext';

const TherapistList = ({ initialTherapists, onLoadMore, initialHasMore, sortBy = 'recommended', initialFavoriteIds = [] }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [therapists, setTherapists] = useState(initialTherapists);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadedTherapists, setLoadedTherapists] = useState([]); // Terapeutas adicionales cargados
  const [favoriteIds, setFavoriteIds] = useState(initialFavoriteIds);
  const { user } = useAuth();
  
  // Verificar inmediatamente si venimos de aplicar filtros
  const filterApplied = typeof window !== 'undefined' && 
                       sessionStorage.getItem('search-filter-applied') === 'true';
  
  const [isFilterLoading, setIsFilterLoading] = useState(filterApplied);
  
  // Cargar favoritos del usuario si está autenticado
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        try {
          const favorites = await favoritesService.getFavorites();
          setFavoriteIds(favorites);
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      }
    };
    loadFavorites();
  }, [user]);
  
  // Limpiar el flag y manejar el skeleton
  useEffect(() => {
    if (filterApplied) {
      // Limpiar el flag
      sessionStorage.removeItem('search-filter-applied');
      setLoadedTherapists([]); // Reset loaded therapists on filter change
      
      // Ocultar skeleton después de un tiempo
      const timer = setTimeout(() => {
        setIsFilterLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, []); // Solo ejecutar una vez al montar
  
  // Actualizar terapeutas cuando cambien las props o el ordenamiento
  useEffect(() => {
    // Combinar terapeutas iniciales con los cargados y ordenar todo
    const allTherapists = [...initialTherapists, ...loadedTherapists];
    const sortedTherapists = sortTherapists(allTherapists, sortBy);
    setTherapists(sortedTherapists);
  }, [initialTherapists, loadedTherapists, sortBy]);
  
  const handleLoadMore = () => {
    startTransition(async () => {
      const result = await onLoadMore();
      if (result && result.therapists) {
        // Agregar nuevos terapeutas a la lista de cargados
        setLoadedTherapists(prev => [...prev, ...result.therapists]);
        setHasMore(result.hasMore);
      }
    });
  };

  return (
    <>
      {/* Therapist Cards */}
      <div className="flex flex-col gap-6">
        {isFilterLoading ? (
          // Mostrar skeletons mientras se cargan los filtros
          Array.from({ length: 3 }).map((_, index) => (
            <TherapistCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : therapists.length > 0 ? (
          therapists.map((therapist) => (
            <TherapistCard
              key={therapist.id}
              dataTherapist={{
                ...therapist,
                isSaved: favoriteIds.includes(parseInt(therapist.id)),
                onSaveToggle: (isSaved) => {
                  // Actualizar lista local de favoritos
                  if (isSaved) {
                    setFavoriteIds(prev => [...prev, parseInt(therapist.id)]);
                  } else {
                    setFavoriteIds(prev => prev.filter(id => id !== parseInt(therapist.id)));
                  }
                },
                onReadReviews: (id) => router.push(`/therapist-profile?id=${id}`)
              }}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            No therapists found
          </p>
        )}
      </div>
      
      {/* Show More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <ButtonCustom 
            variant={2} 
            onClick={handleLoadMore}
            disabled={isPending}
            className="min-w-[200px]"
          >
            {isPending ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Loading...
              </>
            ) : (
              'Show More'
            )}
          </ButtonCustom>
        </div>
      )}

      {/* Add Therapist Banner */}
      <AddTherapistBanner 
        callToAction="Know a great therapist? Help expand our community"
        buttonText="Add Therapist"
      />
    </>
  );
};

export default TherapistList;