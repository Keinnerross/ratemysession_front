"use client";

import React, { useState } from "react";
import { FaChevronRight, FaStar, FaEllipsisH } from "react-icons/fa";
import Image from "next/image";

export default function UserReviewCard({ review, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const {
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

  // Truncate content
  const truncateContent = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  // Handle click outside to close menu
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest(".relative")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  return (
    <div className="w-full flex flex-col gap-5 border-b border-amethyst-100 pb-7">
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        {/* Therapist Info */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-[53px] h-[53px] rounded-full overflow-hidden bg-[#b9b1ff]">
            {therapistImage ? (
              <img
                src={therapistImage}
                alt={therapistName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xl font-medium text-white font-['Outfit']">
                  {therapistName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Name and Rating */}
          <div>
            <h3 className="text-2xl font-normal text-gray-800 font-['Outfit'] tracking-[-0.28px] leading-9">
              {therapistName}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-1">
              <div className="relative h-[15px] w-[77px]">
                {/* Background bar */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[6.6px] bg-[#d9d9d9] rounded-full"></div>

                {/* Filled bar */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 left-0 h-[7px] bg-[#ffc926] rounded-full"
                  style={{ width: `${(rating / 5) * 100}%` }}
                ></div>
              </div>

              {/* Rating number and star */}
              <div className="flex items-center gap-1">
                <span className="text-[10.5px] font-medium text-[#ffc107] font-['Outfit'] tracking-[-0.10px]">
                  {rating.toFixed(1)}
                </span>
                <FaStar className="w-3 h-3 text-[#ffc107]" />
              </div>

              <div
                className={`inline-flex h-5 px-2.5 py-px rounded-[20px] border items-center justify-center ${
                  status === "pending"
                    ? "border-[#7466f2] text-[#7466f2]"
                    : "border-green-500 text-green-500"
                }`}
              >
                <span className="text-xs font-light font-['Outfit'] tracking-[-0.12px] whitespace-nowrap">
                  {status === "pending" ? "Pending" : "Completed"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Date and Menu */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-light text-[#888787] font-['Outfit']">
              {formatDate(date)}
            </span>
            <FaChevronRight className="w-[4px] h-2 text-[#888787]" />
          </div>

          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <FaEllipsisH className="text-gray-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[145px] text-[13px]">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete && onDelete(review.id);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 font-['poppins']"
                >
                  Change Visibility
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit && onEdit(review.id);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 font-['poppins']"
                >
                  Edit Review
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete && onDelete(review.id);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 font-['poppins']"
                >
                  Delete Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full  flex flex-col gap-3">
        {/* Review Text */}
        <p className="text-[13.5px] font-base text-gray-600 font-['poppins'] tracking-[0.16px] leading-6">
          {truncateContent(content)}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-6">
          {/* Privacy Badge */}
          <div className="flex items-center gap-2">
            <div className="w-[22px] h-[22px] bg-[#c3bcff] rounded-[11px] flex items-center justify-center p-1">
              <Image
                src={
                  isAnonymous
                    ? "/assets/icons-svg/others/anonymous- light.svg"
                    : "/assets/icons-svg/others/world.svg"
                }
                alt={isAnonymous ? "Anonymous" : "Public"}
                width={14}
                height={14}
                className="filter brightness-0 invert"
              />
            </div>
            <span className="text-[13.5px] font-semibold text-[#191919] font-['Outfit'] whitespace-nowrap">
              {isAnonymous ? "Anonymous Review" : "Public Review"}
            </span>
          </div>

          {/* Separator */}
          <span className="text-sm font-bold text-[#191919]">–</span>

          {/* View Button */}
          <button className="flex items-center gap-2 group">
            <span className="text-[13.7px] font-normal text-[#796bf5] font-['Outfit'] group-hover:text-[#6153e0] transition-colors">
              View Review
            </span>
            <FaChevronRight className="w-[6px] h-2.5 text-[#796bf5] group-hover:text-[#6153e0] transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
