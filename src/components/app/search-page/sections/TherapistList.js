'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TherapistCard from '@/components/app/therapists/cards/therapistCard';
import TherapistCardSkeleton from '@/components/app/therapists/cards/TherapistCardSkeleton';
import { ButtonCustom } from '@/components/global/buttons/buttons';
import AddTherapistBanner from './AddTherapistBanner';
import { FaSpinner } from 'react-icons/fa';
import { sortTherapists } from '@/utils/sortTherapists';

const TherapistList = ({ initialTherapists, onLoadMore, initialHasMore, sortBy = 'recommended' }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [therapists, setTherapists] = useState(initialTherapists);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadedTherapists, setLoadedTherapists] = useState([]); // Terapeutas adicionales cargados
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  
  // Detectar cambio de filtros (cuando cambian initialTherapists)
  useEffect(() => {
    // Si los initialTherapists cambian, es porque se aplicó un filtro
    setIsFilterLoading(true);
    setLoadedTherapists([]); // Reset loaded therapists on filter change
    
    // Simular un pequeño delay para mostrar el loading
    const timer = setTimeout(() => {
      setIsFilterLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [initialTherapists.map(t => t.id).join(',')]); // Comparar por IDs
  
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
                onSaveToggle: (isSaved) => console.log(`Saved ${therapist.name}:`, isSaved),
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
        showDelay={3000}
      />
    </>
  );
};

export default TherapistList;