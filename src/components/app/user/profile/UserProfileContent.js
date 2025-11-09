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
    <div className="min-h-screen pb-16 md:pb-12 lg:pb-16 pt-20 md:pt-28 ">
      <div className="max-w-[1140px] mx-auto px-6 md:px-6 lg:px-8 mt-6 md:mt-0">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-16">
          {/* Left Column - User Info */}
          <div className="w-full lg:w-[370px] flex flex-col items-center lg:items-start lg:sticky lg:top-24 lg:h-fit">
            {/* Profile Picture */}
            <div className="w-[200px] md:w-[240px] lg:w-full lg:max-w-[280px] aspect-square rounded-full bg-gray-300 overflow-hidden">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#eae7ff] flex items-center justify-center">
                  <span className="text-[120px] md:text-[160px] lg:text-[220px] font-medium text-[#b6aeff] font-['Outfit'] tracking-[-2.20px]">
                    {name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="md:hidden block w-full mt-2">
              <div className="flex  flex-col items-center justify-center">
                {/* Header Info */}
                <div className="flex flex-col items-center gap-2 ">
                  <div className="relative flex justify-center w-fit max-w-[78vw]">
                    <h1 className="text-2xl font-medium text-font font-['Outfit'] text-center ">
                      {name}
                    </h1>
                    {/* Edit Button */}
                    <button
                      className="w-6 h-6  bg-amethyst-200 rounded-full flex items-center justify-center hover:bg-amethyst-300 transition-colors flex-shrink-0 absolute left-[104%] top-1"
                      onClick={() => setIsEditMode(!isEditMode)}
                    >
                      <FaEdit className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </div>

                {/* Email and Password */}
                <div className="flex flex-col gap-1 mt-3 md:mt-4">
                  <div className="text-base  font-['poppins'] tracking-[-0.20px]">
                    <span className="font-medium text-[#7466f2]">Email: </span>
                    <span className="font-base text-gray-800 text-sm  break-all">
                      {email}
                    </span>
                  </div>
                  <div className="text-base  font-['Outfit'] tracking-[-0.20px]">
                    <span className="font-medium text-[#7466f2]">
                      Password:{" "}
                    </span>
                    <span className="font-medium text-gray-800 text-sm">
                      **********
                    </span>
                  </div>
                </div>

                {/* Log Out Button - Desktop Position */}
                <div className=":block mt-3">
                  <Link
                    href="/login"
                    className="inline-block px-6 py-1 bg-amethyst-500 rounded-full text-white text-base font-['Outfit'] hover:bg-[#6153e0] transition-colors"
                  >
                    Log Out
                  </Link>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mt-6 md:mt-8 flex flex-col gap-4 md:gap-6 w-full md:max-w-[280px] lg:max-w-full">
              {/* About Title */}
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg text-[#585656] font-['poppins'] whitespace-nowrap">
                  About account
                </h3>
                <div className="flex-1 h-px bg-[#e0e5eb]"></div>
              </div>

              {/* Account Details */}
              <div className="flex flex-col gap-2 md:gap-2.5 md:pl-2">
                <p className="text-[15px] md:text-[17px] text-[#535252] font-['Outfit']">
                  <span className="font-medium">My reviews:</span>
                  <span className="font-light"> {reviewsCount}</span>
                </p>
                <p className="text-[15px] md:text-[17px] text-[#535252] font-['Outfit']">
                  <span className="font-medium">Register Since:</span>
                  <span className="font-light"> {joinDate}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="w-full flex flex-col">
            {/* User Info */}
            <div className="hidden md:block w-full">
              <div className="flex justify-between items-start gap-4">
                {/* User Details */}
                <div className="w-full flex flex-col gap-3 md:gap-4">
                  {/* Header Info */}
                  <div className="relative">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                      <h1 className="text-xl sm:text-2xl font-medium text-black font-['Outfit'] tracking-tight">
                        {name}
                      </h1>

                      {/* Log Out Button - Mobile Position */}
                      <div className="sm:hidden">
                        <Link
                          href="/login"
                          className="inline-block px-4 py-1 bg-amethyst-500 rounded-full text-white text-sm font-['Outfit'] hover:bg-[#6153e0] transition-colors"
                        >
                          Log Out
                        </Link>
                      </div>
                    </div>

                    {/* Email and Password */}
                    <div className="flex flex-col gap-1 mt-3 md:mt-4">
                      <div className="text-sm sm:text-base font-['poppins'] tracking-[-0.20px]">
                        <span className="font-medium text-[#7466f2]">
                          Email:{" "}
                        </span>
                        <span className="font-base text-gray-800 text-xs sm:text-sm break-all">
                          {email}
                        </span>
                      </div>
                      <div className="text-sm sm:text-base font-['Outfit'] tracking-[-0.20px]">
                        <span className="font-medium text-[#7466f2]">
                          Password:{" "}
                        </span>
                        <span className="font-medium text-gray-800 text-xs sm:text-sm">
                          **********
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Log Out Button - Desktop Position */}
                  <div className="hidden sm:block">
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
                  className="w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] bg-[#cbc5ff] rounded-full flex items-center justify-center hover:bg-[#b6aeff] transition-colors flex-shrink-0"
                >
                  <FaEdit className="w-[13px] h-[13px] sm:w-[15px] sm:h-[15px] text-white" />
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-2 md:mt-10 lg:mt-12">
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
