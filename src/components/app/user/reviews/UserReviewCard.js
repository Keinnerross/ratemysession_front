"use client";

import React, { useState } from "react";
import { FaChevronRight, FaStar, FaEllipsisH } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/global/modals/ConfirmationModal";

export default function UserReviewCard({ review, onVisibilityChange, onDelete }) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    therapistId,
    therapistName,
    therapistImage,
    content,
    date,
    isAnonymous,
    rating,
    status = "completed", // pending or completed
  } = review;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format short date for mobile
  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Truncate content
  const truncateContent = (text, maxLength = 150) => {
    // Handle if text is an object with rendered property (WordPress format)
    const textContent = typeof text === 'object' && text?.rendered
      ? text.rendered.replace(/<[^>]*>/g, '').trim() // Strip HTML tags
      : String(text || '');

    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength) + "...";
  };

  // Handle visibility change
  const handleVisibilityConfirm = async () => {
    setIsProcessing(true);
    try {
      await onVisibilityChange(review.id, isAnonymous);
      setShowVisibilityModal(false);
    } catch (error) {
      console.error('Error changing visibility:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    setIsProcessing(true);
    try {
      await onDelete(review.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle view review - navigate to therapist profile
  const handleViewReview = () => {
    if (therapistId) {
      router.push(`/therapist-profile?id=${therapistId}`);
    }
  };

  // Handle click outside to close menu
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest(".menu-container")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  return (
    <div className="w-full flex flex-col gap-3 md:gap-4 lg:gap-5 border-b border-amethyst-100 pb-4 md:pb-6 lg:pb-7">
      {/* Header */}
      <div className="w-full flex justify-between items-start">
        {/* Therapist Info */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] md:w-[53px] md:h-[53px] rounded-full overflow-hidden bg-[#b9b1ff] flex-shrink-0">
            {therapistImage ? (
              <img
                src={therapistImage}
                alt={therapistName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-base sm:text-lg md:text-xl font-medium text-white font-['Outfit']">
                  {therapistName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Name and Rating */}
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl md:text-2xl font-normal text-gray-800 font-['Outfit'] tracking-[-0.28px] leading-tight truncate">
              {therapistName}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-0.5 md:mt-1 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="relative h-[15px] w-[65px] sm:w-[77px]">
                  {/* Background bar */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[5.5px] sm:h-[6.6px] bg-[#d9d9d9] rounded-full"></div>

                  {/* Filled bar */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 left-0 h-[6px] sm:h-[7px] bg-[#ffc926] rounded-full"
                    style={{ width: `${(rating / 5) * 100}%` }}
                  ></div>
                </div>

                {/* Rating number and star */}
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <span className="text-[9px] sm:text-[10.5px] font-medium text-[#ffc107] font-['Outfit'] tracking-[-0.10px]">
                    {rating.toFixed(1)}
                  </span>
                  <FaStar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#ffc107]" />
                </div>
              </div>

              <div
                className={`inline-flex h-4 sm:h-5 px-2 sm:px-2.5 py-px rounded-[20px] border items-center justify-center ${
                  status === "pending"
                    ? "border-[#7466f2] text-[#7466f2]"
                    : "border-green-500 text-green-500"
                }`}
              >
                <span className="text-[10px] sm:text-xs font-light font-['Outfit'] tracking-[-0.12px] whitespace-nowrap">
                  {status === "pending" ? "Pending" : "Completed"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Date and Menu */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="hidden lg:block text-sm font-light text-[#888787] font-['Outfit']">
              {formatDate(date)}
            </span>
            <span className="lg:hidden block text-[11px] sm:text-xs font-light text-[#888787] font-['Outfit']">
              {formatShortDate(date)}
            </span>
            <FaChevronRight className="hidden sm:block w-[4px] h-2 text-[#888787]" />
          </div>

          {/* Dropdown Menu */}
          <div className="relative menu-container">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <FaEllipsisH className="text-gray-500 text-sm sm:text-base" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 sm:top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[130px] sm:min-w-[145px] text-[12px] sm:text-[13px]">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowVisibilityModal(true);
                  }}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-left text-gray-700 hover:bg-gray-50 font-['poppins']"
                >
                  Change Visibility
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteModal(true);
                  }}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-left text-gray-700 hover:bg-gray-50 font-['poppins']"
                >
                  Delete Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full flex flex-col gap-2 sm:gap-2.5 md:gap-3">
        {/* Review Text */}
        <p className="text-[12px] sm:text-[13px] md:text-[13.5px] font-base text-gray-600 font-['poppins'] tracking-[0.16px] leading-5 sm:leading-6 px-0 sm:px-0">
          {truncateContent(content)}
        </p>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
          {/* Privacy Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] bg-[#c3bcff] rounded-full flex items-center justify-center p-0.5 sm:p-1">
              <Image
                src={
                  isAnonymous
                    ? "/assets/icons-svg/others/anonymous- light.svg"
                    : "/assets/icons-svg/others/world.svg"
                }
                alt={isAnonymous ? "Anonymous" : "Public"}
                width={14}
                height={14}
                className="filter brightness-0 invert w-3 h-3 sm:w-[14px] sm:h-[14px]"
              />
            </div>
            <span className="text-[12px] sm:text-[13.5px] font-semibold text-[#191919] font-['Outfit'] whitespace-nowrap">
              {isAnonymous ? "Anonymous Review" : "Public Review"}
            </span>
          </div>

          {/* Separator */}
          <span className="hidden sm:block text-sm font-bold text-[#191919]">–</span>

          {/* View Button */}
          <button
            onClick={handleViewReview}
            className="flex items-center gap-1.5 sm:gap-2 group"
          >
            <span className="text-[12px] sm:text-[13.7px] font-normal text-[#796bf5] font-['Outfit'] group-hover:text-[#6153e0] transition-colors">
              View Review
            </span>
            <FaChevronRight className="w-[5px] sm:w-[6px] h-2 sm:h-2.5 text-[#796bf5] group-hover:text-[#6153e0] transition-colors" />
          </button>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showVisibilityModal}
        onClose={() => setShowVisibilityModal(false)}
        onConfirm={handleVisibilityConfirm}
        title="Change Visibility"
        message={`Are you sure you want to change this review to ${isAnonymous ? 'public' : 'anonymous'}?`}
        confirmText="Yes"
        cancelText="No"
        isLoading={isProcessing}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Review"
        message="Are you sure you want to delete this review?"
        confirmText="Yes"
        cancelText="No"
        isLoading={isProcessing}
      />
    </div>
  );
}