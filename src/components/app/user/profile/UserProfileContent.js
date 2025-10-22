"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FaEdit,
  FaMapMarkerAlt,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";
import UserReviewsList from "../reviews/UserReviewsList";

export default function UserProfileContent({
  data = {},
  userReviews = [],
  savedTherapists = [],
}) {
  const [isEditMode, setIsEditMode] = useState(false);

  // Destructure with fallback values
  const {
    id,
    name = "User Name",
    email = "user@email.com",
    image = null,
    joinDate = "01/01/2024",
    reviewsCount = 0,
    location = "Location Not Available",
    bio = "Tell us about yourself...",
  } = data;

  return (
    <div className="min-h-screen pb-16 pt-8 mt-23 border-t border-amethyst-100">
      <div className="max-w-[1140px] mx-auto">
        <div className="flex gap-8 lg:gap-16 flex-wrap lg:flex-nowrap">
          {/* Left Column - User Info */}
          <div className="w-full lg:w-[370px] flex flex-col lg:sticky lg:top-24 lg:h-fit">
            {/* Profile Picture */}
            <div className="w-full max-w-[280px] aspect-square rounded-full bg-gray-300 overflow-hidden">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#eae7ff] flex items-center justify-center">
                  <span className="text-[220px] font-medium text-[#b6aeff] font-['Outfit'] tracking-[-2.20px]">
                    {name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* About Section */}
            <div className="mt-8 flex flex-col gap-6 w-full">
              {/* About Title */}
              <div className="flex items-center gap-2">
                <h3 className="text-lg text-[#585656] font-['poppins'] whitespace-nowrap">
                  About account
                </h3>
                <div className="flex-1 h-px bg-[#e0e5eb]"></div>
              </div>

              {/* Account Details */}
              <div className="flex flex-col gap-2.5 pl-2">
                <p className="text-[17px] text-[#535252] font-['Outfit']">
                  <span className="font-medium">My reviews:</span>
                  <span className="font-light"> {reviewsCount}</span>
                </p>
                <p className="text-[17px] text-[#535252] font-['Outfit']">
                  <span className="font-medium">Register Since:</span>
                  <span className="font-light"> {joinDate}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="w-full flex flex-col min-h-screen">
            {/* User Info */}
            <div className="w-full">
              <div className="flex justify-between items-start">
                {/* User Details */}
                <div className="w-full flex flex-col gap-4">
                  {/* Header Info */}
                  <div className="relative">
                    <div className="flex items-center gap-8">
                      <h1 className="text-2xl font-medium text-black font-['Outfit'] tracking-tight">
                        {name}
                      </h1>
                    </div>

                    {/* Email and Password */}
                    <div className="flex flex-col gap-1 mt-4">
                      <p className="text-base font-['poppins'] tracking-[-0.20px]">
                        <span className="font-medium text-[#7466f2]">
                          Email:{" "}
                        </span>
                        <span className="font-base text-gray-800 text-sm">
                          {email}
                        </span>
                      </p>
                      <p className="text-base font-['Outfit'] tracking-[-0.20px]">
                        <span className="font-medium text-[#7466f2]">
                          Password:{" "}
                        </span>
                        <span className="font-medium text-gray-800 text-sm">
                          **********
                        </span>
                      </p>
                    </div>
                  </div>

                    {/* Log Out Button */}
                  <div>
                    <Link 
                      href="/login"
                      className="inline-block px-6 py-1 bg-amethyst-500 rounded-full text-white text-base font-['Outfit'] hover:bg-[#6153e0] transition-colors"
                    >
                      Log Out
                    </Link>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="w-[35px] h-[35px] bg-[#cbc5ff] rounded-full flex items-center justify-center hover:bg-[#b6aeff] transition-colors"
                >
                  <FaEdit className="w-[15px] h-[15px] text-white" />
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12">
              <UserReviewsList
                reviews={userReviews}
                savedTherapists={savedTherapists}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
