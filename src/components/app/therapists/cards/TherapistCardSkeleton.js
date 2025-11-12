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
            <div className="w-full justify-between md:justify-start flex items-start gap-3 pr-2">
              <div className="flex-1">
                <div className="h-4 md:h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="flex items-center gap-1 md:gap-2 my-1">
                  <div className="w-3 h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row items-center gap-2 mt-0 md:mt-1">
                <div className="w-16 md:w-20 h-1.5 bg-gray-200 rounded-full" />
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-6" />
                </div>
              </div>
            </div>

            {/* Save Button Skeleton */}
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-lg" />
          </div>

          {/* Specialty Skeleton */}
          <div className="mb-1 md:mb-2">
            <div className="h-6 bg-gray-200 rounded w-24 inline-block" />
          </div>
        </div>
      </div>

      {/* Bottom Row Skeleton */}
      <div className="flex items-center gap-2 pt-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>

        <div className="w-2 h-3 bg-gray-200 rounded" />

        <div className="flex items-center gap-1">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="w-2 h-3 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
