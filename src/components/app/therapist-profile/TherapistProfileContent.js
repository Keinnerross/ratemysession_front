"use client";

import React from "react";
import { FaMapMarkerAlt, FaGlobe, FaStar, FaRegStar } from "react-icons/fa";
import RatingStatisticsChart from "./RatingStatisticsChart";

export default function TherapistProfileContent({ data = {} }) {
  // Destructure with fallback values
  const {
    id,
    name = "Therapist Name",
    slug = "",
    image = null,
    credentials = [],
    rating = 0,
    reviews = 0,
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

  return (
    <div className="min-h-screen py-12 mt-23 border-t border-amethyst-100">
      <div className="max-w-[1140px] mx-auto">
        <div className="flex gap-8 lg:gap-24 flex-wrap lg:flex-nowrap">
          {/* Left Column - Therapist Info */}
          <div className="w-full lg:w-72 flex flex-col">
            {/* Profile Picture */}
            <div className="w-full max-w-[280px] aspect-square rounded-full bg-gray-300 overflow-hidden">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-400 flex items-center justify-center">
                  <span className="text-6xl font-semibold text-gray-500 font-outfit">
                    {name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* About Section */}
            <div className="mt-8 flex flex-col gap-6 w-full">
              {/* About Title */}
              <div className="flex items-center gap-2">
                <h3 className="text-lg text-[#585656] font-['Outfit'] whitespace-nowrap">
                  About
                </h3>
                <div className="flex-1 h-px bg-[#e0e5eb]"></div>
              </div>

              {/* Contact Information */}
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-[#585656] mt-1 flex-shrink-0" />
                  <p className="text-base font-light text-[#585656] font-['Outfit']">
                    {address}
                  </p>
                </div>
                {website && (
                  <div className="flex items-center gap-3">
                    <FaGlobe className="text-[#585656]" />
                    <p className="text-base font-light text-[#585656] font-['Outfit']">
                      {website}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Credentials Section */}
            {credentials.length > 0 && (
              <div className="mt-8 flex flex-col gap-2">
                {/* Credentials Title */}
                <div className="flex items-center gap-2">
                  <h3 className="text-lg text-[#585656] font-['Outfit'] whitespace-nowrap">
                    Credentials
                  </h3>
                  <div className="flex-1 h-px bg-[#e0e5eb]"></div>
                </div>

                {/* Credential Details */}
                <div className="text-sm font-light text-[#585656] font-['Outfit'] leading-normal">
                  {credentials.map((credential, index) => (
                    <p key={index}>{credential}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Insurance Section */}
            {insurance.length > 0 && (
              <div className="mt-8 flex flex-col gap-2">
                {/* Insurance Title */}
                <div className="flex items-center gap-2">
                  <h3 className="text-lg text-[#585656] font-['Outfit'] whitespace-nowrap">
                    Insurance
                  </h3>
                  <div className="flex-1 h-px bg-[#e0e5eb]"></div>
                </div>

                {/* Insurance List */}
                <div className="text-sm font-light text-[#585656] font-['Outfit'] leading-normal">
                  {insurance.map((ins, index) => (
                    <p key={index}>{ins}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Main Content */}
          <div className="w-full flex flex-col gap-12">
            {/* Therapist Info */}
            <div className="w-full flex justify-between">
              {/* Therapist Details */}
              <div className="w-full flex flex-col gap-6">
                {/* Header Info */}
                <div className="relative">
                  <div className="flex items-center gap-8">
                    <h1 className="text-3xl font-medium text-black font-['Outfit'] tracking-tight">
                      {name}
                    </h1>
                    <div>
                      <div className=" px-5 py-1 bg-[#f3f1ff] rounded-full flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#7466f2] text-sm" />
                        <span className="text-base text-[#7466f2] font-['Outfit']">
                          {location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xl font-medium text-[#7466f2] font-['Outfit']">
                    {specialty}
                  </p>
                  {/* Location Badge */}

                  {/* Rating Section */}
                  <div className="mt-5">
                    <p className="text-sm font-medium text-[#767676] font-['Outfit'] tracking-wide uppercase">
                      RATING
                    </p>

                    <div className="flex items-center gap-6 mt-1">
                      <span className="text-xl font-semibold text-stone-800 font-['Outfit']">
                        {rating.toFixed(1)} / 5
                      </span>

                      {/* Stars */}
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star} className="w-6 h-6">
                            {star <= fullStars ? (
                              <FaStar className="text-yellow-400 w-full h-full" />
                            ) : (
                              <FaRegStar className="text-gray-300 w-full h-full" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  {/* Rate Therapist Button */}
                  <button className="px-8 py-2 bg-[#7466f2] rounded-full text-white text-base font-['Outfit'] hover:bg-[#6153e0] transition-colors">
                    Rate Therapist
                  </button>
                </div>
              </div>

              {/* Statistics Chart */}
              <div className="w-full max-w-lg h-64 sm:h-72 md:h-80">
                <RatingStatisticsChart
                  rating={rating}
                  distribution={{
                    5: Math.floor(reviews * 0.6),
                    4: Math.floor(reviews * 0.25),
                    3: Math.floor(reviews * 0.1),
                    2: Math.floor(reviews * 0.03),
                    1: Math.floor(reviews * 0.02),
                  }}
                />
              </div>
            </div>

            {/* Reviews Section */}

            <div>
              <div className="w-full border-b border-amethyst-100">
                <h2 className="text-2xl font-medium">Reviews </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
