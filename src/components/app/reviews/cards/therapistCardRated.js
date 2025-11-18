"use client";

import React from "react";
import { FaStar, FaChevronRight, FaEllipsisV } from "react-icons/fa";
import UserReviewContent from "./components/userReviewContent";
import Image from "next/image";
import { ReactionBar } from "@/components/company/home/components/reactionBar";

export default function TherapistCardRated({
  comment,
  therapistName,
  therapistImage,
  onViewReview,
  onMenuClick,
  onReaction,
  showMenu = true,
}) {
  const {
    id,
    userName,
    userAvatar,
    isAnonymous,
    rating,
    content,
    date,
    reactions,
    userReaction,
  } = comment;

  const displayName = isAnonymous ? "Anonymous User" : userName;
  const ratingPercentage = (rating / 5) * 100;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formatShortDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short", // cambia 'long' → 'short'
    day: "numeric",
  });

  return (
    <div className=" w-full max-w-[1050px]">
      <div className=" top-2.5 left-0 right-0 flex flex-col gap-3 border-b border-solid border-amethyst-100 px-4 pb-4">
        {/* Header Section */}
        <div className="flex justify-between items-start h-14">
          {/* User Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* User Avatar */}
            <div className="w-[53px] h-[53px] bg-[#b9b1ff] rounded-full overflow-hidden flex-shrink-0">
              {isAnonymous ? (
                <div className="w-full h-full bg-amethyst-50 flex items-center justify-center">
                  <Image
                    src="/assets/icons-svg/others/anonymous.svg"
                    alt="Anonymous"
                    width={30}
                    height={30}
                    className="text-amethyst-300"
                  />
                </div>
              ) : userAvatar ? (
                <img
                  src={userAvatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-[#b9b1ff] to-[#9d93ff] flex items-center justify-center">
                  <span className="text-xl font-medium text-white font-['Outfit']">
                    {displayName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              {/* User Name */}
              <h3 className="text-lg md:text-xl font-normal text-stone-800 font-['Outfit'] tracking-[-0.28px] truncate">
                {displayName}
              </h3>

              {/* Rating and Status */}
              <div className="flex items-center gap-4">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="w-[77px] h-[6.5px] bg-[#d9d9d9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#ffc926] rounded-full transition-all duration-300"
                      style={{ width: `${ratingPercentage}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-[#ffc107] text-xs" />
                    <p className="text-base font-medium text-[#ffc107] font-['Outfit']">
                      {rating}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date and Menu */}
          <div className="flex items-center gap-1 md:gap-2 mt-1.5 flex-shrink-0">
            <span className="hidden md:block text-sm font-light text-[#888787] font-['Outfit']">
              {formattedDate}
            </span>
            <span className="md:hidden block text-xs font-light text-[#888787] font-['Outfit']">
              {formatShortDate}
            </span>

           
          </div>
        </div>

        {/* Review Content */}
        <div className="flex flex-col gap-3">
          {/* Review Text */}
          <UserReviewContent content={content} />

          {/* Review Actions - Reaction Bar */}
            <ReactionBar
              commentId={id}
              reactions={reactions}
              userReaction={userReaction}
              onReaction={onReaction}
              disabled={false}
              useInCard={true}
            />
          </div>
      </div>
    </div>
  );
}
