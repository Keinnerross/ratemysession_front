"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaStar,
  FaMapMarkerAlt,
  FaChevronRight,
} from "react-icons/fa";
import NotificationToast from "@/components/global/notifications/NotificationToast";

export default function TherapistCard({ dataTherapist = {} }) {
  const [isLocalSaved, setIsLocalSaved] = useState(dataTherapist.isSaved || false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
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
    onReadReviews,
  } = dataTherapist;

  const ratingPercentage = (rating / 5) * 100;

  return (
    <>
      <Link href={`/therapist-profile?id=${id}`} className="block">
        <div className="bg-white border border-amethyst-100 rounded-xl p-6 cursor-default">
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
              <div className="flex items-start gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-outfit">
                    {name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <FaMapMarkerAlt className="text-gray-400 text-sm flex-shrink-0" />
                    <span className="text-xs text-gray-500 font-poppins font-medium">
                      {location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
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
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                {/* Save Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newSavedState = !isLocalSaved;
                    setIsLocalSaved(newSavedState);
                    setNotificationMessage(
                      newSavedState 
                        ? `${name} has been saved to your profile` 
                        : `${name} has been removed from your saved therapists`
                    );
                    setShowNotification(true);
                    onSaveToggle && onSaveToggle(newSavedState);
                  }}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Image
                    src="/assets/icons-svg/others/saved.svg"
                    alt="Save"
                    width={16}
                    height={16}
                    className={`transition-all ${
                      isLocalSaved 
                        ? "filter-none" 
                        : "filter grayscale opacity-50"
                    }`}
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
          </div>
        </div>
        {/* Bottom Row */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amethyst-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-white font-poppins">
                {reviews}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700 font-outfit">
              Ratings received
            </span>
          </div>

          <span>-</span>

          {/* Read Reviews Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Allow the Link to handle navigation
            }}
            className="flex items-center gap-1 text-amethyst-500 hover:text-amethyst-600 transition-colors font-outfit text-sm font-medium"
          >
            Read Reviews
            <FaChevronRight className="text-xs" />
          </button>
        </div>
        </div>
      </Link>
      
      {/* Notification Toast */}
      <NotificationToast 
        message={notificationMessage}
        subtitle=""
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
        type="success"
      />
    </>
  );
}
