"use client";

import React from "react";

export default function TherapistCardSkeleton() {
  return (
    <div className="bg-white border border-amethyst-100 rounded-xl p-3 md:p-6 animate-pulse">
      <div className="flex gap-2 md:gap-6">
        {/* Profile Image Skeleton */}
        <div className="flex-shrink-0">
          <div className="w-16 md:w-20 h-16 md:h-20 bg-gray-200 rounded-full" />
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-2">
            <div className="w-full">
              <div className="h-4 md:h-[22px] bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>

            <div className="flex items-center gap-4">
              {/* Save Button Skeleton */}
              <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            </div>
          </div>

          {/* Specialty Skeleton */}
          <div className="mb-1 md:mb-2">
            <div className="h-[26px] md:h-[30px] bg-gray-200 rounded-md w-32 inline-block" />
          </div>
        </div>
      </div>
      
      {/* Bottom Row Skeleton */}
      <div className="flex items-center gap-2 pt-3">
        <div className="w-6 h-6 bg-gray-200 rounded-full" />
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-20 ml-auto" />
      </div>
    </div>
  );
}