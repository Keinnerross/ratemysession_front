"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaStar, FaRegStar, FaTimes, FaChevronLeft } from "react-icons/fa";
import { HiOutlineUser } from "react-icons/hi";
import { FaUserSecret } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import reviewService from "@/services/reviews/reviewService";
import reviewStateService from "@/services/reviews/reviewStateService";

export default function LeaveReviewForm({ 
  isOpen, 
  onClose, 
  therapistName = "Therapist",
  therapistSpecialty = "Mental Health Counselor",
  therapistImage = null,
  therapistId,
  therapistSlug,
  onSubmit,
  initialStep = 1,
  savedReview = null
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [rating, setRating] = useState(savedReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState(savedReview?.title || "");
  const [content, setContent] = useState(savedReview?.content || "");
  const [identityChoice, setIdentityChoice] = useState("anonymous");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Load saved review if coming back from login
  useEffect(() => {
    if (savedReview && isOpen) {
      setRating(savedReview.rating || 0);
      setContent(savedReview.content || "");
      setTitle(savedReview.title || "");
      setCurrentStep(2); // Go directly to step 2
    }
  }, [savedReview, isOpen]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Check if user can review before submitting
      const canReviewStatus = await reviewStateService.canUserReview(therapistId, user);
      
      if (!canReviewStatus.canReview) {
        alert(canReviewStatus.message || 'You have already reviewed this therapist');
        handleClose();
        return;
      }
      
      const result = await reviewService.submitReview(
        therapistId,
        content,
        rating,
        identityChoice === "anonymous",
        user
      );
      
      if (result.success) {
        // Save anonymous review to localStorage only for non-logged users
        if (identityChoice === "anonymous" && !user) {
          reviewStateService.saveAnonymousReview(therapistId);
        }
        
        // Pass the review data with identity choice to parent
        onSubmit({
          ...result.data,
          isAnonymous: identityChoice === "anonymous"
        });
        handleClose();
      } else {
        // Handle duplicate review error
        if (result.error && result.error.includes('already reviewed')) {
          alert('You have already reviewed this therapist');
          handleClose();
        } else {
          alert('Error submitting review: ' + result.error);
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setCurrentStep(1);
    setRating(0);
    setTitle("");
    setContent("");
    setIdentityChoice("anonymous");
    setTermsAccepted(false);
    onClose();
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      // Validate form before proceeding
      if (rating === 0) {
        alert("Please select a rating");
        return;
      }
      if (content.length < 10) {
        alert("Please write at least 10 characters");
        return;
      }
      if (!termsAccepted) {
        alert("Please accept the terms and conditions");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Handle identity choice
      if (identityChoice === "account" && !user) {
        // Save review draft and redirect to login
        reviewService.saveReviewDraft(therapistId, {
          rating,
          title,
          content
        });
        
        const returnUrl = `/therapist-profile?id=${therapistId}&openReview=true`;
        router.push(`/register?returnTo=${encodeURIComponent(returnUrl)}`);
      } else {
        // Submit the review
        handleSubmit();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs bg-opacity-50 z-50 flex items-center justify-center"
        onClick={handleClose}
      >
        {/* Modal */}
        <div 
          className={`bg-white rounded-[30px] transition-all duration-300 flex flex-col ${
            currentStep === 1 ? 'w-[625px] min-h-[440px]' : 'w-[625px] h-[480px]'
          } p-5`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleClose}
              className="flex items-center gap-1 text-[#7f7f7f] hover:text-gray-900 transition-colors"
            >
              <FaTimes className="w-3 h-3" />
              <span className="text-xs font-['Outfit'] tracking-[0.16px] uppercase">
                Cancel
              </span>
            </button>

            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>



          {/* Step Indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              {/* Step 1 */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                currentStep >= 1 ? 'bg-[#7466f2]' : 'border border-[#7466f2]'
              }`}>
                <span className={`font-['Outfit'] font-light ${
                  currentStep >= 1 ? 'text-white' : 'text-[#7466f2]'
                }`}>
                  1
                </span>
              </div>

              {/* Connector Line */}
              <div className="w-20 h-0.5 bg-gray-200 relative">
                <div 
                  className={`absolute top-0 left-0 h-full bg-[#7466f2] transition-all duration-300 ${
                    currentStep === 2 ? 'w-full' : 'w-0'
                  }`}
                />
              </div>

              {/* Step 2 */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                currentStep >= 2 ? 'bg-[#7466f2]' : 'border border-[#7466f2]'
              }`}>
                <span className={`font-['Outfit'] font-light ${
                  currentStep >= 2 ? 'text-white' : 'text-[#7466f2]'
                }`}>
                  2
                </span>
              </div>
            </div>
          </div>

          

          {/* Step Content */}
          <div className="flex-1 flex flex-col">
            {currentStep === 1 ? (
              // Step 1: Review Form
              <div className="flex flex-col items-center">
                {/* Therapist Image */}
                <div className="w-[90px] h-[90px] rounded-full bg-gray-300 overflow-hidden mb-2">
                  {therapistImage ? (
                    <img
                      src={therapistImage}
                      alt={therapistName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-[#b9b1ff] to-[#9d93ff] flex items-center justify-center">
                      <span className="text-3xl font-semibold text-white font-['Outfit']">
                        {therapistName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <h2 className="text-[20px] font-light font-['Outfit'] text-[#191919] text-center">
                  {therapistName}
                </h2>
                <p className="text-sm font-medium font-['Outfit'] text-[#7466f2] mb-1">
                  {therapistSpecialty}
                </p>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      {star <= (hoveredRating || rating) ? (
                        <FaStar className="w-8 h-8 text-[#ffc107]" />
                      ) : (
                        <FaRegStar className="w-8 h-8 text-gray-300" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Review Section */}
                <div className="w-full px-12 mt-3 flex-1">
                  <div className="border-b border-[#cec9ff] pb-3 flex flex-col">
                    <p className="text-xs font-['Outfit'] text-[#888787] uppercase tracking-wider  mb-2">
                      REVIEW
                    </p>
                    <textarea
                      placeholder="Describe your experience"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full h-20 px-0 py-2 font-['Outfit'] text-sm text-[#575757] placeholder:text-[#a7a7a7] focus:outline-none resize-none border-0"
                    />


                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex gap-3 mt-4">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-5 h-5 rounded-[6.92px] border-[0.77px] border-stone-700 cursor-pointer mt-0.5"
                    />
                    <label 
                      htmlFor="terms"
                      className="text-xs font-['Outfit'] text-[#575757] leading-relaxed cursor-pointer flex-1"
                    >
                      By checking here and submitting a review you are making a representation and warranty that you were actually a patient under the care of the named provider. Any submission made where that is not the case may result in possible adverse legal repercussions for you.
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              // Step 2: Identity Selection
              <div className="flex flex-col items-center">
                <h2 className="text-[22px] font-medium font-['Outfit'] text-[#191919] text-center mb-1">
                  Your Identity
                </h2>
                <p className="text-sm font-light font-['Outfit'] text-[#767676] mb-8">
                  Choose how you'd like to submit this review
                </p>

                {/* Identity Options */}
                <div className="flex gap-[30px]">
                  {/* Anonymous Option */}
                  <button
                    onClick={() => setIdentityChoice("anonymous")}
                    className={`relative w-[200px] h-[130px] rounded-xl border-2 transition-all ${
                      identityChoice === "anonymous" 
                        ? "border-[#7466f2] bg-[#f8f7ff]" 
                        : "border-[#dad6ff] hover:border-[#b9b1ff]"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <FaUserSecret className={`w-8 h-8 mb-2 ${
                        identityChoice === "anonymous" ? "text-[#7466f2]" : "text-gray-400"
                      }`} />
                      <h3 className="text-sm font-medium font-['Outfit'] text-[#424242] mb-1">
                        Stay Anonymous
                      </h3>
                      <p className="text-xs font-light font-['Outfit'] text-[#909090] px-3 text-center">
                        Submit without creating an account
                      </p>
                    </div>
                  </button>

                  {/* Create Account Option */}
                  <button
                    onClick={() => setIdentityChoice("account")}
                    className={`relative w-[200px] h-[130px] rounded-xl border-2 transition-all ${
                      identityChoice === "account" 
                        ? "border-[#7466f2] bg-[#f8f7ff]" 
                        : "border-[#dad6ff] hover:border-[#b9b1ff]"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <HiOutlineUser className={`w-8 h-8 mb-2 ${
                        identityChoice === "account" ? "text-[#7466f2]" : "text-gray-400"
                      }`} />
                      <h3 className="text-sm font-medium font-['Outfit'] text-[#424242] mb-1">
                        {user ? `Comment as ${user.displayName || user.email?.split('@')[0]}` : "Create Account"}
                      </h3>
                      <p className="text-xs font-light font-['Outfit'] text-[#909090] px-3 text-center">
                        {user ? "Your name will be visible" : "Track your reviews and added therapists"}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className={`flex gap-3 mt-6 justify-center`}>
            {currentStep === 2 && (
              <button
                onClick={() => setCurrentStep(1)}
                className="w-[140px] h-[45px] rounded-[15px] border-2 border-[#7466f2] text-[#7466f2] font-['Outfit'] font-medium text-base hover:bg-[#f8f7ff] transition-colors flex items-center justify-center gap-2"
              >
                <FaChevronLeft className="w-3 h-3" />
                Back
              </button>
            )}
            
            <button
              onClick={handleContinue}
              disabled={(
                currentStep === 1 && (rating === 0 || content.length < 10 || !termsAccepted)
              ) || isSubmitting}
              className={`flex-1 h-[45px] rounded-[15px] bg-[#7466f2] text-white font-['Outfit'] font-medium text-base transition-all ${
                (currentStep === 1 && (rating === 0 || content.length < 10 || !termsAccepted)) || isSubmitting
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-[#6153e0]'
              }`}
            >
              {currentStep === 1 ? "Continue" : (
                isSubmitting ? "Submitting..." : (
                  identityChoice === "account" && !user ? "Continue to Login" : "Submit Review"
                )
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}