"use client";

import React from "react";
import Link from "next/link";
import { FaStar, FaMapMarkerAlt, FaBookmark, FaChevronRight } from "react-icons/fa";

export default function TherapistCard({ dataTherapist = {} }) {
  // Destructure with fallbacks
  const {
    id,
    name = "Therapist Name",
    location = "Location Not Available",
    image = null,
    rating = 0,
    reviews = 0,
    credentials = [],
    specialty = "General Therapist",
    priceRange = "Price not available",
    availableOnline = false,
    languages = ["English"],
    insurance = [],
    bio = "Bio not available",
    isSaved = false,
    onSaveToggle,
    onReadReviews
  } = dataTherapist;

  const ratingPercentage = (rating / 5) * 100;

  return (
    <Link href={`/therapist-profile?id=${id}`} className="block">
      <div className="bg-white border border-amethyst-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-amethyst-200 rounded-full overflow-hidden flex items-center justify-center">
            {image ? (
              <img 
                src={image} 
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-medium text-amethyst-600 font-outfit">
                {name.charAt(0)}
              </span>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 font-outfit">
                {name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <FaMapMarkerAlt className="text-gray-500 text-sm flex-shrink-0" />
                <span className="text-sm text-gray-600 font-poppins">
                  {location}
                </span>
              </div>
            </div>

            {/* Rating and Save */}
            <div className="flex items-center gap-4">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${ratingPercentage}%` }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400 text-sm" />
                  <span className="text-sm font-medium text-gray-700 font-outfit">
                    {rating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={() => onSaveToggle && onSaveToggle(!isSaved)}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <FaBookmark 
                  className={`text-base ${isSaved ? 'text-amethyst-500' : 'text-gray-400'}`} 
                />
              </button>
            </div>
          </div>

          {/* Specialty */}
          <div className="mb-3">
            <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md font-outfit">
              {specialty}
            </span>
          </div>

          {/* Bottom Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-amethyst-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-white font-poppins">
                  {reviews}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 font-outfit">
                Ratings received
              </span>
            </div>

            {/* Read Reviews Button */}
            <button 
              onClick={() => onReadReviews && onReadReviews(id)}
              className="flex items-center gap-1 text-amethyst-500 hover:text-amethyst-600 transition-colors font-outfit text-sm font-medium"
            >
              Read Reviews
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
}