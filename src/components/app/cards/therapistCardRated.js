"use client";

import React from "react";
import { FaStar, FaThumbsUp, FaChevronRight, FaEllipsisV } from "react-icons/fa";

export default function TherapistCardRated({
  therapistName = "Benjamin Young",
  therapistImage,
  reviewDate = "April 1, 2025",
  reviewText = "I felt truly heard from the very first session. The therapist's approach was empathetic yet challenging, which helped me make important....",
  rating = 4.5,
  reviewType = "Public Review",
  reviewStatus = "Pending",
  onViewReview,
  onMenuClick,
  showMenu = true
}) {
  const ratingPercentage = (rating / 5) * 100;

  return (
    <div className="relative w-full max-w-[1050px] h-[168px]">
      <div className="absolute top-2.5 left-0 right-0 h-[158px] flex flex-col gap-3 border-b border-solid border-[#cacaca] px-4">
        {/* Header Section */}
        <div className="flex justify-between items-start h-14">
          {/* Therapist Info */}
          <div className="flex items-center gap-3">
            {/* Profile Picture */}
            <div className="w-[53px] h-[53px] bg-[#b9b1ff] rounded-full overflow-hidden">
              {therapistImage ? (
                <img 
                  src={therapistImage} 
                  alt={therapistName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-[#b9b1ff] to-[#9d93ff] flex items-center justify-center">
                  <span className="text-xl font-medium text-white font-['Outfit']">
                    {therapistName.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            
            {/* Therapist Name */}
            <h3 className="text-[28px] font-normal text-black font-['Outfit'] tracking-[-0.28px]">
              {therapistName}
            </h3>
          </div>

          {/* Date and Menu */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-light text-[#888787] font-['Outfit']">
              {reviewDate}
            </span>
            {showMenu && (
              <button 
                onClick={onMenuClick}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <FaEllipsisV className="text-[#888787] text-sm" />
              </button>
            )}
          </div>
        </div>

        {/* Rating and Status */}
        <div className="flex items-center gap-4 ml-[63px]">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="w-[77px] h-[6.5px] bg-[#d9d9d9] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#ffc926] rounded-full transition-all duration-300"
                style={{ width: `${ratingPercentage}%` }}
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10.5px] font-medium text-[#ffc107] font-['Outfit']">
                {rating}
              </span>
              <FaStar className="text-[#ffc107] text-xs" />
            </div>
          </div>

          {/* Status Badge */}
          <div className="px-2.5 py-px h-5 rounded-[20px] border border-solid border-[#d1c7ff] flex items-center">
            <span className="text-xs font-light text-[#796bf5] font-['Outfit']">
              {reviewStatus}
            </span>
          </div>
        </div>

        {/* Review Content */}
        <div className="flex flex-col gap-3">
          {/* Review Text */}
          <p className="text-base font-light text-[#767676] font-['Outfit'] tracking-[0.16px] line-clamp-3 max-w-[720px]">
            {reviewText}
          </p>

          {/* Review Actions */}
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <button className="w-[22px] h-[22px] bg-[#c3bcff] rounded-[11px] flex items-center justify-center hover:bg-[#b6aeff] transition-colors">
              <FaThumbsUp className="text-white text-xs" />
            </button>

            {/* Review Type */}
            <span className="text-[13.5px] font-semibold text-[#191919] font-['Outfit']">
              {reviewType}
            </span>

            <span className="text-sm font-bold text-[#191919]"></span>

            {/* View Review Button */}
            <button 
              onClick={onViewReview}
              className="flex items-center gap-1 hover:opacity-75 transition-opacity"
            >
              <span className="text-[13.7px] text-[#796bf5] font-['Outfit']">
                View Review
              </span>
              <FaChevronRight className="text-[#796bf5] text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}