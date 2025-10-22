export default function useFormValidation() {
  const validateStep2 = (selectedOption, formData) => {
    if (selectedOption === 'user') {
      const { therapistName, city, specialization, relationship } = formData;
      return therapistName && city && specialization && relationship;
    } else if (selectedOption === 'therapist') {
      const { therapistName, credentials, address, city, state, zipcode } = formData;
      return therapistName && credentials && address && city && state && zipcode;
    }
    return false;
  };

  const isButtonDisabled = (currentStep, selectedOption, formData, identityOption, isSubmitting) => {
    if (currentStep === 1 && !selectedOption) return true;
    if (currentStep === 2 && !validateStep2(selectedOption, formData)) return true;
    if (currentStep === 3 && !identityOption) return true;
    if (currentStep === 4 && formData.review && !formData.acceptTerms) return true;
    if (isSubmitting) return true;
    return false;
  };

  const getButtonText = (currentStep, selectedOption, isSubmitting) => {
    if (isSubmitting) return 'Submitting...';
    if ((currentStep === 3 && selectedOption === 'therapist') || currentStep === 4) {
      return 'Submit';
    }
    return 'Continue';
  };

  return {
    validateStep2,
    isButtonDisabled,
    getButtonText
  };
}