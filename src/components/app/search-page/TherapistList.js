import React from 'react';
import TherapistCard from '@/components/app/cards/therapistCard';
import { ButtonCustom } from '@/components/global/buttons/buttons';

const TherapistList = ({ therapists, visibleCount, totalCount, onShowMore }) => {
  const hasMore = visibleCount < totalCount;

  return (
    <>
      {/* Therapist Cards */}
      <div className="flex flex-col gap-4">
        {therapists.length > 0 ? (
          therapists.map((therapist) => (
            <TherapistCard
              key={therapist.id}
              dataTherapist={{
                ...therapist,
                onSaveToggle: (isSaved) => console.log(`Saved ${therapist.name}:`, isSaved),
                onReadReviews: (id) => console.log(`Read reviews for therapist ID:`, id)
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
          <ButtonCustom variant={2} onClick={onShowMore}>
            Show More
          </ButtonCustom>
        </div>
      )}
    </>
  );
};

export default TherapistList;