"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NotificationToast from "@/components/global/notifications/NotificationToast";
import ModalWrapper from "./components/ModalWrapper";
import StepIndicators from "./components/StepIndicators";
import IdentitySelectionStep from "./steps/IdentitySelectionStep";
import TherapistRegistrationStep from "./steps/TherapistRegistrationStep";
import UserRecommendationStep from "./steps/UserRecommendationStep";
import IdentityChoiceStep from "./steps/IdentityChoiceStep";
import ReviewStep from "./steps/ReviewStep";
import useFormValidation from "./hooks/useFormValidation";

export default function AddTherapistWizard({ isOpen, onClose }) {
  const router = useRouter();
  const { validateStep2, isButtonDisabled, getButtonText } = useFormValidation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [identityOption, setIdentityOption] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    therapistName: '',
    city: '',
    specialization: '',
    relationship: '',
    credentials: '',
    website: '',
    address: '',
    state: '',
    zipcode: '',
    profilePhoto: null,
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
      if (validateStep2(selectedOption, formData)) {
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
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
      setCurrentStep(1);
      setSelectedOption(null);
      setIdentityOption(null);
      setFormData({
        therapistName: '',
        city: '',
        specialization: '',
        relationship: '',
        credentials: '',
        website: '',
        address: '',
        state: '',
        zipcode: '',
        profilePhoto: null,
        review: '',
        rating: 0,
        acceptTerms: false
      });
      setIsAnimating(false);
      onClose();
    }, 300);
  };

  const handleButtonClick = () => {
    if (currentStep === 1) {
      handleNext();
    } else if (currentStep === 2) {
      handleNext();
    } else if (currentStep === 3) {
      if (selectedOption === 'therapist') {
        handleSubmit();
      } else {
        handleNext();
      }
    } else if (currentStep === 4) {
      handleSubmit();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <IdentitySelectionStep 
            selectedOption={selectedOption}
            onOptionSelect={handleOptionSelect}
          />
        );
      case 2:
        return selectedOption === 'therapist' ? (
          <TherapistRegistrationStep 
            formData={formData}
            onInputChange={handleInputChange}
          />
        ) : (
          <UserRecommendationStep 
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <IdentityChoiceStep 
            identityOption={identityOption}
            onIdentitySelect={setIdentityOption}
          />
        );
      case 4:
        return (
          <ReviewStep 
            formData={formData}
            identityOption={identityOption}
            selectedOption={selectedOption}
            onInputChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ModalWrapper
        isOpen={isOpen}
        isAnimating={isAnimating}
        onClose={handleModalClose}
        currentStep={currentStep}
        onBack={handleBack}
        footer={
          <div className="flex justify-center gap-3 w-full max-w-[551px] mx-auto">
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

            <button
              onClick={handleButtonClick}
              disabled={isButtonDisabled(currentStep, selectedOption, formData, identityOption, isSubmitting)}
              className={`
                flex-1 flex items-center justify-center h-[45px] rounded-[15px] transition-all
                ${isButtonDisabled(currentStep, selectedOption, formData, identityOption, isSubmitting)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#7466f2] text-white hover:bg-[#6153e0]'}
              `}
            >
              <span className="font-['Outfit'] font-medium text-base">
                {getButtonText(currentStep, selectedOption, isSubmitting)}
              </span>
            </button>
          </div>
        }
      >
        <StepIndicators currentStep={currentStep} selectedOption={selectedOption} />
        
        {renderStepContent()}
      </ModalWrapper>
      
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