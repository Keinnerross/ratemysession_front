"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaGlobe, FaStar, FaRegStar, FaHeart } from "react-icons/fa";
import RatingStatisticsChart from "../../reviews/charts/RatingStatisticsChart";
import ReviewsLayout from "../../reviews/layouts/reviewsLayout";
import LeaveReviewForm from "../../reviews/forms/leaveReviewForm";
import NotificationToast from "../../../global/notifications/NotificationToast";
import reviewService from "@/services/reviews/reviewService";
import reviewStateService from "@/services/reviews/reviewStateService";
import { useAuth } from "@/context/AuthContext";
import favoritesService from "@/services/users/favoritesService";

export default function TherapistProfileContent({ 
  data = {}, 
  initialReviews = [], 
  hasMoreReviews = false,
  totalReviewCount = 0,
  initialDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  isSaved: initialIsSaved = false
}) {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [savedReview, setSavedReview] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('checking'); // 'checking', 'can-review', 'already-reviewed-logged', 'already-reviewed-anonymous'
  const [buttonText, setButtonText] = useState('Rate Therapist');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  const searchParams = useSearchParams();
  const openReview = searchParams.get('openReview');
  const { user } = useAuth();
  const router = useRouter();

  // Destructure with fallback values
  const {
    id,
    name = "Therapist Name",
    slug = "",
    image = null,
    credentials = [],
    rating = 0,
    reviewCount = 0,
    specialty = "Mental Health Professional",
    location = "Location Not Available",
    bio = "Bio not available",
    insurance = [],
    address = "Address not available",
    website = "",
  } = data;

  // Calculate rating stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const handleFavoriteToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (isSaved) {
      setShowConfirmDialog(true);
      return;
    }
    
    await performFavoriteToggle();
  };

  const performFavoriteToggle = async () => {
    setIsLoadingFavorite(true);
    try {
      const success = await favoritesService.toggleFavorite(id, isSaved);
      if (success) {
        const newSavedState = !isSaved;
        setIsSaved(newSavedState);
        setNotificationMessage(
          newSavedState
            ? `${name} has been saved to your profile`
            : `${name} has been removed from your saved therapists`
        );
        setShowNotification(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setNotificationMessage('Error updating favorites. Please try again.');
      setShowNotification(true);
    } finally {
      setIsLoadingFavorite(false);
      setShowConfirmDialog(false);
    }
  };

  // Check review status for current user
  useEffect(() => {
    const checkReviewStatus = async () => {
      if (!id) return;
      
      const status = await reviewStateService.canUserReview(id, user);
      
      if (!status.canReview) {
        setReviewStatus(status.reason);
        setButtonDisabled(true);
        
        if (status.reason === 'already-reviewed-logged') {
          setButtonText('Already Reviewed');
        } else if (status.reason === 'already-reviewed-anonymous') {
          setButtonText('Already Reviewed (Anonymous)');
        }
      } else {
        setReviewStatus('can-review');
        setButtonDisabled(false);
        setButtonText('Rate Therapist');
      }
    };
    
    checkReviewStatus();
  }, [id, user]);

  // Check for saved review and open modal if coming from login
  useEffect(() => {
    if (openReview === 'true') {
      const draft = reviewService.getReviewDraft();
      if (draft && draft.therapistId === id) {
        setSavedReview(draft);
        setIsReviewFormOpen(true);
        
        // Clear the URL parameter
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [openReview, id]);

  const handleReviewSubmit = async (reviewData) => {

    // Update review status after successful submission
    if (user && user.email) {
      // For logged in users (anonymous or not), always show as logged review
      setReviewStatus('already-reviewed-logged');
      setButtonText('Already Reviewed');
    } else if (reviewData.isAnonymous) {
      // For non-logged anonymous reviews, save to localStorage
      reviewStateService.saveAnonymousReview(id);
      setReviewStatus('already-reviewed-anonymous');
      setButtonText('Already Reviewed (Anonymous)');
    }
    
    setButtonDisabled(true);

    // Show success notification
    setShowNotification(true);

    // In a real app, you would refresh the reviews list here
  };

  return (
    <div className="min-h-screen pb-8 md:pb-12 lg:pb-16 pt-4 md:pt-6 lg:pt-8 mt-16 md:mt-20 lg:mt-23 ">
      <div className="max-w-[1140px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex gap-6 md:gap-8 lg:gap-16 flex-col lg:flex-row">
          {/* Left Column - Therapist Info */}
          <div className="w-full lg:w-[370px] flex flex-col items-center lg:items-start lg:sticky lg:top-24 lg:h-fit pt-3 md:p-0 mb-2 md-0">
            {/* Profile Picture */}
            <div className="w-[200px] md:w-[240px] lg:w-full lg:max-w-[280px] aspect-square rounded-full bg-stone-300 overflow-hidden mb-2 lg:m-0">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-stone-200 to-stone-400 flex items-center justify-center">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-semibold text-stone-600 font-outfit">
                    {name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* User Mobile Name and rate */}
            <div className="lg:hidden relative">
              <div className="flex flex-col items-center">
                <h1 className="text-2xl md:text-3xl font-medium text-black font-['Outfit'] tracking-tight">
                  {name}
                </h1>
                <p className="text-lg md:text-xl font-medium text-[#7466f2] font-['Outfit'] ">
                  {specialty}
                </p>
              </div>

              {/* Rating Section */}
              <div className="">
                <div className="flex items-center gap-3 justify-center">
                  <span className="text-lg md:text-xl font-semibold text-stone-800 font-['Outfit']">
                    {rating.toFixed(1)} / 5
                  </span>

                  {/* Stars */}
                  <div className="flex gap-0.5 md:gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="w-5 h-5 md:w-6 md:h-6">
                        {star <= fullStars ? (
                          <FaStar className="text-amethyst-500 w-full h-full" />
                        ) : (
                          <FaRegStar className="text-stone-300 w-full h-full" />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Save Button */}
                  <button
                    onClick={handleFavoriteToggle}
                    disabled={isLoadingFavorite}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 ml-2"
                  >
                    <FaHeart 
                      className={`w-5 h-5 transition-all ${
                        isSaved
                          ? "text-amethyst-500 fill-current"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Rate Therapist Button Mobile */}
              <div className="lg:hidden relative flex justify-center items-center mt-2">
                <button
                  onClick={() => !buttonDisabled && setIsReviewFormOpen(true)}
                  disabled={buttonDisabled}
                  className={`px-6 lg:px-8 py-2 rounded-full text-white text-sm md:text-base font-['Outfit'] transition-colors ${
                    buttonDisabled 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#7466f2] hover:bg-[#6153e0] cursor-pointer'
                  }`}
                  title={buttonDisabled ? 'You have already reviewed this therapist' : ''}
                >
                  {buttonText}
                </button>
              </div>
            </div>

            {/* About Section */}
            <div className="mt-6 md:mt-8 flex flex-col gap-4 md:gap-6 w-full max-w-md lg:max-w-none">
              {/* About Title */}
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg text-stone-600 font-base font-['poppins'] whitespace-nowrap">
                  About
                </h3>
                <div className="flex-1 h-px bg-[#e0e5eb]"></div>
              </div>

              {/* Contact Information */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-stone-600 mt-1 flex-shrink-0 text-sm md:text-base" />
                  <p className="text-sm font-base text-stone-600 font-['poppins']">
                    {address}
                  </p>
                </div>
                {website && (
                  <div className="flex items-center gap-3">
                    <FaGlobe className="text-stone-600 text-sm md:text-base" />
                    <p className="text-sm font-base text-stone-600 font-['poppins']">
                      {website}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Credentials Section */}
            {credentials.length > 0 && (
              <div className="mt-6 md:mt-8 flex flex-col gap-2 w-full max-w-md lg:max-w-none">
                {/* Credentials Title */}
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg text-stone-600 font-['Outfit'] whitespace-nowrap">
                    Credentials
                  </h3>
                  <div className="flex-1 h-px bg-[#e0e5eb]"></div>
                </div>

                {/* Credential Details */}
                <div className="text-sm font-base text-stone-600 font-['poppins'] leading-normal">
                  {credentials.map((credential, index) => (
                    <p key={index}>{credential}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Main Content */}
          <div className="w-full flex flex-col">
            {/* Therapist Info */}
            <div className="w-full flex flex-col xl:flex-row justify-between gap-6 xl:gap-8">
              {/* Therapist Details */}
              <div className="w-full flex flex-col gap-4">
                {/* Header Info */}
                <div className="hidden lg:block">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                    <h1 className="text-2xl font-medium text-black font-['Outfit'] tracking-0 whitespace-nowrap m-0">
                      {name}
                    </h1>
                    <div>
                      {/* Location tag */}
                      <div className="px-2 py-1 bg-[#f3f1ff] rounded-full flex items-center gap-1">
                        <FaMapMarkerAlt className="text-[#7466f2] text-base" />
                        <span className="text-sm  text-[#7466f2] font-['Outfit'] whitespace-nowrap">
                          {location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-lg  font-medium text-[#7466f2] font-['Outfit'] ">
                    {specialty}
                  </p>
                  {/* Location Badge */}

                  {/* Rating Section */}
                  <div className="mt-4 md:mt-2">
                    <p className="text-xs  font-medium text-[#767676] font-['Outfit'] tracking-wide uppercase">
                      RATING
                    </p>

                    <div className="flex items-center gap-3  mt-1">
                      <span className="text-lg font-semibold text-stone-800 font-['Outfit']">
                        {rating.toFixed(1)} / 5
                      </span>

                      {/* Stars */}
                      <div className="flex gap-0.5 md:gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star} className="w-5 h-5 ">
                            {star <= fullStars ? (
                              <FaStar className="text-amethyst-500 w-full h-full" />
                            ) : (
                              <FaRegStar className="text-stone-300 w-full h-full" />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Save Button */}
                      <button
                        onClick={handleFavoriteToggle}
                        disabled={isLoadingFavorite}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 ml-2"
                      >
                        <FaHeart 
                          className={`w-5 h-5 transition-all ${
                            isSaved
                              ? "text-amethyst-500 fill-current"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block">
                  {/* Rate Therapist Button */}
                  <button
                    onClick={() => !buttonDisabled && setIsReviewFormOpen(true)}
                    disabled={buttonDisabled}
                    className={`px-6 md:px-8 py-2 rounded-full text-white text-sm md:text-base font-['Outfit'] transition-colors ${
                      buttonDisabled 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-[#7466f2] hover:bg-[#6153e0] cursor-pointer'
                    }`}
                    title={buttonDisabled ? 'You have already reviewed this therapist' : ''}
                  >
                    {buttonText}
                  </button>
                </div>
              </div>

              {/* Statistics Chart */}
              <div className="w-full xl:max-w-lg h-64  order-first xl:order-last">
                <RatingStatisticsChart
                  rating={rating}
                  distribution={initialDistribution}
                />
              </div>
            </div>

            {/* Reviews Section */}

            <div>
              <ReviewsLayout 
                therapistId={id}
                therapistName={name}
                therapistImage={image}
                initialComments={initialReviews}
                initialHasMore={hasMoreReviews}
                totalReviewCount={totalReviewCount}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Leave Review Form Modal */}
      <LeaveReviewForm
        isOpen={isReviewFormOpen}
        onClose={() => {
          setIsReviewFormOpen(false);
          setSavedReview(null);
        }}
        therapistName={name}
        therapistSpecialty={specialty}
        therapistImage={image}
        therapistId={id}
        therapistSlug={slug}
        onSubmit={handleReviewSubmit}
        savedReview={savedReview}
        initialStep={savedReview ? 2 : 1}
      />

      {/* Success Notification */}
      <NotificationToast
        message={notificationMessage || "Thanks for your review!"}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
      
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold font-outfit mb-4">
              Remove from favorites?
            </h3>
            <p className="text-gray-600 font-poppins mb-6">
              Are you sure you want to remove {name} from your favorites list?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-gray-600 font-poppins hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={performFavoriteToggle}
                className="px-4 py-2 bg-amethyst-500 text-white rounded-lg hover:bg-amethyst-600 transition-colors font-poppins"
              >
                Yes, remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
