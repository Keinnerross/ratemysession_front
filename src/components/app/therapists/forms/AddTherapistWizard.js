"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NotificationToast from "@/components/global/notifications/NotificationToast";
import { therapistService } from "@/services/therapists/therapistService";
import reviewService from "@/services/reviews/reviewService";
import { useAuth } from "@/context/AuthContext";
import ModalWrapper from "./components/ModalWrapper";
import StepIndicators from "./components/StepIndicators";
import IdentitySelectionStep from "./steps/IdentitySelectionStep";
import TherapistRegistrationStep from "./steps/TherapistRegistrationStep";
import UserRecommendationStep from "./steps/UserRecommendationStep";
import IdentityChoiceStep from "./steps/IdentityChoiceStep";
import ReviewStep from "./steps/ReviewStep";
import useFormValidation from "./hooks/useFormValidation";

export default function AddTherapistWizard({ isOpen, onClose, savedDraft = null }) {
  const router = useRouter();
  const { user } = useAuth();
  const { validateStep2, isButtonDisabled, getButtonText } = useFormValidation();
  const [currentStep, setCurrentStep] = useState(savedDraft?.currentStep || 1);
  const [selectedOption, setSelectedOption] = useState(savedDraft?.selectedOption || null);
  const [identityOption, setIdentityOption] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState(savedDraft?.formData || {
    therapistName: '',
    city: '',
    specialization: '',
    relationship: '',
    credentials: [],
    website: '',
    address: '',
    state: '',
    zipcode: '',
    profilePhoto: null,
    profilePhotoName: '',
    review: '',
    rating: 0,
    acceptTerms: false
  });

  // Restore state when savedDraft changes
  useEffect(() => {
    if (savedDraft && isOpen) {
      setCurrentStep(savedDraft.currentStep || 1);
      setSelectedOption(savedDraft.selectedOption || null);
      setFormData(savedDraft.formData || {
        therapistName: '',
        city: '',
        specialization: '',
        relationship: '',
        credentials: [],
        website: '',
        address: '',
        state: '',
        zipcode: '',
        profilePhoto: null,
        profilePhotoName: '',
        review: '',
        rating: 0,
        acceptTerms: false
      });
    }
  }, [savedDraft, isOpen]);

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (selectedOption === 'therapist') {
        // Submit therapist profile
        const isAnonymous = identityOption === 'anonymous';
        // Convert credentials array to comma-separated string
        const therapistData = {
          ...formData,
          credentials: Array.isArray(formData.credentials) ? formData.credentials.join(', ') : formData.credentials,
          selectedOption: selectedOption
        };
        const result = await therapistService.createTherapist(therapistData, isAnonymous);
        
        if (result) {
          // Clear any saved draft
          therapistService.clearTherapistDraft();
          
          setIsSubmitting(false);
          
          // Reset form state before closing
          setCurrentStep(1);
          setSelectedOption(null);
          setIdentityOption(null);
          setFormData({
            therapistName: '',
            city: '',
            specialization: '',
            relationship: '',
            credentials: [],
            website: '',
            address: '',
            state: '',
            zipcode: '',
            profilePhoto: null,
            review: '',
            rating: 0,
            acceptTerms: false
          });
          
          handleModalClose();
          setShowNotification(true);
          
          // Refresh the page after a delay to show the new therapist
          setTimeout(() => {
            router.refresh();
          }, 2000);
        }
      } else {
        // Handle user recommendation
        const therapistData = {
          ...formData,
          selectedOption: selectedOption
        };
        const result = await therapistService.createTherapist(therapistData, false);
        
        if (result && result.id) {
          // If user left a review in step 4, submit it
          if (formData.review && formData.rating > 0) {
            try {
              await reviewService.submitReview(
                result.id,
                formData.review,
                formData.rating,
                identityOption === 'anonymous',
                user
              );
            } catch (reviewError) {
              console.error('Error submitting review:', reviewError);
              // Continue even if review fails
            }
          }
          
          // Clear any saved draft
          therapistService.clearTherapistDraft();
          
          setIsSubmitting(false);
          
          // Reset form state before closing
          setCurrentStep(1);
          setSelectedOption(null);
          setIdentityOption(null);
          setFormData({
            therapistName: '',
            city: '',
            specialization: '',
            relationship: '',
            credentials: [],
            website: '',
            address: '',
            state: '',
            zipcode: '',
            profilePhoto: null,
            profilePhotoName: '',
            review: '',
            rating: 0,
            acceptTerms: false
          });
          
          handleModalClose();
          setShowNotification(true);
          
          // Refresh the page after a delay to show the new therapist
          setTimeout(() => {
            router.refresh();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error submitting:', error);
      setIsSubmitting(false);
      alert('Error submitting therapist profile. Please try again.');
    }
  };

  const handleModalClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      // Only reset if there's no saved draft
      if (!savedDraft) {
        setCurrentStep(1);
        setSelectedOption(null);
        setIdentityOption(null);
        setFormData({
          therapistName: '',
          city: '',
          specialization: '',
          relationship: '',
          credentials: [],
          website: '',
          address: '',
          state: '',
          zipcode: '',
          profilePhoto: null,
          profilePhotoName: '',
          review: '',
          rating: 0,
          acceptTerms: false
        });
      }
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
        // Handle identity choice for therapist
        if (identityOption === 'registered' && !user) {
          // Save complete wizard state
          therapistService.saveTherapistDraft({
            formData: formData,
            currentStep: 3,
            selectedOption: selectedOption
          });
          
          // Use current page location for return URL
          const currentPath = window.location.pathname + window.location.search;
          const returnUrl = `${currentPath}${currentPath.includes('?') ? '&' : '?'}openTherapist=true`;
          router.push(`/register?returnTo=${encodeURIComponent(returnUrl)}`);
        } else {
          // Submit directly (anonymous or already logged in)
          handleSubmit();
        }
      } else {
        // Handle identity choice for user recommending therapist
        if (identityOption === 'registered' && !user) {
          // Save complete wizard state
          therapistService.saveTherapistDraft({
            formData: formData,
            currentStep: 3,
            selectedOption: selectedOption
          });
          
          // Use current page location for return URL
          const currentPath = window.location.pathname + window.location.search;
          const returnUrl = `${currentPath}${currentPath.includes('?') ? '&' : '?'}openTherapist=true`;
          router.push(`/register?returnTo=${encodeURIComponent(returnUrl)}`);
        } else {
          handleNext();
        }
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
            user={user}
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
                {currentStep === 3 && selectedOption === 'therapist' ? (
                  isSubmitting ? "Submitting..." : (
                    identityOption === 'registered' && !user ? "Continue to Register" : "Submit"
                  )
                ) : getButtonText(currentStep, selectedOption, isSubmitting)}
              </span>
            </button>
          </div>
        }
      >
        <StepIndicators currentStep={currentStep} selectedOption={selectedOption} />
        
        {renderStepContent()}
      </ModalWrapper>
      
      <NotificationToast
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
        message={selectedOption === 'therapist'
          ? "Therapist profile created successfully!"
          : "Therapist recommendation submitted successfully!"}
        subtitle={selectedOption === 'therapist'
          ? "Your profile will be reviewed and published soon"
          : "Thank you for your recommendation"}
        type="success"
        duration={4000}
      />
    </>
  );
}