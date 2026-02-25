import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import useFormValidation from '../hooks/useFormValidation';
import FormField from '../components/formField';

const JobForm = ({ onSubmit, initialValues = {} }) => {
  const isEditing = !!initialValues.jobID;

  const initialState = {
    companyName: initialValues.companyName || '',
    jobTitle: initialValues.jobTitle || '',
    status: initialValues.status || '',
    applicationDate: initialValues.applicationDate
      ? new Date(initialValues.applicationDate)
      : new Date(),
    dateString: '',
  };

  const requiredFields =
    Platform.OS === 'web'
      ? ['companyName', 'jobTitle', 'dateString', 'status']
      : ['companyName', 'jobTitle', 'status'];

  const {
    formData,
    setFormData,
    handleChange,
    handleBlur,
    validateForm,
    shouldShowError,
  } = useFormValidation(initialState, requiredFields);

  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const baseDate = formData.applicationDate;

      setFormData(prev => ({
        ...prev,
        dateString: baseDate.toISOString().split('T')[0],
      }));
    }
  }, []);

  const normalizePayload = () => {
    const finalDate =
      Platform.OS === 'web'
        ? new Date(formData.dateString)
        : formData.applicationDate;

    return {
      companyName: formData.companyName,
      jobTitle: formData.jobTitle,
      status: formData.status,
      applicationDate:
        finalDate.toISOString().split('T')[0],
    };
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSubmit(normalizePayload());
  };

  return (
    <View style={{ padding: 16 }}>
      <FormField
        label="Company Name"
        value={formData.companyName}
        onChange={text => handleChange('companyName', text)}
        onBlur={() => handleBlur('companyName')}
        error={shouldShowError('companyName')}
      />
      <FormField
        label="Job Title"
        value={formData.jobTitle}
        onChange={text => handleChange('jobTitle', text)}
        onBlur={() => handleBlur('jobTitle')}
        error={shouldShowError('jobTitle')}
      />
      {Platform.OS === 'web' ? (
        <FormField
          label="Application Date"
          value={formData.dateString}
          onChange={e => handleChange('dateString', e.target.value)}
          onBlur={() => handleBlur('dateString')}
          error={shouldShowError('dateString')}
          type="date"
        />
      ) : (
        <>
          <Button
            title={formData.applicationDate.toDateString()}
            onPress={() => setShowPicker(true)}
          />
          {showPicker && (
            <DateTimePicker
              value={formData.applicationDate}
              mode="date"
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate)
                  handleChange('applicationDate', selectedDate);
              }}
            />
          )}
        </>
      )}
      <FormField
        label="Status"
        value={formData.status}
        onChange={text => handleChange('status', text)}
        onBlur={() => handleBlur('status')}
        error={shouldShowError('status')}
      />
      <Button
        title={isEditing ? 'Update Job' : 'Create Job'}
        onPress={handleSubmit}
      />
    </View>
  );
};

export default JobForm;