"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import UserProfileContent from "@/components/app/user/profile/UserProfileContent";
import { therapists } from "@/data/therapists";
import userReviewsService from "@/services/reviews/userReviewsService";
import favoritesTherapistsService from "@/services/users/favoritesTherapistsService";

export default function UserProfileClient({ initialData = {} }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Initialize states with server data if available
  const [userData, setUserData] = useState(initialData.user || null);
  const [userReviews, setUserReviews] = useState(
    initialData.reviews?.items ?
      userReviewsService.transformReviews(initialData.reviews.items) :
      []
  );
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsPagination, setReviewsPagination] = useState(
    initialData.reviews?.pagination || null
  );
  const [currentFilters, setCurrentFilters] = useState({});

  // Favorite therapists state
  const [favoriteTherapists, setFavoriteTherapists] = useState(
    initialData.favoriteTherapists?.items ?
      favoritesTherapistsService.transformTherapists(initialData.favoriteTherapists.items) :
      []
  );
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesPagination, setFavoritesPagination] = useState(
    initialData.favoriteTherapists?.pagination || null
  );
  const [currentFavoritesFilters, setCurrentFavoritesFilters] = useState({});

  // Store initial totals (absolute counts that never change)
  const [initialTotalReviews] = useState(initialData.reviews?.pagination?.totalComments || 0);
  const [initialTotalFavorites] = useState(initialData.favoriteTherapists?.pagination?.total || 0);

  // Define fetchUserReviews with useCallback first to avoid hooks order issues
  const fetchUserReviews = useCallback(async (email, page = 1, perPage = 10, filters = {}, append = false) => {
    try {
      setReviewsLoading(true);
      const response = await userReviewsService.getUserReviews(email, page, perPage, filters);
      
      // Transform reviews to match frontend format
      const transformedReviews = userReviewsService.transformReviews(response.reviews);

      // Append or replace reviews based on pagination
      if (append) {
        setUserReviews(prev => [...prev, ...transformedReviews]);
      } else {
        setUserReviews(transformedReviews);
      }
      
      setReviewsPagination(response.pagination);
      setCurrentFilters(filters);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      // Use empty array as fallback
      setUserReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  // Fetch favorite therapists with pagination
  const fetchFavoriteTherapists = useCallback(async (page = 1, perPage = 6, filters = {}, append = false) => {
    try {
      setFavoritesLoading(true);
      const response = await favoritesTherapistsService.getFavoriteTherapists(page, perPage, filters);

      // Transform therapists to match frontend format
      const transformedTherapists = favoritesTherapistsService.transformTherapists(response.therapists);

      // Append or replace therapists based on pagination
      if (append) {
        setFavoriteTherapists(prev => [...prev, ...transformedTherapists]);
      } else {
        setFavoriteTherapists(transformedTherapists);
      }

      setFavoritesPagination(response.pagination);
      setCurrentFavoritesFilters(filters);
    } catch (error) {
      console.error('Error fetching favorite therapists:', error);
      // Use empty array as fallback
      setFavoriteTherapists([]);
    } finally {
      setFavoritesLoading(false);
    }
  }, []);

  // Memoized callbacks to prevent infinite loops - Reviews
  const handleFilterChange = useCallback((filters) => {
    if (user?.email) {
      fetchUserReviews(user.email, 1, 10, filters);
    }
  }, [user?.email, fetchUserReviews]);

  const handleLoadMore = useCallback(() => {
    if (reviewsPagination?.hasNextPage && user?.email) {
      const nextPage = reviewsPagination.currentPage + 1;
      fetchUserReviews(user.email, nextPage, 10, currentFilters, true);
    }
  }, [user?.email, reviewsPagination, currentFilters, fetchUserReviews]);

  // Memoized callbacks for favorites
  const handleFavoritesFilterChange = useCallback((filters) => {
    fetchFavoriteTherapists(1, 6, filters);
  }, [fetchFavoriteTherapists]);

  const handleFavoritesLoadMore = useCallback(() => {
    if (favoritesPagination?.hasNextPage) {
      const nextPage = favoritesPagination.currentPage + 1;
      fetchFavoriteTherapists(nextPage, 6, currentFavoritesFilters, true);
    }
  }, [favoritesPagination, currentFavoritesFilters, fetchFavoriteTherapists]);

  // Handle review update (e.g., visibility change)
  const handleReviewUpdate = useCallback((reviewId, updatedData) => {
    setUserReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, ...updatedData }
          : review
      )
    );
  }, []);

  // Handle review delete
  const handleReviewDelete = useCallback((reviewId) => {
    setUserReviews(prev => prev.filter(review => review.id !== reviewId));

    // Update review count
    setUserData(prev => prev ? {
      ...prev,
      reviewsCount: Math.max(0, (prev.reviewsCount || 0) - 1)
    } : null);

    // Update pagination
    setReviewsPagination(prev => prev ? {
      ...prev,
      totalComments: Math.max(0, (prev.totalComments || 0) - 1)
    } : null);
  }, []);

  // Handle user data update (name, photo, etc.)
  const handleUserDataUpdate = useCallback((updatedData) => {
    setUserData(updatedData);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      router.push('/login');
    } else if (user && !userData) {
      // Set user data if not already set from server
      const newUserData = {
        id: user.id || 206,
        name: user.displayName || user.email?.split('@')[0] || "User",
        email: user.email || "",
        image: user.avatar || null,
        joinDate: new Date().toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        }),
        reviewsCount: initialData.reviews?.totalCount || 0,
        location: "Not specified",
      };
      setUserData(newUserData);

      // Only fetch if we don't have initial data
      if (!initialData.reviews?.items || initialData.reviews.items.length === 0) {
        fetchUserReviews(user.email, 1, 10);
      }

      // Fetch favorite therapists if we don't have initial data
      if (!initialData.favoriteTherapists?.items || initialData.favoriteTherapists.items.length === 0) {
        fetchFavoriteTherapists(1, 6);
      }
    }
  }, [user, loading, router, fetchUserReviews, fetchFavoriteTherapists, userData, initialData]);

  // If we have initial data from server, never show loading
  // Only redirect to login if no user data at all
  if (!userData && !initialData.user) {
    return null; // Let the useEffect handle the redirect
  }

  return <UserProfileContent
    data={userData}
    userReviews={userReviews}
    savedTherapists={favoriteTherapists}
    reviewsLoading={reviewsLoading}
    reviewsPagination={reviewsPagination}
    onReviewsFilterChange={handleFilterChange}
    onLoadMore={handleLoadMore}
    onReviewUpdate={handleReviewUpdate}
    onReviewDelete={handleReviewDelete}
    onUserDataUpdate={handleUserDataUpdate}
    favoritesLoading={favoritesLoading}
    favoritesPagination={favoritesPagination}
    onFavoritesFilterChange={handleFavoritesFilterChange}
    onFavoritesLoadMore={handleFavoritesLoadMore}
    initialTotalReviews={initialTotalReviews}
    initialTotalFavorites={initialTotalFavorites}
  />;
}