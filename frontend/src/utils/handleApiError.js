import Toast from 'react-native-toast-message';

export default function handleApiError(error, setErrors, mapper) {
  const hasValidationDetails =
    Array.isArray(error?.details) && error.details.length > 0;

  if (hasValidationDetails && typeof setErrors === 'function' && mapper) {
    setErrors(mapper(error.details));
    return;
  }

  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: error?.message || 'Something went wrong',
  });
}