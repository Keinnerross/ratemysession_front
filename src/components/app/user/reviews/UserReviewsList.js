"use client";

import React, { useState } from "react";
import UserReviewCard from "./UserReviewCard";
import SavedTherapistsList from "../saved/SavedTherapistsList";
import CustomSelect from "@/components/global/inputs/CustomSelect";

export default function UserReviewsList({ reviews = [], savedTherapists = [] }) {
  const [activeTab, setActiveTab] = useState("reviews");
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState("all");
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  
  const handleEditReview = (reviewId) => {
    console.log('Edit review:', reviewId);
    // Here you would implement edit functionality
    // For example: open a modal, navigate to edit page, etc.
  };
  
  const handleDeleteReview = (reviewId) => {
    console.log('Delete review:', reviewId);
    // Here you would implement delete functionality
    // For example: show confirmation dialog, then delete
  };

  // Reset visible count and show loader when filters change
  React.useEffect(() => {
    setIsFilterLoading(true);
    setVisibleCount(6);
    
    const timer = setTimeout(() => {
      setIsFilterLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [sortBy, filterRating]);

  // Apply sorting
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    return 0;
  });

  // Apply rating filter
  const filteredReviews = sortedReviews.filter((review) => {
    if (filterRating === "all") return true;
    return review.rating === parseInt(filterRating);
  });

  const visibleReviews = filteredReviews.slice(0, visibleCount);

  return (
    <div className="w-full max-w-[1050px] flex flex-col">
      {/* Header with Tabs */}
      <div className="relative mb-8">
        <div className="flex items-center gap-8 mb-2">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`text-lg font-base font-['Outfit'] tracking-[-0.32px] transition-colors ${
              activeTab === "reviews" 
                ? "text-gray-800" 
                : "text-gray-400 hover:text-gray-500"
            }`}
          >
            My Reviews
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`text-lg font-base font-['Outfit'] tracking-[-0.32px] transition-colors ${
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
                ? "left-0 w-[100px]" 
                : "left-[120px] w-[145px]"
            }`} 
          />
        </div>
      </div>

      {/* Content */}
      {activeTab === "reviews" ? (
        <>
          {/* Filters */}
          {reviews.length > 0 && (
            <div className="flex gap-4 mb-8">
              <CustomSelect
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { value: "recent", label: "Most Recent" },
                  { value: "rating", label: "Highest Rating" },
                ]}
                rounded="rounded-full"
                className="min-w-[160px]"
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
                className="w-[200px]"
                defaultValue="all"
              />
            </div>
          )}

          {/* Reviews Tab Content */}
          {reviews.length === 0 ? (
            <div className="w-full py-12 text-center">
              <p className="text-lg text-gray-500 font-['Outfit']">
                You haven't written any reviews yet.
              </p>
              <p className="text-sm text-gray-400 font-['Outfit'] mt-2">
                Share your experiences to help others find the right therapist.
              </p>
            </div>
          ) : (
            <>
              {/* Reviews Count */}
             

              {/* Reviews List */}
              <div className="flex flex-col gap-6 relative min-h-[200px]">
                {isFilterLoading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#7466f2]"></div>
                  </div>
                ) : filteredReviews.length > 0 ? (
                  visibleReviews.map((review) => (
                    <UserReviewCard 
                      key={review.id} 
                      review={review} 
                      onEdit={handleEditReview}
                      onDelete={handleDeleteReview}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-gray-500 font-['Outfit']">
                    No reviews found matching your criteria
                  </div>
                )}
              </div>

              {/* Show More Button */}
              {filteredReviews.length > visibleCount && !isLoading && (
                <div className="flex justify-center pt-8">
                  <button
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setVisibleCount((prev) => prev + 6);
                        setIsLoading(false);
                      }, 800);
                    }}
                    className="px-8 py-2 bg-white rounded-[100px] border border-solid border-[#e8e8e8] hover:border-[#7466f2] transition-all"
                  >
                    <span className="font-medium text-gray-800 text-sm font-['poppins'] tracking-[0] leading-4">
                      Show More Reviews ({filteredReviews.length - visibleCount} remaining)
                    </span>
                  </button>
                </div>
              )}
              
              {/* Loading Spinner */}
              {isLoading && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#7466f2]"></div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        /* Saved Therapists Tab Content */
        <SavedTherapistsList therapists={savedTherapists} />
      )}
    </div>
  );
}