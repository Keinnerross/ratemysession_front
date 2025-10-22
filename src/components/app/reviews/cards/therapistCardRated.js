"use client";

import React from "react";
import { FaStar, FaChevronRight, FaEllipsisV } from "react-icons/fa";
import { AiFillBulb, AiFillHeart } from "react-icons/ai";
import { FaPray } from "react-icons/fa";
import { HiEmojiSad } from "react-icons/hi";
import Image from "next/image";

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

  const reactionButtons = [
    { key: "useful", icon: AiFillBulb, color: "#F59E0B", label: "Useful" },
    { key: "loved", icon: AiFillHeart, color: "#EF4444", label: "Loved" },
    { key: "thankful", icon: FaPray, color: "#8B5CF6", label: "Thankful" },
    { key: "ohNo", icon: HiEmojiSad, color: "#3B82F6", label: "Oh no!" },
  ];

  return (
    <div className=" w-full max-w-[1050px]">
      <div className=" top-2.5 left-0 right-0 flex flex-col gap-3 border-b border-solid border-amethyst-100 px-4 pb-4">
        {/* Header Section */}
        <div className="flex justify-between items-start h-14">
          {/* User Info */}
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <div className="w-[53px] h-[53px] bg-[#b9b1ff] rounded-full overflow-hidden">
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

            <div>
              {/* User Name */}
              <h3 className="text-xl font-normal text-stone-800 font-['Outfit'] tracking-[-0.28px]">
                {displayName}
              </h3>

              {/* Rating and Status */}
              <div className="flex items-center gap-4 ">
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
          <div className="flex items-center gap-2">
            <span className="text-sm font-light text-[#888787] font-['Outfit']">
              {formattedDate}
            </span>
            {showMenu && (
              <button
                onClick={onMenuClick}
                className="p-1 hover:bg-stone-100 rounded transition-colors"
              >
                <FaEllipsisV className="text-[#888787] text-sm" />
              </button>
            )}
          </div>
        </div>

        {/* Review Content */}
        <div className="flex flex-col gap-3">
          {/* Review Text */}
          <p className="text-[13.5px] font-base text-stone-600 font-['poppins'] tracking-[0.16px] max-w-[720px] leading-6">
            {content}
          </p>

          {/* Review Actions */}
          <div className="flex items-center gap-2">
            {/* Reaction Buttons */}
            {reactionButtons.map(({ key, icon: Icon, color, label }) => {
              const count = reactions[key];
              const isActive = userReaction === key;

              return (
                <button
                  key={key}
                  onClick={() => onReaction(id, key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all ${
                    isActive ? "bg-stone-100" : "hover:bg-stone-50"
                  }`}
                  title={label}
                >
                  <Icon
                    className="text-lg"
                    style={{ color: isActive ? color : "#9CA3AF" }}
                  />
                  {count > 0 && (
                    <span
                      className={`text-xs font-medium ${
                        isActive ? "text-stone-900" : "text-stone-600"
                      } font-['Outfit']`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
