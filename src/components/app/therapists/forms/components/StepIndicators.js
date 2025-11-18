import React from "react";

export default function StepIndicators({ currentStep, selectedOption }) {
  const totalSteps = selectedOption === 'therapist' ? 3 : 4;

  return (
    <div className="flex items-center justify-center gap-1 md:gap-2 mb-6 md:mb-8 px-4 md:px-0">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep >= stepNumber;

        return (
          <React.Fragment key={stepNumber}>
            <div className={`relative w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
              isActive ? 'bg-[#7466f2]' : 'border border-[#7466f2]'
            }`}>
              <span className={`font-['Outfit'] font-light ${
                isActive ? 'text-white' : 'text-[#7466f2]'
              }`}>
                {stepNumber}
              </span>
            </div>

            {stepNumber < totalSteps && (
              <div className="w-12 md:w-20 h-0.5 bg-gray-200 relative flex-shrink-0">
                <div className={`absolute left-0 top-0 h-full bg-[#7466f2] transition-all duration-300 ${
                  currentStep > stepNumber ? 'w-full' : 'w-0'
                }`}></div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}