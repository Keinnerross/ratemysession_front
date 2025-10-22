import React from "react";
import { FaTimes } from "react-icons/fa";

export default function ModalWrapper({ 
  isOpen, 
  isAnimating, 
  onClose, 
  currentStep,
  onBack,
  children,
  footer
}) {
  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center transition-opacity duration-300 ease-out ${
        isOpen && !isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-[30px] w-[690px] min-h-[520px] max-h-[90vh] p-8 flex flex-col transition-all duration-300 ease-out transform ${
          isOpen && !isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={currentStep === 1 ? onClose : onBack}
            className="flex items-center gap-1 text-[#7f7f7f] hover:text-gray-900 transition-colors"
          >
            {currentStep === 1 ? (
              <>
                <FaTimes className="w-3 h-3" />
                <span className="text-xs font-['Outfit'] tracking-[0.16px] uppercase">
                  Cancel
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

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
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