'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TherapistCard from '@/components/app/therapists/cards/therapistCard';
import TherapistCardSkeleton from '@/components/app/therapists/cards/TherapistCardSkeleton';
import AddTherapistBanner from './AddTherapistBanner';
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
      {hasMore && !isPending && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 sm:px-8 py-2 bg-white rounded-[100px] border border-solid border-[#e8e8e8] hover:border-[#7466f2] transition-all"
          >
            <span className="font-medium text-gray-800 text-xs sm:text-sm font-['poppins'] tracking-[0] leading-4">
              Show More
            </span>
          </button>
        </div>
      )}

      {/* Loading Spinner */}
      {isPending && (
        <div className="flex justify-center items-center py-6 md:py-8 mt-2">
          <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-4 border-gray-200 border-t-[#7466f2]"></div>
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