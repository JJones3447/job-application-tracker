import { useState } from 'react';

const useFormValidation = (initialState, requiredFields = []) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateField = (field, value) => {
    let message = '';

    if (requiredFields.includes(field)) {
      if (!value || value.trim?.() === '') {
        message = 'This field is required';
      }
    }

    setErrors(prev => ({
      ...prev,
      [field]: message,
    }));

    return !message;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));

    validateField(field, formData[field]);
  };

  const validateForm = () => {
    let isValid = true;
    setIsSubmitted(true);

    requiredFields.forEach(field => {
      const valid = validateField(field, formData[field]);
      if (!valid) isValid = false;
    });

    return isValid;
  };

  const shouldShowError = (field) => {
    return (touched[field] || isSubmitted) && errors[field];
  };

  return {
    formData,
    setFormData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    shouldShowError,
  };
};

export default useFormValidation;