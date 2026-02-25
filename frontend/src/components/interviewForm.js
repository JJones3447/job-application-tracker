import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, ActivityIndicator, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import useFormValidation from '../hooks/useFormValidation';
import FormField from '../components/formField';

const InterviewForm = ({ onSubmit, initialValues = {} }) => {
  const isEditing = !!initialValues.interviewID;

  const initialState = {
    interviewDate: initialValues.interviewDate
      ? new Date(initialValues.interviewDate)
      : new Date(),
    dateString: '',
    timeString: '',
    interviewType: initialValues.interviewType || '',
    interviewNotes: initialValues.interviewNotes || '',
    result: initialValues.result || '',
  };

  const requiredFields =
    Platform.OS === 'web'
      ? ['interviewType', 'dateString', 'timeString', 'result']
      : ['interviewType', 'result'];

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
      const baseDate = formData.interviewDate;

      setFormData(prev => ({
        ...prev,
        dateString: baseDate.toISOString().split('T')[0],
        timeString: baseDate.toTimeString().slice(0, 5),
      }));
    }
  }, []);

  const normalizePayload = () => {
    const finalDate =
      Platform.OS === 'web'
        ? new Date(`${formData.dateString}T${formData.timeString}:00`)
        : formData.interviewDate;

    return {
      interviewDate:
        finalDate.toISOString().split('.')[0] + 'Z',
      interviewType: formData.interviewType,
      interviewNotes: formData.interviewNotes,
      result: formData.result,
    };
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSubmit(normalizePayload());
  };

  return (
    <View style={{ padding: 16 }}>
      <FormField
        label="Interview Type"
        value={formData.interviewType}
        onChange={text => handleChange('interviewType', text)}
        onBlur={() => handleBlur('interviewType')}
        error={shouldShowError('interviewType')}
      />
      {Platform.OS === 'web' ? (
        <>
          <FormField
            label="Date"
            value={formData.dateString}
            onChange={e => handleChange('dateString', e.target.value)}
            onBlur={() => handleBlur('dateString')}
            error={shouldShowError('dateString')}
            type="date"
          />
          <FormField
            label="Time"
            value={formData.timeString}
            onChange={e => handleChange('timeString', e.target.value)}
            onBlur={() => handleBlur('timeString')}
            error={shouldShowError('timeString')}
            type="time"
          />
        </>
      ) : (
        <>
          <Button
            title={formData.interviewDate.toLocaleString()}
            onPress={() => setShowPicker(true)}
          />
          {showPicker && (
            <DateTimePicker
              value={formData.interviewDate}
              mode="datetime"
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate)
                  handleChange('interviewDate', selectedDate);
              }}
            />
          )}
        </>
      )}
      <FormField
        label="Result"
        value={formData.result}
        onChange={text => handleChange('result', text)}
        onBlur={() => handleBlur('result')}
        error={shouldShowError('result')}
      />
      <Button
        title={isEditing ? 'Update Interview' : 'Create Interview'}
        onPress={handleSubmit}
      />
    </View>
  );
};

export default InterviewForm;