'use client';

import { ButtonCustom } from "@/components/global/buttons/buttons";
import { RecentActivityCard } from "./components/recentActivitiesCard";
import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useScrollAppear } from "@/utils/scrollAppear";
import recentReviewsService from "@/services/reviews/recentReviewsService";
import reactionService from "@/services/reviews/reactionService";
import { useAuth } from "@/context/AuthContext";

export function RecentActivitiesSection() {
    const sectionRef = useRef(null);
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showingCount, setShowingCount] = useState(6); // Start showing 6 reviews
    const [reactingCommentId, setReactingCommentId] = useState(null);

    useScrollAppear(
        sectionRef,
        () => setIsVisible(true),
        () => setIsVisible(false),
        0.1,
        50
    );

    // Fetch reviews on mount
    useEffect(() => {
        // Wait for AuthContext to finish loading before fetching reviews
        if (authLoading) return;

        const fetchReviews = async () => {
            try {
                setLoading(true);

                // Service will handle userId extraction from localStorage
                const data = await recentReviewsService.getRecentReviews(12);
                setReviews(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch recent reviews:', err);
                setError('Failed to load recent reviews');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [authLoading]); // Only depend on authLoading, not user

    // Handle button click
    const handleButtonClick = () => {
        if (showingCount === 6) {
            // First click: show all 12 reviews
            setShowingCount(12);
        } else {
            // Second click: redirect to search
            router.push('/search');
        }
    };

    // Handle reaction
    const handleReaction = useCallback(async (commentId, reactionType) => {
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
        setReviews((prevReviews) =>
            prevReviews.map((review) => {
                if (review.id === commentId) {
                    const currentReaction = review.userReaction;
                    const currentReactions = review.reactions || {};

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
                            ...review,
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
                            ...review,
                            reactions: newReactions,
                            userReaction: reactionType
                        };
                    }
                }
                return review;
            })
        );

        try {
            // Call API to persist the reaction
            const response = await reactionService.toggleReaction(commentId, reactionType);

            // Update with actual data from server
            if (response.success) {
                setReviews((prevReviews) =>
                    prevReviews.map((review) => {
                        if (review.id === commentId) {
                            return {
                                ...review,
                                reactions: response.reactions,
                                userReaction: response.userReaction
                            };
                        }
                        return review;
                    })
                );
            }
        } catch (error) {
            console.error('Failed to update reaction:', error);

            // Revert optimistic update on error
            setReviews((prevReviews) =>
                prevReviews.map((review) => {
                    if (review.id === commentId) {
                        const currentReaction = review.userReaction;
                        const currentReactions = review.reactions || {};

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
                                ...review,
                                reactions: newReactions,
                                userReaction: reactionType
                            };
                        } else {
                            if (currentReaction) {
                                newReactions[currentReaction] = newReactions[currentReaction] + 1;
                            }
                            newReactions[reactionType] = Math.max(0, newReactions[reactionType] - 1);
                            return {
                                ...review,
                                reactions: newReactions,
                                userReaction: currentReaction
                            };
                        }
                    }
                    return review;
                })
            );

            // Show error to user
            alert('Failed to update reaction. Please try again.');
        } finally {
            setReactingCommentId(null);
        }
    }, [user, router, reactingCommentId]);

    // Determine button text
    const buttonText = showingCount === 6 ? 'View More Reviews' : 'Search Therapists';

    // Get reviews to display based on current count
    const displayedReviews = reviews.slice(0, showingCount);

    return (
        <section
            ref={sectionRef}
            className="pb-16 md:pb-26 pt-8 md:pt-16 transition-all duration-700"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
        >
            <div className="container relative mx-auto max-w-[1330px] px-6 md:px-8 lg:px-0">

                {/* Section Header */}
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">
                        Recent Activities
                    </h2>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading recent reviews...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-12">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}

                {/* Cards Grid */}
                {!loading && !error && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 justify-items-center w-full">
                            {displayedReviews.map((review, index) => (
                                <RecentActivityCard
                                    key={review.id || index}
                                    review={review}
                                    onReaction={handleReaction}
                                />
                            ))}
                        </div>

                        {/* View More Button - Only show if we have reviews */}
                        {reviews.length > 0 && (
                            <div className="flex justify-center z-10 relative">
                                <ButtonCustom
                                    variant={1}
                                    onClick={handleButtonClick}
                                >
                                    {buttonText}
                                </ButtonCustom>
                            </div>
                        )}
                    </>
                )}

                <div className="absolute bottom-0 w-full h-[200px] sm:h-[300px] md:h-[450px] lg:h-[600px] bg-gradient-to-t from-white from-18% to-transparent pointer-events-none" />

            </div>
        </section>
    );
}
