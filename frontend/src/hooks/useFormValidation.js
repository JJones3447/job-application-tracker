import { useState } from 'react';

export default function useFormValidation(initialState, validators = {}) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateField = (field, value, allValues = formData) => {
    const validator = validators[field];

    if (!validator) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
      return true;
    }

    const message = validator(value, allValues);

    setErrors(prev => ({
      ...prev,
      [field]: message || undefined,
    }));

    return !message;
  };

  const handleChange = (field, value) => {
    const nextData = {
      ...formData,
      [field]: value,
    };

    setFormData(nextData);

    if (touched[field] || isSubmitted) {
      validateField(field, value, nextData);
    }
  };

  const handleBlur = field => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));

    validateField(field, formData[field]);
  };

  const validateForm = () => {
    setIsSubmitted(true);

    let isValid = true;
    const nextErrors = {};

    Object.keys(validators).forEach(field => {
      const message = validators[field](formData[field], formData);

      if (message) {
        nextErrors[field] = message;
        isValid = false;
      }
    });

    setErrors(nextErrors);

    return isValid;
  };

  const shouldShowError = field => {
    return touched[field] || isSubmitted ? errors[field] : undefined;
  };

  const resetForm = nextState => {
    setFormData(nextState);
    setErrors({});
    setTouched({});
    setIsSubmitted(false);
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
    resetForm,
  };
}