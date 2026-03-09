import React, { useState } from 'react';
import { View, Button } from 'react-native';
import FormField from './formField';

const pad = (n) => String(n).padStart(2, '0');

const formatLocalDateTime = (date) => {
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds())
  );
};

const InterviewForm = ({ onSubmit, initialValues = {}, submitLabel }) => {
  const [formData, setFormData] = useState({
    interviewDate: initialValues.interviewDate || '',
    interviewType: initialValues.interviewType || 'Phone',
    interviewNotes: initialValues.interviewNotes || '',
    result: initialValues.result || 'Pending',
  });

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    const finalDate = new Date(formData.interviewDate);

    const payload = {
      interviewDate: formatLocalDateTime(finalDate),
      interviewType: formData.interviewType,
      interviewNotes: formData.interviewNotes,
      result: formData.result,
    };

    onSubmit(payload);
  };

  return (
    <View>
      <FormField
        label="Interview Date (YYYY-MM-DDTHH:MM)"
        value={formData.interviewDate}
        onChange={(text) => updateField('interviewDate', text)}
      />
      <FormField
        label="Interview Type"
        value={formData.interviewType}
        onChange={(text) => updateField('interviewType', text)}
      />
      <FormField
        label="Result"
        value={formData.result}
        onChange={(text) => updateField('result', text)}
      />
      <FormField
        label="Notes"
        value={formData.interviewNotes}
        onChange={(text) => updateField('interviewNotes', text)}
        multiline
      />
      <Button title={submitLabel} onPress={handleSubmit} />
    </View>
  );
};

export default InterviewForm;