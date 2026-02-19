import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, ActivityIndicator, Platform} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function InterviewForm({
  initialValues,
  onSubmit,
  submitLabel = 'Submit',
  loading = false,
  errors = {},
}) {
  const [formData, setFormData] = useState(initialValues);
  const [localErrors, setLocalErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setLocalErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleDateChange = (_, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) handleChange('interviewDate', selectedDate);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.interviewDate) {
      newErrors.interviewDate = 'Interview date is required.';
    }

    const validTypes = [
      'Phone',
      'Technical',
      'HR',
      'Behavioral',
      'On-site',
      'Other',
    ];

    if (!formData.interviewType || !validTypes.includes(formData.interviewType)) {
      newErrors.interviewType = 'Invalid interview type selected.';
    }

    const validResults = [
      'Pending',
      'Passed',
      'Failed',
      'Offer Extended',
    ];

    if (formData.result && !validResults.includes(formData.result)) {
      newErrors.result = 'Invalid interview result selected.';
    }

    return newErrors;
  };

  const normalizePayload = () => {
    return {
      ...formData,
      interviewDate: formData.interviewDate.toISOString(),
    };
  };

  const handleSubmit = () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setLocalErrors(validationErrors);
      return;
    }

    setLocalErrors({});
    onSubmit(normalizePayload());
  };

  if (!formData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  const combinedErrors = { ...localErrors, ...errors };
  const renderError = field =>
    combinedErrors[field] ? (
      <Text style={{ color: 'red', marginBottom: 8 }}>
        {combinedErrors[field]}
      </Text>
    ) : null;

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Interview Date *</Text>
      {Platform.OS === 'web' ? (
        <TextInput
          value={formData.interviewDate.toISOString()}
          onChangeText={text =>
            handleChange('interviewDate', new Date(text))
          }
        />
      ) : (
        <>
          <Button
            title={formData.interviewDate.toLocaleString()}
            onPress={() => setShowDatePicker(true)}
          />
          {showDatePicker && (
            <DateTimePicker
              value={formData.interviewDate}
              mode="datetime"
              onChange={handleDateChange}
            />
          )}
        </>
      )}
      {renderError('interviewDate')}
      <Text>Interview Type *</Text>
      <Picker
        selectedValue={formData.interviewType}
        onValueChange={value =>
          handleChange('interviewType', value)
        }
      >
        <Picker.Item label="Phone" value="Phone" />
        <Picker.Item label="Technical" value="Technical" />
        <Picker.Item label="HR" value="HR" />
        <Picker.Item label="Behavioral" value="Behavioral" />
        <Picker.Item label="On-site" value="On-site" />
        <Picker.Item label="Other" value="Other" />
      </Picker>
      {renderError('interviewType')}
      <Text>Result</Text>
      <Picker
        selectedValue={formData.result}
        onValueChange={value =>
          handleChange('result', value)
        }
      >
        <Picker.Item label="Pending" value="Pending" />
        <Picker.Item label="Passed" value="Passed" />
        <Picker.Item label="Failed" value="Failed" />
        <Picker.Item
          label="Offer Extended"
          value="Offer Extended"
        />
      </Picker>
      {renderError('result')}
      <Text>Interview Notes</Text>
      <TextInput
        value={formData.interviewNotes}
        onChangeText={text =>
          handleChange('interviewNotes', text)
        }
        multiline
      />
      {combinedErrors.general && (
        <Text style={{ color: 'red', marginVertical: 10 }}>
          {combinedErrors.general}
        </Text>
      )}
      <Button
        title={loading ? 'Saving…' : submitLabel}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
}