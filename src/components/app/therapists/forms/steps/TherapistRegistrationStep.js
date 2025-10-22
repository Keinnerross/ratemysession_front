import React from "react";

export default function TherapistRegistrationStep({ formData, onInputChange }) {
  return (
    <>
      <div className="text-center mb-6">
        <h2 className="font-['Outfit'] font-medium text-[#191919] text-[22px] tracking-[-0.22px] mb-1">
          Therapist Registration
        </h2>
        <p className="font-['Poppins'] font-light text-[#767676] text-sm">
          Create your professional profile
        </p>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="relative w-[90px] h-[90px] mb-3">
          <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {formData.profilePhoto ? (
              <img 
                src={formData.profilePhoto} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
            )}
          </div>
          <button
            onClick={() => {
              console.log('Photo upload clicked');
            }}
            className="absolute bottom-0 right-0 w-6 h-6 bg-[#A3A8FE] rounded-full flex items-center justify-center text-white text-xs"
          >
            ✎
          </button>
        </div>
        <p className="text-[#7466f2] text-lg font-['Outfit'] tracking-[-0.14px] mb-1">
          Add Profile Photo
        </p>
        <p className="text-[#909090] text-xs font-['Poppins'] tracking-[-0.12px]">
          Optional - Click to upload
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-[621px] mx-auto text-sm font-['poppins'] px-10 pb-4">
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
            placeholder="Enter your full name"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="flex items-center gap-1 text-sm text-[#888787] font-['Outfit'] mb-2">
              Credentials
              <span className="text-[#796bf5]">*</span>
            </label>
            <input
              type="text"
              value={formData.credentials}
              onChange={(e) => onInputChange('credentials', e.target.value)}
              className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent  text-gray-900 text-sm"
              placeholder="e.g., LCSW, PhD, MD"
            />
          </div>
          <div className="flex-1">
            <label className="flex items-center gap-1 text-sm text-[#888787] font-['Outfit'] mb-2">
              Website
              <span className="text-sm text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => onInputChange('website', e.target.value)}
              className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent  text-gray-900"
              placeholder="Your website URL"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="flex items-center gap-1 text-sm text-[#888787] font-['Outfit'] mb-2">
              Address
              <span className="text-[#796bf5]">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent  text-gray-900"
              placeholder="Street address"
            />
          </div>
          <div className="flex-1">
            <label className="flex items-center gap-1 text-sm text-[#888787] font-['Outfit'] mb-2">
              City
              <span className="text-[#796bf5]">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => onInputChange('city', e.target.value)}
              className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent  text-gray-900"
              placeholder="City"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="flex items-center gap-1 text-sm text-[#888787] font-['Outfit'] mb-2">
              State
              <span className="text-[#796bf5]">*</span>
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => onInputChange('state', e.target.value)}
              className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent font-['Outfit'] text-gray-900"
              placeholder="State"
            />
          </div>
          <div className="flex-1">
            <label className="flex items-center gap-1 text-sm text-[#888787] font-['Outfit'] mb-2">
              Zipcode
              <span className="text-[#796bf5]">*</span>
            </label>
            <input
              type="text"
              value={formData.zipcode}
              onChange={(e) => onInputChange('zipcode', e.target.value)}
              className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent font-['Outfit'] text-gray-900"
              placeholder="Zipcode"
            />
          </div>
        </div>
      </div>
    </>
  );
}