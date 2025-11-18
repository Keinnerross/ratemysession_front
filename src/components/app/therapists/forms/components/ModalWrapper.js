import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";

export default function ModalWrapper({
  isOpen,
  isAnimating,
  onClose,
  currentStep,
  onBack,
  stepIndicator,
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
        className={`bg-white rounded-[30px] md:w-[690px] w-full h-full md:h-auto md:min-h-[520px] md:max-h-[90vh] p-6 md:p-8 flex flex-col transition-all duration-300 ease-out transform md:rounded-[30px] rounded-none ${
          isVisible && !isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
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

        {stepIndicator && (
          <div className="w-full flex justify-center flex-shrink-0">
            {stepIndicator}
          </div>
        )}

        <div className="w-full flex flex-col items-center flex-1 overflow-y-auto overflow-x-hidden pt-10 md:pt-0">
          {children}
        </div>

        {footer && (
          <div className="pt-6 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}