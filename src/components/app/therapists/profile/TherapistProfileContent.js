"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaMapMarkerAlt, FaGlobe, FaStar, FaRegStar } from "react-icons/fa";
import RatingStatisticsChart from "../../reviews/charts/RatingStatisticsChart";
import ReviewsLayout from "../../reviews/layouts/reviewsLayout";
import LeaveReviewForm from "../../reviews/forms/leaveReviewForm";
import NotificationToast from "../../../global/notifications/NotificationToast";
import reviewService from "@/services/reviews/reviewService";

export default function TherapistProfileContent({ 
  data = {}, 
  initialReviews = [], 
  hasMoreReviews = false,
  totalReviewCount = 0,
  initialDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
}) {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [savedReview, setSavedReview] = useState(null);
  const searchParams = useSearchParams();
  const openReview = searchParams.get('openReview');

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

  const handleReviewSubmit = (reviewData) => {
    // Here you would normally send the review to your backend
    console.log("New review submitted:", reviewData);

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
                <div className="flex items-center gap-3 ">
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
                </div>
              </div>

              {/* Rate Therapist Button Mobile */}
              <div className="lg:hidden relative flex justify-center items-center mt-2">
                <button
                  onClick={() => setIsReviewFormOpen(true)}
                  className="px-6 lg:px-8 py-2 bg-[#7466f2] rounded-full text-white text-sm md:text-base font-['Outfit'] hover:bg-[#6153e0] transition-colors"
                >
                  Rate Therapist
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
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block">
                  {/* Rate Therapist Button */}
                  <button
                    onClick={() => setIsReviewFormOpen(true)}
                    className="px-6 md:px-8 py-2 bg-[#7466f2] rounded-full text-white text-sm md:text-base font-['Outfit'] hover:bg-[#6153e0] transition-colors"
                  >
                    Rate Therapist
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
        message="Thanks for your review!"
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}
