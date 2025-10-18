"use client";

import React from "react";
import { FaStar, FaMapMarkerAlt, FaBookmark, FaChevronRight } from "react-icons/fa";

export default function TherapistCard({
  therapistName = "Aaron Rodwin",
  location = "New York 10001",
  profileImage,
  rating = 4.5,
  totalRatings = 17,
  credentials = ["LCSW"],
  specializations = ["Clinical Supervisor"],
  onSaveToggle,
  onReadReviews,
  isSaved = false
}) {
  const ratingPercentage = (rating / 5) * 100;

  return (
    <div className="bg-white border border-solid border-[#e5e2ff] w-full min-w-[992px] min-h-[185px] relative">
      {/* Profile Image */}
      <div className="absolute top-[23px] left-[23px] w-[88px] h-[88px] flex bg-[#d1c7ff] rounded-[44px] overflow-hidden">
        {profileImage ? (
          <img 
            src={profileImage} 
            alt={therapistName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#d1c7ff] to-[#b6aeff] flex items-center justify-center">
            <span className="text-3xl font-medium text-white font-['Outfit']">
              {therapistName.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Therapist Name */}
      <div className="absolute top-[21px] left-[121px]">
        <h3 className="text-[16.9px] font-bold text-black font-['Outfit'] tracking-[0]">
          {therapistName}
        </h3>
      </div>

      {/* Location */}
      <div className="absolute top-[51px] left-[119px] flex items-center gap-[6px]">
        <FaMapMarkerAlt className="text-[#707070] text-sm" />
        <span className="text-[13.8px] text-[#707070] font-['Arial']">
          {location}
        </span>
      </div>

      {/* Rating */}
      <div className="absolute top-[26px] right-[80px] flex items-center gap-2">
        {/* Rating Bar */}
        <div className="w-[77px] h-[6.5px] bg-[#d9d9d9] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#ffc107] rounded-full transition-all duration-300"
            style={{ width: `${ratingPercentage}%` }}
          />
        </div>
        {/* Rating Number */}
        <div className="flex items-center gap-1">
          <FaStar className="text-[#ffc107] text-sm" />
          <span className="text-[12.6px] font-medium text-[#707070] font-['Outfit']">
            {rating}
          </span>
        </div>
      </div>

      {/* Credentials and Specializations */}
      <div className="absolute top-[85px] left-[121px] flex gap-[9px] flex-wrap">
        {credentials.map((credential, index) => (
          <div 
            key={`credential-${index}`}
            className="px-4 h-8 flex items-center justify-center bg-white rounded-lg border border-solid border-[#d1c7ff] shadow-[0px_1px_4px_rgba(0,0,0,0.05)]"
          >
            <span className="text-[12.5px] font-semibold text-[#191919] font-['Outfit']">
              {credential}
            </span>
          </div>
        ))}
        {specializations.map((specialization, index) => (
          <div 
            key={`specialization-${index}`}
            className="px-4 h-8 flex items-center justify-center bg-white rounded-lg border border-solid border-[#d1c7ff] shadow-[0px_1px_4px_rgba(0,0,0,0.05)]"
          >
            <span className="text-[12.5px] font-semibold text-[#191919] font-['Outfit']">
              {specialization}
            </span>
          </div>
        ))}
      </div>

      {/* Ratings Info and Reviews */}
      <div className="absolute top-[134px] left-6 flex items-center gap-2">
        {/* Rating Count */}
        <div className="w-[22px] h-[22px] flex items-center justify-center bg-[#7466f2] rounded-full">
          <span className="text-[11px] font-bold text-white font-['Arial']">
            {totalRatings}
          </span>
        </div>
        
        <span className="text-[13.5px] font-semibold text-[#191919] font-['Outfit']">
          Ratings received from users
        </span>
        
        <span className="mx-2 text-sm font-bold text-[#191919]"></span>
        
        {/* Read Reviews Button */}
        <button 
          onClick={onReadReviews}
          className="flex items-center gap-1 hover:opacity-75 transition-opacity"
        >
          <span className="text-[13.7px] text-[#7466f2] font-['Outfit']">
            Read Reviews
          </span>
          <FaChevronRight className="text-[#7466f2] text-xs" />
        </button>
      </div>

      {/* Save Button */}
      <button
        onClick={() => onSaveToggle && onSaveToggle(!isSaved)}
        className="absolute top-5 right-5 w-[35px] h-[35px] flex items-center justify-center rounded-[5.82px] border-[1.07px] border-solid border-[#eeeeee] hover:bg-gray-50 transition-colors"
      >
        <FaBookmark 
          className={`text-base ${isSaved ? 'text-[#7466f2]' : 'text-gray-400'}`} 
        />
      </button>
    </div>
  );
}