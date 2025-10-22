import React from "react";
import { FaUser, FaUserMd } from "react-icons/fa";

export default function IdentitySelectionStep({ selectedOption, onOptionSelect }) {
  return (
    <>
      <div className="text-center mb-8">
        <h2 className="font-['Outfit'] font-medium text-[#191919] text-[28px] tracking-[-0.28px] leading-[37px]">
          Your Identity
        </h2>
        <p className="font-['Outfit'] font-light text-[#767676] text-base tracking-[-0.03px] leading-[21px] mt-2">
          Choose how you'd like to submit this recommendation
        </p>
      </div>

      <div className="flex gap-6 w-full justify-center">
        <button
          onClick={() => onOptionSelect('therapist')}
          className={`
            relative w-[220px] h-[150px] rounded-xl overflow-hidden border-2 transition-all
            ${selectedOption === 'therapist' 
              ? 'border-[#7466f2] bg-neutral-50' 
              : 'border-[#dad6ff] hover:border-[#c0b5ff]'}
          `}
        >
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="w-12 h-12 flex items-center justify-center mb-3">
              <FaUserMd className="text-4xl text-[#7466f2]" />
            </div>
            <h3 className="font-['Outfit'] font-medium text-[#424242] text-base tracking-[-0.16px]">
              I'm a Therapist
            </h3>
            <p className="font-['Poppins'] font-light text-[#909090] text-xs text-center tracking-[-0.12px] mt-1">
              Create your professional profile
            </p>
          </div>
        </button>

        <button
          onClick={() => onOptionSelect('user')}
          className={`
            relative w-[220px] h-[150px] rounded-xl overflow-hidden border-2 transition-all
            ${selectedOption === 'user' 
              ? 'border-[#7466f2] bg-neutral-50' 
              : 'border-[#dad6ff] hover:border-[#c0b5ff]'}
          `}
        >
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="w-12 h-12 flex items-center justify-center mb-3">
              <FaUser className="text-4xl text-[#7466f2]" />
            </div>
            <h3 className="font-['Outfit'] font-medium text-[#424242] text-base tracking-[-0.16px]">
              I'm Not a Therapist
            </h3>
            <p className="font-['Poppins'] font-light text-[#909090] text-xs text-center tracking-[-0.12px] mt-1">
              Recommend a therapist you know
            </p>
          </div>
        </button>
      </div>
    </>
  );
}