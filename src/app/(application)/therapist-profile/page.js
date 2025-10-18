"use client";

import React from "react";
import { FaMapMarkerAlt, FaGlobe, FaStar, FaRegStar } from "react-icons/fa";

export default function TherapistProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-[1302px] mx-auto px-4">
        <div className="flex gap-[105px] flex-wrap lg:flex-nowrap">
          {/* Left Column - Therapist Info */}
          <div className="w-[280px] flex flex-col">
            {/* Profile Picture */}
            <div className="w-[277px] h-[277px] rounded-full bg-gray-300 overflow-hidden">
              {/* Placeholder for therapist image */}
              <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-400"></div>
            </div>

            {/* About Section */}
            <div className="mt-[34px] flex flex-col gap-[23px]">
              {/* About Title */}
              <div className="flex items-center gap-[7px]">
                <h3 className="text-lg text-[#585656] font-['Outfit'] whitespace-nowrap">
                  About
                </h3>
                <div className="flex-1 h-px bg-[#e0e5eb]"></div>
              </div>

              {/* Contact Information */}
              <div className="pl-[26px] flex flex-col gap-[9px]">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-[#585656] mt-1 flex-shrink-0" />
                  <p className="text-[16.2px] font-light text-[#585656] font-['Outfit']">
                    276 5th Ave floor New York 1001
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <FaGlobe className="text-[#585656]" />
                  <p className="text-[16.2px] font-light text-[#585656] font-['Outfit']">
                    www.alexandrakadish.com
                  </p>
                </div>
              </div>
            </div>

            {/* Credentials Section */}
            <div className="mt-[35px] flex flex-col gap-[9px]">
              {/* Credentials Title */}
              <div className="flex items-center gap-[7px]">
                <h3 className="text-lg text-[#585656] font-['Outfit'] whitespace-nowrap">
                  Credentials
                </h3>
                <div className="flex-1 h-px bg-[#e0e5eb]"></div>
              </div>

              {/* Credential Details */}
              <div className="text-sm font-light text-[#585656] font-['Outfit'] leading-normal">
                <p>NY LMHC #012743</p>
                <p>NJ LPC #37PC01002200</p>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="flex-1 flex gap-[73px] flex-wrap lg:flex-nowrap">
            {/* Therapist Details */}
            <div className="flex flex-col gap-[22px]">
              {/* Header Info */}
              <div className="relative">
                <h1 className="text-[32px] font-medium text-black font-['Outfit'] tracking-[-0.32px]">
                  Alexandra Kadish
                </h1>
                
                <p className="text-xl font-medium text-[#7466f2] font-['Outfit'] mt-[11px]">
                  Mental Health Counselor
                </p>

                {/* Location Badge */}
                <div className="absolute top-0 right-0 px-5 py-[5px] bg-[#f3f1ff] rounded-[100px] flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#7466f2] text-sm" />
                  <span className="text-base text-[#7466f2] font-['Outfit']">
                    New York
                  </span>
                </div>

                {/* Rating Section */}
                <div className="mt-[19px]">
                  <p className="text-sm font-medium text-[#767676] font-['Outfit'] tracking-[0.70px] uppercase">
                    RATING
                  </p>
                  
                  <div className="flex items-center gap-[25px] mt-1">
                    <span className="text-[21.3px] font-semibold text-stone-800 font-['Outfit']">
                      4.1 / 5
                    </span>
                    
                    {/* Stars */}
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="w-[25px] h-[24px]">
                          {star <= 4 ? (
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

              {/* Rate Therapist Button */}
              <button className="w-[164px] h-[38px] bg-[#7466f2] rounded-[100px] text-white text-base font-['Outfit'] hover:bg-[#6153e0] transition-colors">
                Rate Therapist
              </button>
            </div>

            {/* Statistics Chart */}
            <div className="w-[473px] h-[312px] bg-gray-100 rounded-lg flex items-center justify-center">
              {/* Placeholder for statistics chart */}
              <p className="text-gray-500 font-['Outfit']">Statistics Chart</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}