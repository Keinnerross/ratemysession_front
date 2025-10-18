"use client";

import React from "react";
import { FaEdit } from "react-icons/fa";

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-[1418px] mx-auto px-4">
        <div className="flex gap-[75px] flex-wrap lg:flex-nowrap">
          {/* Left Column - Avatar and Account Info */}
          <div className="flex flex-col gap-6 w-full lg:w-[293px]">
            {/* Avatar */}
            <div className="w-[293px] h-[293px] bg-[#eae7ff] rounded-full overflow-hidden flex items-center justify-center">
              <span className="text-[220px] font-medium text-[#b6aeff] font-['Outfit'] tracking-[-2.20px]">
                S
              </span>
            </div>

            {/* Account Information */}
            <div className="flex flex-col gap-6">
              {/* Section Title */}
              <div className="flex items-center gap-3">
                <h2 className="text-[18.8px] font-normal text-[#535252] font-['Outfit'] whitespace-nowrap">
                  About account
                </h2>
                <div className="flex-1 h-px bg-[#e0e5eb]"></div>
              </div>

              {/* Account Details */}
              <div className="flex flex-col gap-2.5 pl-2">
                <p className="text-[17px] text-[#535252] font-['Outfit']">
                  <span className="font-medium">My reviews:</span>
                  <span className="font-light"> 5</span>
                </p>
                <p className="text-[17px] text-[#535252] font-['Outfit']">
                  <span className="font-medium">Register Since:</span>
                  <span className="font-light"> 12/12/2024</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="flex-1 max-w-[1050px]">
            <div className="flex justify-between items-start">
              {/* Profile Information */}
              <div className="flex flex-col gap-6 w-full max-w-[342px]">
                {/* User Details */}
                <div className="flex flex-col gap-3.5">
                  <h1 className="text-4xl font-medium text-black font-['Outfit'] tracking-[-0.36px]">
                    Sarah Andersen
                  </h1>

                  {/* Email and Password */}
                  <div className="flex flex-col gap-3">
                    <p className="text-xl font-['Outfit'] tracking-[-0.20px]">
                      <span className="font-medium text-[#7466f2]">Email: </span>
                      <span className="font-light text-[#191919]">sandersen94@gmail.com</span>
                    </p>
                    <p className="text-xl font-['Outfit'] tracking-[-0.20px]">
                      <span className="font-medium text-[#7466f2]">Password: </span>
                      <span className="font-medium text-[#191919]">**********</span>
                    </p>
                  </div>
                </div>

                {/* Log Out Button */}
                <button className="w-[164px] h-[38px] bg-[#7466f2] rounded-[100px] text-white text-base font-['Outfit'] hover:bg-[#6153e0] transition-colors">
                  Log Out
                </button>
              </div>

              {/* Edit Button */}
              <button className="w-[35px] h-[35px] bg-[#cbc5ff] rounded-full flex items-center justify-center hover:bg-[#b6aeff] transition-colors">
                <FaEdit className="w-[15px] h-[15px] text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}