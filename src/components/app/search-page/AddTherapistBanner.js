"use client";

import React, { useState, useEffect } from 'react';
import { ButtonCustom } from '@/components/global/buttons/buttons';
import { FaTimes } from 'react-icons/fa';
import { useAddTherapist } from '@/context/AddTherapistContext';

const AddTherapistBanner = ({ 
  callToAction = "Join our community of therapists and expand your practice",
  buttonText = "Add Therapist",
  showDelay = 5000 // 5 seconds default
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const { openAddTherapist } = useAddTherapist();

  useEffect(() => {
    // Check if banner was closed in this session
    const bannerClosed = sessionStorage.getItem('therapistBannerClosed');
    
    if (!bannerClosed) {
      setShouldShow(true);
      // Show banner after delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, showDelay);

      return () => clearTimeout(timer);
    }
  }, [showDelay]);

  const handleClose = () => {
    setIsVisible(false);
    setShouldShow(false);
    // Remember that user closed the banner for this session
    // sessionStorage.setItem('therapistBannerClosed', 'true');
  };

  const handleAddTherapist = () => {
    openAddTherapist();
    handleClose();
  };

  if (!shouldShow) return null;

  return (
    <div 
      className={`
        fixed bottom-0 left-0 right-0 z-50
        transform transition-transform duration-700 ease-out
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      `}
    >
      <div className="bg-amethyst-500 shadow-xl relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-white rounded-full animate-pulse" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white rounded-full animate-pulse animation-delay-1000" />
        </div>
        
        <div className="w-full  px-6 py-10 relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors hover:rotate-90 transform duration-300"
            aria-label="Close banner"
          >
            <FaTimes className="text-lg" />
          </button>

          {/* Content */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
            <p className="text-base text-white font-poppins max-w-xl">
              {callToAction}
            </p>
            <ButtonCustom 
              variant={2} 
              onClick={handleAddTherapist}
            >
              {buttonText}
            </ButtonCustom>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTherapistBanner;