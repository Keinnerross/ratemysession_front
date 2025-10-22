import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";

export default function ModalWrapper({ 
  isOpen, 
  isAnimating, 
  onClose, 
  currentStep,
  onBack,
  children,
  footer
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the DOM is ready before animating
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center transition-opacity duration-300 ease-out ${
        isVisible && !isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-[30px] w-[690px] min-h-[520px] max-h-[90vh] p-8 flex flex-col transition-all duration-300 ease-out transform ${
          isVisible && !isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={currentStep === 1 ? onClose : onBack}
            className="flex items-center gap-0 text-[#7f7f7f] hover:text-gray-900 transition-colors"
          >
            {currentStep === 1 ? (
              <>
                <MdKeyboardArrowLeft className="w-6 h-6" />
                <span className="text-xs font-['Outfit'] tracking-[0.16px] uppercase">
                  RETURN PROFILE
                </span>
              </>
            ) : (
              <>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="text-xs font-['Outfit'] tracking-[0.16px] uppercase">
                  Back
                </span>
              </>
            )}
          </button>

        </div>

        <div className="w-full flex flex-col items-center flex-1 overflow-y-auto">
          {children}
        </div>
        
        {footer && (
          <div className="pt-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}