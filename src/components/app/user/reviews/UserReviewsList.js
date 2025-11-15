"use client";

import React, { useState } from "react";
import UserReviewCard from "./UserReviewCard";
import SavedTherapistsList from "../saved/SavedTherapistsList";
import CustomSelect from "@/components/global/inputs/CustomSelect";
import userReviewsService from "@/services/reviews/userReviewsService";

export default function UserReviewsList({
  reviews = [],
  savedTherapists = [],
  reviewsLoading = false,
  reviewsPagination = null,
  onFilterChange = () => {},
  onLoadMore = () => {},
  onReviewUpdate = () => {},
  onReviewDelete = () => {},
  favoritesLoading = false,
  favoritesPagination = null,
  onFavoritesFilterChange = () => {},
  onFavoritesLoadMore = () => {}
}) {
  const [activeTab, setActiveTab] = useState("reviews");
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState("all");

  const handleVisibilityChange = async (reviewId, currentIsAnonymous) => {
    try {
      const updatedReview = await userReviewsService.toggleVisibility(reviewId, currentIsAnonymous);

      // Notify parent to update the review
      onReviewUpdate(reviewId, {
        ...updatedReview,
        isAnonymous: updatedReview.acf?.anonymous === '1'
      });
    } catch (error) {
      console.error('Error changing visibility:', error);
      // Could add toast notification here
      throw error;
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await userReviewsService.deleteReview(reviewId);

      // Notify parent to remove the review from list
      onReviewDelete(reviewId);
    } catch (error) {
      console.error('Error deleting review:', error);
      // Could add toast notification here
      throw error;
    }
  };

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
    if (sortBy === "oldest") {
      filters.order = "asc";
    } else if (sortBy === "recent") {
      filters.order = "desc";
    }
    
    // Add rating filter
    if (filterRating !== "all") {
      filters.rate = filterRating;
    }
    
    // Filters will reset pagination in parent
    
    // Call parent function to fetch filtered data
    onFilterChange(filters);
  }, [sortBy, filterRating]);

  // Reviews are already filtered and sorted by the backend
  const visibleReviews = reviews;

  return (
    <div className="w-full flex flex-col">
      {/* Header with Tabs */}
      <div className="relative mb-6 md:mb-8">
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 mb-2">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`text-base sm:text-lg font-base font-['Outfit'] tracking-[-0.32px] transition-colors ${
              activeTab === "reviews" 
                ? "text-gray-800" 
                : "text-gray-400 hover:text-gray-500"
            }`}
          >
            My Reviews
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`text-base sm:text-lg font-base font-['Outfit'] tracking-[-0.32px] transition-colors ${
              activeTab === "saved" 
                ? "text-gray-800" 
                : "text-gray-400 hover:text-gray-500"
            }`}
          >
            Saved Therapists
          </button>
        </div>
        
        {/* Tab Indicator Line */}
        <div className="w-full h-px bg-gray-200 relative">
          <div 
            className={`absolute top-0 h-1 bg-[#7466f2] transition-all duration-300 ${
              activeTab === "reviews" 
                ? "left-0 w-[80px] sm:w-[100px]" 
                : "left-[100px] sm:left-[120px] w-[120px] sm:w-[145px]"
            }`} 
          />
        </div>
      </div>

      {/* Content */}
      {activeTab === "reviews" ? (
        <>
          {/* Filters - Always visible */}
          <div className="flex sm:flex-row gap-3 flex-wrap sm:gap-4 mb-6 md:mb-8">
            <CustomSelect
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "recent", label: "Most Recent" },
                { value: "oldest", label: "Oldest First" },
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
                { value: "4", label: "4 Stars" },
                { value: "3", label: "3 Stars" },
                { value: "2", label: "2 Stars" },
                { value: "1", label: "1 Star" },
              ]}
              className="w-full sm:w-[200px]"
              defaultValue="all"
            />
          </div>

          {/* Reviews Tab Content */}
          {reviews.length === 0 ? (
            <div className="w-full py-8 md:py-12 text-center">
              <p className="text-base sm:text-lg text-gray-500 font-['Outfit']">
                You haven't written any reviews yet.
              </p>
              <p className="text-xs sm:text-sm text-gray-400 font-['Outfit'] mt-2">
                Share your experiences to help others find the right therapist.
              </p>
            </div>
          ) : (
            <>
              {/* Reviews List */}
              <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 relative min-h-[200px]">
                {reviewsLoading ? (
                  <div className="flex justify-center items-center py-12 md:py-16">
                    <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-4 border-gray-200 border-t-[#7466f2]"></div>
                  </div>
                ) : reviews.length > 0 ? (
                  visibleReviews.map((review) => (
                    <UserReviewCard
                      key={review.id}
                      review={review}
                      onVisibilityChange={handleVisibilityChange}
                      onDelete={handleDeleteReview}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-gray-500 font-['Outfit'] px-4 text-center">
                    No reviews found matching your criteria
                  </div>
                )}
              </div>

              {/* Show More Button */}
              {reviewsPagination?.hasNextPage && !isLoading && (
                <div className="flex justify-center pt-6 md:pt-8">
                  <button
                    onClick={() => {
                      setIsLoading(true);
                      onLoadMore();
                      setTimeout(() => setIsLoading(false), 800);
                    }}
                    className="px-6 sm:px-8 py-2 bg-white rounded-[100px] border border-solid border-[#e8e8e8] hover:border-[#7466f2] transition-all"
                  >
                    <span className="font-medium text-gray-800 text-xs sm:text-sm font-['poppins'] tracking-[0] leading-4">
                      Show More Reviews ({reviewsPagination.totalComments - reviews.length} remaining)
                    </span>
                  </button>
                </div>
              )}
              
              {/* Loading Spinner */}
              {isLoading && (
                <div className="flex justify-center items-center py-6 md:py-8">
                  <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-4 border-gray-200 border-t-[#7466f2]"></div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        /* Saved Therapists Tab Content */
        <SavedTherapistsList
          therapists={savedTherapists}
          isLoading={favoritesLoading}
          pagination={favoritesPagination}
          onFilterChange={onFavoritesFilterChange}
          onLoadMore={onFavoritesLoadMore}
        />
      )}
    </div>
  );
}