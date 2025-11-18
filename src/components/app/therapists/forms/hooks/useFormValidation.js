export default function useFormValidation() {
  const validateStep2 = (selectedOption, formData) => {
    if (selectedOption === 'user') {
      const { therapistName, city, relationship } = formData;
      return therapistName && city && relationship;
    } else if (selectedOption === 'therapist') {
      const { therapistName, credentials, address, city, state, zipcode } = formData;
      const hasCredentials = Array.isArray(credentials) ? credentials.length > 0 : !!credentials;
      return therapistName && hasCredentials && address && city && state && zipcode;
    }
    return false;
  };

  const isButtonDisabled = (currentStep, selectedOption, formData, identityOption, isSubmitting) => {
    if (currentStep === 1 && !selectedOption) return true;
    if (currentStep === 2 && !validateStep2(selectedOption, formData)) return true;
    if (currentStep === 3 && !identityOption) return true;
    if (currentStep === 4) {
      // Review step validation: require rating, review content (min 10 chars), and terms acceptance
      if (!formData.rating || !formData.review || formData.review.trim().length < 10 || !formData.acceptTerms) {
        return true;
      }
    }
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