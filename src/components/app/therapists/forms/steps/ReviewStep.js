import React from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";

export default function ReviewStep({ formData, identityOption, selectedOption, onInputChange }) {
  return (
    <>
      <div className="text-center mb-6">
        <h2 className="font-['Outfit'] font-medium text-[#191919] text-[22px] tracking-[-0.22px] mb-1">
          Leave a Review
        </h2>
        <p className="font-['Poppins'] font-light text-[#767676] text-sm">
          Share your experience to help others{" "}
          <span className="text-[#796bf5]">(optional)</span>
        </p>
      </div>

      <div className="w-full max-w-[551px] mx-auto mb-6">
        <div className="h-[119px] bg-neutral-50 rounded-xl border-2 border-[#7466f2] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2.5">
            <div className="w-11 h-11 flex items-center justify-center">
              {identityOption === 'anonymous' ? (
                <Image 
                  src="/assets/icons-svg/others/anonymous- light.svg"
                  alt="Anonymous"
                  width={37}
                  height={42}
                />
              ) : (
                <FaUser className="text-3xl text-[#7466f2]" />
              )}
            </div>
            <p className="font-['Outfit'] text-[#424242] text-base tracking-[-0.16px]">
              <span className="font-light tracking-[-0.03px]">Reviewing as:</span>
              <span className="font-medium tracking-[-0.03px] ml-1">
                {identityOption === 'anonymous' ? 'Anonymous User' : 'Registered User'}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h3 className="font-['Outfit'] font-light text-black text-[28px] tracking-[-0.28px] mb-2">
          {formData.therapistName}
        </h3>
        <p className="font-['Outfit'] font-medium text-[#7466f2] text-base tracking-[-0.16px]">
          {selectedOption === 'user' ? formData.specialization : formData.credentials}
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onInputChange('rating', star)}
            className="w-[41px] h-[37px]"
          >
            <svg
              className={`w-full h-full ${
                formData.rating >= star ? 'text-[#7466f2]' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>

      <div className="w-full max-w-[585px] mx-auto">
        <div className="border-b border-[#cec9ff] pb-3 mb-6">
          <label className="block text-[#888787] text-sm font-['Outfit'] tracking-[0.16px] uppercase mb-3">
            REVIEW
          </label>
          <textarea
            value={formData.review}
            onChange={(e) => onInputChange('review', e.target.value)}
            placeholder="Describe your experience"
            className="w-full h-[60px] font-['poppins'] text-[#a7a7a7] text-sm tracking-[-0.18px] resize-none outline-none"
          />
        </div>

        <div className="flex gap-3 mb-8">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={formData.acceptTerms}
            onChange={(e) => onInputChange('acceptTerms', e.target.checked)}
            className="w-5 h-5 mt-1 rounded border border-stone-700 accent-[#7466f2]"
          />
          <label htmlFor="acceptTerms" className="text-[#575757] text-sm font-['Outfit'] leading-5">
            By (checking here) and submitting a review you are making a representation and warranty that you were actually a patient under the care of the named provider. Any submission made where that is not the case may result in possible adverse legal repercussions for you.
          </label>
        </div>
      </div>
    </>
  );
}