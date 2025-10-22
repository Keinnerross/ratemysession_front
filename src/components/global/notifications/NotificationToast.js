"use client";

import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

export default function NotificationToast({ 
  message = "Thanks for your review!",
  subtitle = "Your review has been published successfully",
  isVisible,
  onClose,
  duration = 3000,
  type = "success"
}) {
  const [isShowing, setIsShowing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Small delay to trigger animation
      const showTimer = setTimeout(() => {
        setIsShowing(true);
      }, 10);

      // Auto close timer
      const closeTimer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsShowing(false);
      setIsExiting(false);
      onClose();
    }, 300); // Match animation duration
  };

  if (!isVisible && !isExiting) return null;

  return (
    <div 
      className={`
        fixed bottom-6 right-6 z-[60]
        transform transition-all duration-300 ease-out
        ${isShowing && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[280px] max-w-[360px] border border-gray-100 relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
          <div 
            className={`h-full bg-[#7466f2] transition-all ease-linear`}
            style={{
              width: isShowing && !isExiting ? '0%' : '100%',
              transition: `width ${duration}ms linear`
            }}
          />
        </div>

        {/* Icon */}
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
          ${type === 'success' ? 'bg-green-100' : 'bg-[#f3f1ff]'}
        `}>
          <FaCheckCircle 
            className={`w-4 h-4 ${
              type === 'success' ? 'text-green-500' : 'text-[#7466f2]'
            }`} 
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-sm font-medium font-['Outfit'] text-gray-900 leading-tight">
            {message}
          </p>
          {subtitle && (
            <p className="text-xs font-light font-['Outfit'] text-gray-600 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1"
        >
          <FaTimes className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}