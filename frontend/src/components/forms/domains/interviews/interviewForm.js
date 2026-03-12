import React, { useState } from 'react';
import { View, Button, } from 'react-native';
import FormField from '../formField';
import FormDatePicker from '../formDatePicker';
import FormSelect from '../formSelect';
import {
  INTERVIEW_TYPES,
  INTERVIEW_RESULTS,
  HOUR_OPTIONS,
  MINUTE_OPTIONS,
  PERIOD_OPTIONS,
} from '../../../../constants/formOptions';

const buildISODate = (date, hour, minute, period) => {
  let h = parseInt(hour);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;

  const [year, month, day] = date.split('-').map(Number);
  const localDate = new Date(year, month - 1, day, h, parseInt(minute), 0);  

  return localDate.toISOString();
};

const InterviewForm = ({ onSubmit, initialValues = {}, submitLabel }) => {
  const [date, setDate] = useState(
    initialValues.interviewDate
      ? new Date(initialValues.interviewDate).toISOString().split('T')[0]
      : ''
  );

  const [hour, setHour] = useState('9');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');

  const [formData, setFormData] = useState({
    interviewType: initialValues.interviewType || 'Phone',
    result: initialValues.result || 'Pending',
    interviewNotes: initialValues.interviewNotes || '',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const interviewDate = buildISODate(date, hour, minute, period);
    const payload = {
      interviewDate,
      interviewType: formData.interviewType,
      result: formData.result,
      interviewNotes: formData.interviewNotes,
    };
    console.log("Payload: ", payload);
    onSubmit(payload);
  };

  return (
    <View>
      <FormDatePicker
        label="Interview Date"
        value={date}
        onChange={setDate}
      />
      <FormSelect
        label="Hour"
        value={hour}
        onChange={setHour}
        items={HOUR_OPTIONS}
      />
      <FormSelect
        label="Minute"
        value={minute}
        onChange={setMinute}
        items={MINUTE_OPTIONS}
      />
      <FormSelect
        label="AM / PM"
        value={period}
        onChange={setPeriod}
        items={PERIOD_OPTIONS}
      />
      <FormSelect
        label="Interview Type"
        value={formData.interviewType}
        onChange={value => updateField('interviewType', value)}
        items={INTERVIEW_TYPES}
      />
      <FormSelect
        label="Result"
        value={formData.result}
        onChange={value => updateField('result', value)}
        items={INTERVIEW_RESULTS}
      />
      <FormField
        label="Notes"
        value={formData.interviewNotes}
        onChange={text => updateField('interviewNotes', text)}
        multiline
      />
      <Button title={submitLabel} onPress={handleSubmit} />
    </View>
  );
};

export default InterviewForm;