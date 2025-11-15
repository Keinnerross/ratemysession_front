"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function PhotoPreviewModal({
  isOpen,
  onClose,
  onConfirm,
  imageUrl,
  isLoading = false
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center transition-opacity duration-300 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-[20px] w-[90%] max-w-[500px] p-6 sm:p-8 flex flex-col transition-all duration-300 ease-out transform ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-normal text-gray-800 font-['Outfit'] tracking-[-0.32px] mb-4 sm:mb-6">
          Preview Profile Photo
        </h2>

        {/* Photo Preview */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] rounded-full overflow-hidden bg-gray-100">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-medium font-['poppins'] text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-full bg-[#7466f2] text-white font-medium font-['poppins'] text-sm hover:bg-[#6153e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              "Accept"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
