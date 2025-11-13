"use client";

import React, { useState, useTransition, useEffect } from "react";
import TherapistCardRated from "../cards/therapistCardRated";
import TherapistCardRatedSummaryAI from "../cards/therapistCardRatedSumaryAI";
import CustomSelect from "@/components/global/inputs/CustomSelect";
import { loadMoreReviews } from "@/app/(core)/(application)/therapist-profile/actions";

export default function ReviewsLayout({
  therapistId,
  therapistName,
  therapistImage,
  initialComments = [],
  initialHasMore = false,
  totalReviewCount = 0
}) {
  const [isPending, startTransition] = useTransition();
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState("all");
  const [comments, setComments] = useState(initialComments);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAISummaryHelpful, setIsAISummaryHelpful] = useState(false);
  const [aiHelpfulCount, setAiHelpfulCount] = useState(87);
  const isFirstRender = React.useRef(true);

  // Handle filter changes - load new data from server
  useEffect(() => {
    if (!therapistId) return;
    
    // Skip the first render since we already have initial data
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    setCurrentPage(1);
    
    startTransition(async () => {
      try {
        const result = await loadMoreReviews(therapistId, 1, sortBy, filterRating);
        if (result) {
          setComments(result.reviews);
          setHasMore(result.hasMore);
        }
      } catch (error) {
        console.error('Failed to load filtered reviews:', error);
      }
    });
  }, [sortBy, filterRating, therapistId]);

  // Use API data directly - no local filtering needed
  const displayComments = comments;

  // Calculate stats - use totalReviewCount from props for API data
  const totalReviews = totalReviewCount;
  const averageRating =
    comments.length > 0
      ? (
          comments.reduce((sum, comment) => sum + comment.rating, 0) /
          comments.length
        ).toFixed(1)
      : 0;

  const handleReaction = React.useCallback((commentId, reactionType) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          // Create a deep copy to avoid mutations
          const newComment = {
            ...comment,
            reactions: { ...comment.reactions }
          };
          const currentReaction = comment.userReaction;

          if (currentReaction === reactionType) {
            // Remove reaction
            newComment.reactions[reactionType] = Math.max(0, newComment.reactions[reactionType] - 1);
            newComment.userReaction = null;
          } else {
            // Add/change reaction
            if (currentReaction) {
              newComment.reactions[currentReaction] = Math.max(0, newComment.reactions[currentReaction] - 1);
            }
            newComment.reactions[reactionType] = (newComment.reactions[reactionType] || 0) + 1;
            newComment.userReaction = reactionType;
          }

          return newComment;
        }
        return comment;
      })
    );
  }, []);

  const handleViewReview = (reviewId) => {
    console.log("View review:", reviewId);
    // Implement view review logic
  };

  const handleMenuClick = () => {
    console.log("Menu clicked");
    // Implement menu logic
  };

  return (
    <div className="w-full max-w-[1050px] flex flex-col">
      {/* Header */}
      <div className="relative mb-8">
        <h2 className="text-xl font-medium text-[#313131] font-['Outfit'] tracking-[-0.32px] mb-2">
          Reviews
        </h2>
        <div className="w-full h-px bg-gray-200 relative">
          <div className="absolute top-0 left-0 w-[100px] h-1 bg-[#7466f2]" />
        </div>
      </div>

     

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <CustomSelect
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: "recent", label: "Most Recent" },
            { value: "helpful", label: "Most Helpful" },
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

      {/* AI Summary Card - Always visible at top */}
      {totalReviews > 0 && (
        <div className="bg-white rounded-lg mb-8">
          <TherapistCardRatedSummaryAI 
            totalReviews={totalReviews}
            helpfulCount={aiHelpfulCount}
            isHelpful={isAISummaryHelpful}
            onReaction={(id, type) => {
              if (type === 'helpful') {
                if (!isAISummaryHelpful) {
                  setAiHelpfulCount(aiHelpfulCount + 1);
                  setIsAISummaryHelpful(true);
                } else {
                  setAiHelpfulCount(aiHelpfulCount - 1);
                  setIsAISummaryHelpful(false);
                }
              }
            }}
          />
        </div>
      )}

      {/* Reviews List */}
      <div className="flex flex-col gap-8 pt-4">
        <div className="flex flex-col bg-white rounded-lg gap-8 relative min-h-[200px] ">
          {isPending && comments.length === 0 ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#7466f2]"></div>
            </div>
          ) : displayComments.length > 0 ? (
            displayComments.map((comment) => (
                <TherapistCardRated
                  key={comment.id}
                  comment={comment}
                  therapistName={therapistName || "Therapist"}
                  therapistImage={therapistImage}
                  onViewReview={handleViewReview}
                  onMenuClick={handleMenuClick}
                  onReaction={handleReaction}
                />
              ))
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-500 font-['Outfit']">
              No reviews found matching your criteria
            </div>
          )}
        </div>

        {/* Show More Button */}
        {hasMore && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                const nextPage = currentPage + 1;
                startTransition(async () => {
                  try {
                    const result = await loadMoreReviews(therapistId, nextPage, sortBy, filterRating);
                    if (result && result.reviews) {
                      setComments(prev => [...prev, ...result.reviews]);
                      setHasMore(result.hasMore);
                      setCurrentPage(nextPage);
                    }
                  } catch (error) {
                    console.error('Failed to load more reviews:', error);
                  }
                });
              }}
              disabled={isPending}
              className="px-8 py-2 bg-white rounded-[100px] border border-solid border-[#e8e8e8] hover:border-[#7466f2] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending && comments.length > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-[#7466f2]"></div>
                  <span className="font-medium text-gray-800 text-sm font-['poppins'] tracking-[0] leading-4">
                    Loading...
                  </span>
                </div>
              ) : (
                <span className="font-medium text-gray-800 text-sm font-['poppins'] tracking-[0] leading-4">
                  Show More Reviews
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
