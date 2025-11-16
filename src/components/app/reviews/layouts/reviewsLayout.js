"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import TherapistCardRated from "../cards/therapistCardRated";
import TherapistCardRatedSummaryAI from "../cards/therapistCardRatedSumaryAI";
import CustomSelect from "@/components/global/inputs/CustomSelect";
import { loadMoreReviews } from "@/app/(core)/(application)/therapist-profile/actions";
import reactionService from "@/services/reviews/reactionService";
import { aiSummaryService } from "@/services/therapists/aiSummaryService";

export default function ReviewsLayout({
  therapistId,
  therapistName,
  therapistImage,
  initialComments = [],
  initialHasMore = false,
  totalReviewCount = 0,
  aiSummary = null
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState("all");
  const [comments, setComments] = useState(initialComments);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAISummaryHelpful, setIsAISummaryHelpful] = useState(aiSummary?.isUseful || false);
  const [aiHelpfulCount, setAiHelpfulCount] = useState(aiSummary?.usefulCount || 0);
  const [reactingCommentId, setReactingCommentId] = useState(null);
  const [reactingAISummary, setReactingAISummary] = useState(false);
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
        // Get userId from localStorage if available (set during login)
        let userId = null;
        if (typeof window !== 'undefined') {
          const userDataStr = localStorage.getItem('user');
          if (userDataStr) {
            try {
              const userData = JSON.parse(userDataStr);
              userId = userData.id || null;
            } catch (e) {
              console.error('Error parsing user data:', e);
            }
          }
        }

        const result = await loadMoreReviews(therapistId, 1, sortBy, filterRating, userId);
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

  const handleReaction = React.useCallback(async (commentId, reactionType) => {
    // Check if user is logged in
    if (!user) {
      router.push('/register');
      return;
    }

    // Prevent multiple simultaneous reactions on the same comment
    if (reactingCommentId === commentId) {
      return;
    }

    setReactingCommentId(commentId);

    // Optimistic update
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          const currentReaction = comment.userReaction;
          const currentReactions = comment.reactions || {};

          // Create new reactions object with all keys explicitly initialized
          const newReactions = {
            useful: currentReactions.useful || 0,
            helpful: currentReactions.helpful || 0,
            insightful: currentReactions.insightful || 0,
            inappropriate: currentReactions.inappropriate || 0
          };

          if (currentReaction === reactionType) {
            // Remove reaction
            newReactions[reactionType] = Math.max(0, newReactions[reactionType] - 1);
            return {
              ...comment,
              reactions: newReactions,
              userReaction: null
            };
          } else {
            // Remove previous reaction if exists
            if (currentReaction) {
              newReactions[currentReaction] = Math.max(0, newReactions[currentReaction] - 1);
            }
            // Add new reaction
            newReactions[reactionType] = newReactions[reactionType] + 1;
            return {
              ...comment,
              reactions: newReactions,
              userReaction: reactionType
            };
          }
        }
        return comment;
      })
    );

    try {
      // Call API to persist the reaction
      const response = await reactionService.toggleReaction(commentId, reactionType);

      // Update with actual data from server
      if (response.success) {
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                reactions: response.reactions,
                userReaction: response.userReaction
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error('Failed to update reaction:', error);

      // Revert optimistic update on error
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === commentId) {
            const currentReaction = comment.userReaction;
            const currentReactions = comment.reactions || {};

            // Create new reactions object with all keys explicitly initialized
            const newReactions = {
              useful: currentReactions.useful || 0,
              helpful: currentReactions.helpful || 0,
              insightful: currentReactions.insightful || 0,
              inappropriate: currentReactions.inappropriate || 0
            };

            // Revert the optimistic change
            if (currentReaction === reactionType) {
              newReactions[reactionType] = newReactions[reactionType] + 1;
              return {
                ...comment,
                reactions: newReactions,
                userReaction: reactionType
              };
            } else {
              if (currentReaction) {
                newReactions[currentReaction] = newReactions[currentReaction] + 1;
              }
              newReactions[reactionType] = Math.max(0, newReactions[reactionType] - 1);
              return {
                ...comment,
                reactions: newReactions,
                userReaction: currentReaction
              };
            }
          }
          return comment;
        })
      );

      // Show error to user (you could add a toast notification here)
      alert('Failed to update reaction. Please try again.');
    } finally {
      setReactingCommentId(null);
    }
  }, [user, router, reactingCommentId]);

  const handleViewReview = (reviewId) => {
    console.log("View review:", reviewId);
    // Implement view review logic
  };

  const handleMenuClick = () => {
    console.log("Menu clicked");
    // Implement menu logic
  };

  const handleAISummaryReaction = React.useCallback(async () => {
    // Check if user is logged in
    if (!user) {
      router.push('/register');
      return;
    }

    // Prevent multiple simultaneous reactions
    if (reactingAISummary) {
      return;
    }

    setReactingAISummary(true);

    // Optimistic update
    const wasUseful = isAISummaryHelpful;
    setIsAISummaryHelpful(!wasUseful);
    setAiHelpfulCount(wasUseful ? aiHelpfulCount - 1 : aiHelpfulCount + 1);

    try {
      // Call API to persist the reaction
      const response = await aiSummaryService.toggleUsefulReaction(therapistId);

      // Update with actual data from server
      if (response.success) {
        setIsAISummaryHelpful(response.isUseful);
        setAiHelpfulCount(response.usefulCount);
      }
    } catch (error) {
      console.error('Failed to update AI summary reaction:', error);

      // Revert optimistic update on error
      setIsAISummaryHelpful(wasUseful);
      setAiHelpfulCount(wasUseful ? aiHelpfulCount + 1 : aiHelpfulCount - 1);

      // Show error to user
      alert('Failed to update reaction. Please try again.');
    } finally {
      setReactingAISummary(false);
    }
  }, [user, router, therapistId, isAISummaryHelpful, aiHelpfulCount, reactingAISummary]);

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

      {/* AI Summary Card - Only show if content exists */}
      {aiSummary?.hasContent && aiSummary.content && (
        <div className="bg-white rounded-lg mb-8">
          <TherapistCardRatedSummaryAI
            summary={aiSummary.content}
            totalReviews={totalReviews}
            helpfulCount={aiHelpfulCount}
            isHelpful={isAISummaryHelpful}
            onReaction={handleAISummaryReaction}
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
