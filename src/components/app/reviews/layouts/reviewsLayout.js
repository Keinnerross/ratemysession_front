"use client";

import React, { useState } from "react";
import TherapistCardRated from "../cards/therapistCardRated";
import TherapistCardRatedSummaryAI from "../cards/therapistCardRatedSumaryAI";
import CustomSelect from "@/components/global/inputs/CustomSelect";
import commentsData from "@/data/comments";

export default function ReviewsLayout({
  therapistId,
  therapistName,
  therapistImage,
}) {
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState("all");
  const [comments, setComments] = useState(commentsData);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isAISummaryHelpful, setIsAISummaryHelpful] = useState(false);
  const [aiHelpfulCount, setAiHelpfulCount] = useState(87);

  // Reset visible count and show loader when filters change
  React.useEffect(() => {
    setIsFilterLoading(true);
    setVisibleCount(6);
    
    const timer = setTimeout(() => {
      setIsFilterLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [sortBy, filterRating]);

  // Filter comments by therapist if therapistId is provided
  const therapistComments = therapistId
    ? comments.filter((comment) => comment.therapistId === therapistId)
    : comments;

  // Apply sorting
  const sortedComments = [...therapistComments].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === "helpful") {
      const totalReactionsA = Object.values(a.reactions).reduce(
        (sum, count) => sum + count,
        0
      );
      const totalReactionsB = Object.values(b.reactions).reduce(
        (sum, count) => sum + count,
        0
      );
      return totalReactionsB - totalReactionsA;
    }
    return 0;
  });

  // Apply rating filter
  const filteredComments = sortedComments.filter((comment) => {
    if (filterRating === "all") return true;
    return comment.rating === parseInt(filterRating);
  });

  // Calculate stats
  const totalReviews = therapistComments.length;
  const averageRating =
    totalReviews > 0
      ? (
          therapistComments.reduce((sum, comment) => sum + comment.rating, 0) /
          totalReviews
        ).toFixed(1)
      : 0;

  const handleReaction = (commentId, reactionType) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          const newComment = { ...comment };
          const currentReaction = comment.userReaction;

          if (currentReaction === reactionType) {
            // Remove reaction
            newComment.reactions[reactionType]--;
            newComment.userReaction = null;
          } else {
            // Add/change reaction
            if (currentReaction) {
              newComment.reactions[currentReaction]--;
            }
            newComment.reactions[reactionType]++;
            newComment.userReaction = reactionType;
          }

          return newComment;
        }
        return comment;
      })
    );
  };

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

      {/* Stats */}
      {therapistId && (
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-medium text-[#313131] font-['Outfit']">
              {averageRating}
            </span>
            <div className="flex text-[#ffc107]">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={i < Math.round(averageRating) ? "" : "opacity-30"}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <span className="text-lg text-gray-600 font-['Outfit']">
            Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
          </span>
        </div>
      )}

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
      {therapistComments.length > 0 && (
        <div className="bg-white rounded-lg mb-8">
          <TherapistCardRatedSummaryAI 
            totalReviews={therapistComments.length}
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
      <div className="flex flex-col gap-8 pt-8">
        <div className="flex flex-col bg-white rounded-lg gap-16 relative min-h-[200px] ">
          {isFilterLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#7466f2]"></div>
            </div>
          ) : filteredComments.length > 0 ? (
            filteredComments
              .slice(0, visibleCount)
              .map((comment) => (
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
        {filteredComments.length > visibleCount && !isLoading && (
          <div className="flex justify-center pt-4">
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
                Show More Reviews ({filteredComments.length - visibleCount}{" "}
                remaining)
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
      </div>
    </div>
  );
}
