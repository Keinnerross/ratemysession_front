"use client";

import React, { useState } from "react";
import TherapistCard from "@/components/app/therapists/cards/therapistCard";
import CustomSelect from "@/components/global/inputs/CustomSelect";

export default function SavedTherapistsList({
  therapists = [],
  isLoading = false,
  pagination = null,
  onFilterChange = () => {},
  onLoadMore = () => {}
}) {
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState("all");
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  // Track if component has mounted
  const [hasMounted, setHasMounted] = useState(false);

  // Mark as mounted after first render
  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  // Call onFilterChange when filters change (but not on initial mount)
  React.useEffect(() => {
    if (!hasMounted) return;

    const filters = {};

    // Convert sortBy to backend format
    if (sortBy === "recent") {
      filters.order = "desc"; // Most recent first
    } else if (sortBy === "name") {
      filters.order = "asc"; // Alphabetical
    }

    // Add rating filter
    if (filterRating !== "all") {
      filters.rating = filterRating;
    }

    // Call parent function to fetch filtered data
    onFilterChange(filters);
  }, [sortBy, filterRating]);

  // Therapists are already filtered and sorted by the backend
  const visibleTherapists = therapists;

  // Check if user has no saved therapists at all
  const hasNoFavorites = !isLoading && pagination?.total === 0;

  return (
    <div className="w-full">
      {/* Filters - Always visible */}
      <div className="flex sm:flex-row gap-3 flex-wrap sm:gap-4 mb-6 md:mb-8">
          <CustomSelect
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: "recent", label: "Most Recent" },
              { value: "name", label: "Alphabetical (A-Z)" },
            ]}
            rounded="rounded-full"
            className="w-full sm:min-w-[160px] sm:w-auto"
            defaultValue="recent"
          />

          <CustomSelect
            value={filterRating}
            onChange={setFilterRating}
            rounded="rounded-full"
            options={[
              { value: "all", label: "All Ratings" },
              { value: "5", label: "5 Stars" },
              { value: "4", label: "4+ Stars" },
              { value: "3", label: "3+ Stars" },
              { value: "2", label: "2+ Stars" },
              { value: "1", label: "1+ Stars" },
            ]}
            className="w-full sm:w-[200px]"
            defaultValue="all"
          />
      </div>

      {/* Therapists List */}
      <div className="flex flex-col gap-4 relative min-h-[200px]">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#7466f2]"></div>
          </div>
        ) : hasNoFavorites ? (
          <div className="w-full py-8 md:py-12 text-center">
            <p className="text-base sm:text-lg text-gray-500 font-['Outfit']">
              You haven't saved any therapists yet.
            </p>
            <p className="text-xs sm:text-sm text-gray-400 font-['Outfit'] mt-2">
              Browse and save therapists to easily find them later.
            </p>
          </div>
        ) : visibleTherapists.length > 0 ? (
          <>
            {visibleTherapists.map((therapist) => (
              <TherapistCard
                key={therapist.id}
                dataTherapist={{
                  ...therapist,
                  isSaved: true,
                  onSaveToggle: (isSaved) =>
                    console.log(`Saved ${therapist.name}:`, isSaved),
                  onReadReviews: (id) =>
                    console.log(`Read reviews for therapist ID:`, id),
                }}
              />
            ))}

            {/* Show More Button */}
            {pagination?.hasNextPage && !loadMoreLoading && (
              <div className="flex justify-center pt-6 md:pt-8">
                <button
                  onClick={() => {
                    setLoadMoreLoading(true);
                    onLoadMore();
                    setTimeout(() => setLoadMoreLoading(false), 800);
                  }}
                  className="px-6 sm:px-8 py-2 bg-white rounded-[100px] border border-solid border-[#e8e8e8] hover:border-[#7466f2] transition-all"
                >
                  <span className="font-medium text-gray-800 text-xs sm:text-sm font-['poppins'] tracking-[0] leading-4">
                    Show More Therapists ({pagination.total - therapists.length} remaining)
                  </span>
                </button>
              </div>
            )}

            {/* Loading Spinner for Load More */}
            {loadMoreLoading && (
              <div className="flex justify-center items-center py-6 md:py-8">
                <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-4 border-gray-200 border-t-[#7466f2]"></div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-gray-500 font-['Outfit']">
            No therapists found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
