"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUser, FaUserMd, FaTimes } from "react-icons/fa";
import NotificationToast from "@/components/global/notifications/NotificationToast";

export default function AddTherapistWizard({ isOpen, onClose }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [identityOption, setIdentityOption] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    // User form fields
    therapistName: '',
    city: '',
    specialization: '',
    relationship: '',
    // Therapist form fields
    credentials: '',
    website: '',
    address: '',
    state: '',
    zipcode: '',
    profilePhoto: null,
    // Review fields
    review: '',
    rating: 0,
    acceptTerms: false
  });

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedOption) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate form before proceeding
      if (validateStep2()) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3 && identityOption && selectedOption === 'user') {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep2 = () => {
    if (selectedOption === 'user') {
      const { therapistName, city, specialization, relationship } = formData;
      return therapistName && city && specialization && relationship;
    } else if (selectedOption === 'therapist') {
      const { therapistName, credentials, address, city, state, zipcode } = formData;
      return therapistName && credentials && address && city && state && zipcode;
    }
    return false;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (selectedOption === 'therapist') {
        console.log('Therapist profile submitted:', formData);
      } else {
        console.log('Therapist recommendation submitted:', formData);
      }
      
      setIsSubmitting(false);
      handleModalClose();
      setShowNotification(true);
    }, 1000);
  };

  const handleModalClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      // Reset form
      setCurrentStep(1);
      setSelectedOption(null);
      setIdentityOption(null);
      setFormData({
        // User form fields
        therapistName: '',
        city: '',
        specialization: '',
        relationship: '',
        // Therapist form fields
        credentials: '',
        website: '',
        address: '',
        state: '',
        zipcode: '',
        profilePhoto: null,
        // Review fields
        review: '',
        rating: 0,
        acceptTerms: false
      });
      setIsAnimating(false);
      onClose();
    }, 300);
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center transition-opacity duration-300 ease-out ${
          isOpen && !isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleModalClose}
      >
        {/* Modal */}
        <div 
          className={`bg-white rounded-[30px] w-[690px] min-h-[520px] max-h-[90vh] p-8 flex flex-col transition-all duration-300 ease-out transform ${
            isOpen && !isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
           <button
  onClick={currentStep === 1 ? handleModalClose : handleBack}
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
              onClick={handleModalClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full flex flex-col items-center flex-1 overflow-y-auto">
            {/* Step indicators */}
            <div className={`flex items-center justify-center gap-2 mb-6 ${
              selectedOption === 'therapist' ? 'w-[200px]' : 'w-[280px]'
            }`}>












              
              {/* Step 1 */}
              <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                currentStep >= 1 ? 'bg-[#7466f2]' : 'border border-[#7466f2]'

              }`}>
                <span className={`font-['Outfit'] font-light ${
                  currentStep >= 1 ? 'text-white' : 'text-[#7466f2]'
                }`}>
                  1
                </span>
              </div>

              {/* Progress line */}
              <div className="w-20 h-0.5 bg-gray-200 relative">
                <div className={`absolute left-0 top-0 h-full bg-[#7466f2] transition-all duration-300 ${
                  currentStep >= 2 ? 'w-full' : 'w-0'
                }`}></div>
              </div>

              {/* Step 2 */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                currentStep >= 2 ? 'bg-[#7466f2]' : 'border border-[#7466f2]'
              }`}>
                <span className={`font-['Outfit'] font-light ${
                  currentStep >= 2 ? 'text-white' : 'text-[#7466f2]'
                }`}>
                  2
                </span>
              </div>

              {/* Progress line */}
              <div className="w-20 h-0.5 bg-gray-200 relative">
                <div className={`absolute left-0 top-0 h-full bg-[#7466f2] transition-all duration-300 ${
                  currentStep >= 3 ? 'w-full' : 'w-0'
                }`}></div>
              </div>

              {/* Step 3 */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                currentStep >= 3 ? 'bg-[#7466f2]' : 'border border-[#7466f2]'
              }`}>
                <span className={`font-['Outfit'] font-light ${
                  currentStep >= 3 ? 'text-white' : 'text-[#7466f2]'
                }`}>
                  3
                </span>
              </div>

              {/* Show Step 4 only for users */}
              {selectedOption === 'user' && (
                <>
                  {/* Progress line */}
                  <div className="w-20 h-0.5 bg-gray-200 relative">
                    <div className={`absolute left-0 top-0 h-full bg-[#7466f2] transition-all duration-300 ${
                      currentStep >= 4 ? 'w-full' : 'w-0'
                    }`}></div>
                  </div>

                  {/* Step 4 */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    currentStep >= 4 ? 'bg-[#7466f2]' : 'border border-[#7466f2]'
                  }`}>
                    <span className={`font-['Outfit'] font-light ${
                      currentStep >= 4 ? 'text-white' : 'text-[#7466f2]'
                    }`}>
                      4
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Dynamic content based on step */}
            {currentStep === 1 ? (
              <>
                {/* Step 1: Identity selection */}
                <div className="text-center mb-8">
                  <h2 className="font-['Outfit'] font-medium text-[#191919] text-[28px] tracking-[-0.28px] leading-[37px]">
                    Your Identity
                  </h2>
                  <p className="font-['Outfit'] font-light text-[#767676] text-base tracking-[-0.03px] leading-[21px] mt-2">
                    Choose how you'd like to submit this recommendation
                  </p>
                </div>

                {/* Options */}
                <div className="flex gap-6 w-full justify-center">
                  {/* I'm a Therapist Option */}
                  <button
                    onClick={() => handleOptionSelect('therapist')}
                    className={`
                      relative w-[200px] h-[130px] rounded-xl overflow-hidden border-2 transition-all
                      ${selectedOption === 'therapist' 
                        ? 'border-[#7466f2] bg-neutral-50' 
                        : 'border-[#dad6ff] hover:border-[#c0b5ff]'}
                    `}
                  >
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <div className="w-11 h-11 flex items-center justify-center mb-2">
                        <FaUserMd className="text-3xl text-[#7466f2]" />
                      </div>
                      <h3 className="font-['Outfit'] font-medium text-[#424242] text-sm tracking-[-0.14px]">
                        I'm a Therapist
                      </h3>
                      <p className="font-['Poppins'] font-light text-[#909090] text-xs text-center tracking-[-0.12px] mt-1">
                        Create your professional profile
                      </p>
                    </div>
                  </button>

                  {/* I'm Not a Therapist Option */}
                  <button
                    onClick={() => handleOptionSelect('user')}
                    className={`
                      relative w-[200px] h-[130px] rounded-xl overflow-hidden border-2 transition-all
                      ${selectedOption === 'user' 
                        ? 'border-[#7466f2] bg-neutral-50' 
                        : 'border-[#dad6ff] hover:border-[#c0b5ff]'}
                    `}
                  >
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <div className="w-11 h-11 flex items-center justify-center mb-2">
                        <FaUser className="text-3xl text-[#7466f2]" />
                      </div>
                      <h3 className="font-['Outfit'] font-medium text-[#424242] text-sm tracking-[-0.14px]">
                        I'm Not a Therapist
                      </h3>
                      <p className="font-['Poppins'] font-light text-[#909090] text-xs text-center tracking-[-0.12px] mt-1">
                        Recommend a therapist you know
                      </p>
                    </div>
                  </button>
                </div>

              </>
            ) : currentStep === 2 && selectedOption === 'therapist' ? (
              <>
                {/* Step 2: Therapist Registration */}
                <div className="text-center mb-6">
                  <h2 className="font-['Outfit'] font-medium text-[#191919] text-[22px] tracking-[-0.22px] mb-1">
                    Therapist Registration
                  </h2>
                  <p className="font-['Poppins'] font-light text-[#767676] text-sm">
                    Create your professional profile
                  </p>
                </div>

                {/* Profile Photo Section */}
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
                        // TODO: Implement photo upload
                        console.log('Photo upload clicked');
                      }}
                      className="absolute bottom-0 right-0 w-6 h-6 bg-[#A3A8FE] rounded-full flex items-center justify-center text-white text-xs"
                    >
                      ✎
                    </button>
                  </div>
                  <p className="text-[#7466f2] text-sm font-['Outfit'] tracking-[-0.14px] mb-1">
                    Add Profile Photo
                  </p>
                  <p className="text-[#909090] text-xs font-['Poppins'] tracking-[-0.12px]">
                    Optional - Click to upload
                  </p>
                </div>

                {/* Form Fields */}
                <div className="flex flex-col gap-6 w-full max-w-[621px] mx-auto">
                  {/* Therapist Name - Full Width */}
                  <div className="relative">
                    <label className="flex items-center gap-1 text-sm text-[#888787] font-['Outfit'] mb-2">
                      Therapist Name
                      <span className="text-[#796bf5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.therapistName}
                      onChange={(e) => handleInputChange('therapistName', e.target.value)}
                      className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent font-['Outfit'] text-gray-900"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Credentials and Website - Side by Side */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="flex items-center gap-1 text-sm text-[#888787] font-['Outfit'] mb-2">
                        Credentials
                        <span className="text-[#796bf5]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.credentials}
                        onChange={(e) => handleInputChange('credentials', e.target.value)}
                        className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent font-['Outfit'] text-gray-900"
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
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent font-['Outfit'] text-gray-900"
                        placeholder="Your website URL"
                      />
                    </div>
                  </div>

                  {/* Address and City - Side by Side */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="flex items-center gap-1 text-sm text-[#888787] font-['Outfit'] mb-2">
                        Address
                        <span className="text-[#796bf5]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent font-['Outfit'] text-gray-900"
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
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent font-['Outfit'] text-gray-900"
                        placeholder="City"
                      />
                    </div>
                  </div>

                  {/* State and Zipcode - Side by Side */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="flex items-center gap-1 text-sm text-[#888787] font-['Outfit'] mb-2">
                        State
                        <span className="text-[#796bf5]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
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
                        onChange={(e) => handleInputChange('zipcode', e.target.value)}
                        className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent font-['Outfit'] text-gray-900"
                        placeholder="Zipcode"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : currentStep === 2 && selectedOption === 'user' ? (
              <>
                {/* Step 2: User form */}
                <div className="text-center mb-6">
                  <h2 className="font-['Outfit'] font-medium text-[#191919] text-[22px] tracking-[-0.22px] mb-1">
                    Add a Therapist
                  </h2>
                  <p className="font-['Poppins'] font-light text-[#767676] text-sm">
                    Help others find great mental health professionals
                  </p>
                </div>

                {/* Form fields */}
                <div className="flex flex-col gap-6 w-full max-w-[621px] mx-auto">
                  {/* Therapist Name */}
                  <div className="relative">
                    <label className="flex items-center gap-1 text-sm text-[#888787] font-['Outfit'] mb-2">
                      Therapist Name
                      <span className="text-[#796bf5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.therapistName}
                      onChange={(e) => handleInputChange('therapistName', e.target.value)}
                      className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent font-['Outfit'] text-gray-900"
                      placeholder="Enter therapist's full name"
                    />
                  </div>

                  {/* City */}
                  <div className="relative">
                    <label className="flex items-center gap-1 text-sm text-[#888787] font-['Outfit'] mb-2">
                      City
                      <span className="text-[#796bf5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent font-['Outfit'] text-gray-900"
                      placeholder="Enter city"
                    />
                  </div>

                  {/* Specialization */}
                  <div className="relative">
                    <label className="flex items-center gap-1 text-sm text-[#888787] font-['Outfit'] mb-2">
                      Specialization
                      <span className="text-[#796bf5]">*</span>
                    </label>
                    <select
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent font-['Outfit'] text-gray-900 cursor-pointer"
                    >
                      <option value="" className="text-[#a7a7a7]">Select Specialization</option>
                      <option value="Clinical Psychologist">Clinical Psychologist</option>
                      <option value="Psychiatrist">Psychiatrist</option>
                      <option value="Family Therapist">Family Therapist</option>
                      <option value="Couples Therapist">Couples Therapist</option>
                      <option value="Child Psychologist">Child Psychologist</option>
                      <option value="Mental Health Counselor">Mental Health Counselor</option>
                    </select>
                  </div>

                  {/* Relationship */}
                  <div className="relative">
                    <label className="flex items-center gap-1 text-sm text-[#888787] font-['Outfit'] mb-2">
                      How do you know this therapist?
                      <span className="text-[#796bf5]">*</span>
                    </label>
                    <textarea
                      value={formData.relationship}
                      onChange={(e) => handleInputChange('relationship', e.target.value)}
                      className="w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent font-['Outfit'] text-gray-900 resize-none"
                      placeholder="Describe your experience"
                      rows="2"
                    />
                  </div>
               </div>
              </>
            ) : currentStep === 3 ? (
              <>
                {/* Step 3: Identity Choice */}
                <div className="text-center mb-6">
                  <h2 className="font-['Outfit'] font-medium text-[#191919] text-[22px] tracking-[-0.22px] mb-1">
                    Your Identity
                  </h2>
                  <p className="font-['Poppins'] font-light text-[#767676] text-sm">
                    Choose how you'd like to submit this recommendation
                  </p>
                </div>

                {/* Options */}
                <div className="flex gap-6 w-full justify-center">
                  {/* Stay Anonymous Option */}
                  <button
                    onClick={() => setIdentityOption('anonymous')}
                    className={`relative w-[200px] h-[130px] rounded-xl overflow-hidden border-2 transition-all ${
                      identityOption === 'anonymous' 
                        ? 'border-[#7466f2] bg-neutral-50' 
                        : 'border-[#dad6ff] hover:border-[#7466f2]'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <div className="w-11 h-11 flex items-center justify-center mb-2">
                        <Image 
                          src="/assets/icons-svg/others/anonymous- light.svg"
                          alt="Anonymous"
                          width={32}
                          height={32}
                          className="text-[#7466f2]"
                        />
                      </div>
                      <h3 className="font-['Outfit'] font-medium text-[#424242] text-sm tracking-[-0.14px] mb-1">
                        Stay Anonymous
                      </h3>
                      <p className="font-['Poppins'] font-light text-[#909090] text-xs text-center">
                        Submit without creating an account
                      </p>
                    </div>
                  </button>

                  {/* Log In Option */}
                  <button
                    onClick={() => setIdentityOption('registered')}
                    className={`relative w-[200px] h-[130px] rounded-xl overflow-hidden border-2 transition-all ${
                      identityOption === 'registered' 
                        ? 'border-[#7466f2] bg-neutral-50' 
                        : 'border-[#dad6ff] hover:border-[#7466f2]'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <div className="w-11 h-11 flex items-center justify-center mb-2">
                        <FaUser className="text-3xl text-[#7466f2]" />
                      </div>
                      <h3 className="font-['Outfit'] font-medium text-[#424242] text-sm tracking-[-0.14px] mb-1">
                        Log In to Submit
                      </h3>
                      <p className="font-['Poppins'] font-light text-[#909090] text-xs text-center">
                        Track your recommendations
                      </p>
                    </div>
                  </button>
                </div>

              </>
            ) : currentStep === 4 ? (
              <>
                {/* Step 4: Leave a Review */}
                <div className="text-center mb-6">
                  <h2 className="font-['Outfit'] font-medium text-[#191919] text-[22px] tracking-[-0.22px] mb-1">
                    Leave a Review
                  </h2>
                  <p className="font-['Poppins'] font-light text-[#767676] text-sm">
                    Share your experience to help others{" "}
                    <span className="text-[#796bf5]">(optional)</span>
                  </p>
                </div>

                {/* Identity Display */}
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

                {/* Therapist Info */}
                <div className="text-center mb-6">
                  <h3 className="font-['Outfit'] font-light text-black text-[28px] tracking-[-0.28px] mb-2">
                    {formData.therapistName}
                  </h3>
                  <p className="font-['Outfit'] font-medium text-[#7466f2] text-base tracking-[-0.16px]">
                    {selectedOption === 'user' ? formData.specialization : formData.credentials}
                  </p>
                </div>

                {/* Rating Stars */}
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleInputChange('rating', star)}
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

                {/* Review Text Area */}
                <div className="w-full max-w-[585px] mx-auto">
                  <div className="border-b border-[#cec9ff] pb-3 mb-6">
                    <label className="block text-[#888787] text-sm font-['Outfit'] tracking-[0.16px] uppercase mb-3">
                      REVIEW
                    </label>
                    <textarea
                      value={formData.review}
                      onChange={(e) => handleInputChange('review', e.target.value)}
                      placeholder="Describe your experience"
                      className="w-full h-[60px] font-['Outfit'] text-[#a7a7a7] text-lg tracking-[-0.18px] resize-none outline-none"
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex gap-3 mb-8">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                      className="w-5 h-5 mt-1 rounded border border-stone-700 accent-[#7466f2]"
                    />
                    <label htmlFor="acceptTerms" className="text-[#575757] text-sm font-['Outfit'] leading-5">
                      By (checking here) and submitting a review you are making a representation and warranty that you were actually a patient under the care of the named provider. Any submission made where that is not the case may result in possible adverse legal repercussions for you.
                    </label>
                  </div>

                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="text-gray-500">Step {currentStep} content coming soon...</p>
              </div>
            )}

            {/* Bottom Buttons - Always Present */}
            <div className="flex justify-center gap-3 mt-6 w-full max-w-[551px] mx-auto">
              {/* Back Button */}
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center w-[140px] h-[45px] rounded-[15px] border-2 border-[#7466f2] bg-white hover:bg-gray-50 transition-all"
                >
                  <span className="font-['Outfit'] font-medium text-[#7466f2] text-base">
                    Back
                  </span>
                </button>
              )}

              {/* Submit/Continue Button */}
              <button
                onClick={() => {
                  if (currentStep === 1) {
                    handleNext();
                  } else if (currentStep === 2) {
                    handleNext();
                  } else if (currentStep === 3) {
                    if (selectedOption === 'therapist') {
                      // Therapists submit here
                      handleSubmit();
                    } else {
                      // Users continue to step 4
                      handleNext();
                    }
                  } else if (currentStep === 4) {
                    // Users submit here
                    handleSubmit();
                  }
                }}
                disabled={
                  (currentStep === 1 && !selectedOption) ||
                  (currentStep === 2 && !validateStep2()) ||
                  (currentStep === 3 && !identityOption) ||
                  (currentStep === 4 && formData.review && !formData.acceptTerms) ||
                  isSubmitting
                }
                className={`
                  flex-1 flex items-center justify-center h-[45px] rounded-[15px] transition-all
                  ${(currentStep === 1 && !selectedOption) ||
                    (currentStep === 2 && !validateStep2()) ||
                    (currentStep === 3 && !identityOption) ||
                    (currentStep === 4 && formData.review && !formData.acceptTerms) ||
                    isSubmitting
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#7466f2] text-white hover:bg-[#6153e0]'}
                `}
              >
                <span className="font-['Outfit'] font-medium text-base">
                  {isSubmitting ? 'Submitting...' : 
                   (currentStep === 3 && selectedOption === 'therapist') || currentStep === 4 ? 'Submit' : 'Continue'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Notification */}
      <NotificationToast
        isShowing={showNotification}
        onClose={() => setShowNotification(false)}
        message={selectedOption === 'therapist' 
          ? "Therapist profile created successfully!" 
          : "Therapist recommendation submitted successfully!"}
        icon="✓"
        iconBgColor="bg-green-500"
        duration={4000}
      />
    </>
  );
}