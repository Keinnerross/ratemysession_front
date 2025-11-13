import React from "react";

export default function UserRecommendationStep({ formData, onInputChange }) {
  return (
    <>
      <div className="text-center mb-6">
        <h2 className="font-['Outfit'] font-medium text-[#191919] text-[22px] tracking-[-0.22px] mb-1">
          Add a Therapist
        </h2>
        <p className="font-['Poppins'] font-light text-[#767676] text-sm">
          Help others find great mental health professionals
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-[621px] mx-auto font-['poppins'] text-sm px-10">
        <div className="relative">
          <label className="flex items-center gap-1 text-sm text-[#888787] font-['Outfit'] mb-2">
            Therapist Name
            <span className="text-[#796bf5]">*</span>
          </label>
          <input
            type="text"
            value={formData.therapistName}
            onChange={(e) => onInputChange('therapistName', e.target.value)}
            className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent  text-gray-900"
            placeholder="Enter therapist's full name"
          />
        </div>

        <div className="relative">
          <label className="flex items-center gap-1 text-sm text-[#888787] font-['Outfit'] mb-2">
            City
            <span className="text-[#796bf5]">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => onInputChange('city', e.target.value)}
            className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent  text-gray-900"
            placeholder="Enter city"
          />
        </div>

        

        <div className="relative">
          <label className="flex items-center gap-1 text-sm text-[#888787] font-['Outfit'] mb-2">
            How do you know this therapist?
            <span className="text-[#796bf5]">*</span>
          </label>
          <textarea
            value={formData.relationship}
            onChange={(e) => onInputChange('relationship', e.target.value)}
            className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent  text-gray-900 resize-none"
            placeholder="Describe your experience"
            rows="2"
          />
        </div>
      </div>
    </>
  );
}