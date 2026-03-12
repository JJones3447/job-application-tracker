import React, { useState } from 'react';
import { View, Button } from 'react-native';
import FormField from '../formField';
import FormDatePicker from '../formDatePicker';
import FormSelect from '../formSelect';

const formatDate = date => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const JobForm = ({ onSubmit, initialValues = {}, submitLabel }) => {
  const [formData, setFormData] = useState({
    companyName: initialValues.companyName || '',
    jobTitle: initialValues.jobTitle || '',
    listedSalary: initialValues.listedSalary || '',
    location: initialValues.location || '',
    technologies: initialValues.technologies || '',
    jobURL: initialValues.jobURL || '',
    applicationDate: initialValues.applicationDate
      ? formatDate(initialValues.applicationDate)
      : '',
    status: initialValues.status || 'Applied',
    notes: initialValues.notes || '',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const payload = {
      ...formData,
      applicationDate: formData.applicationDate
        ? formatDate(formData.applicationDate)
        : null,
    };
    console.log("Payload: ", payload);
    onSubmit(payload);
  };

  return (
    <View>
      <FormField
        label="Company Name"
        value={formData.companyName}
        onChange={text => updateField('companyName', text)}
      />
      <FormField
        label="Job Title"
        value={formData.jobTitle}
        onChange={text => updateField('jobTitle', text)}
      />
      <FormField
        label="Listed Salary"
        value={formData.listedSalary}
        onChange={text => updateField('listedSalary', text)}
      />
      <FormField
        label="Location"
        value={formData.location}
        onChange={text => updateField('location', text)}
      />
      <FormField
        label="Technologies (comma separated)"
        value={formData.technologies}
        onChange={text => updateField('technologies', text)}
      />
      <FormField
        label="Job URL"
        value={formData.jobURL}
        onChange={text => updateField('jobURL', text)}
      />
      <FormDatePicker
        label="Application Date"
        value={formData.applicationDate}
        onChange={value => updateField('applicationDate', value)}
      />
      <FormSelect
        label="Status"
        value={formData.status}
        onChange={value => updateField('status', value)}
        items={[
          { label: 'Applied', value: 'Applied' },
          { label: 'Interviewing', value: 'Interviewing' },
          { label: 'Offer', value: 'Offer' },
          { label: 'Rejected', value: 'Rejected' },
          { label: 'Accepted', value: 'Accepted' },
        ]}
      />
      <FormField
        label="Notes"
        value={formData.notes}
        onChange={text => updateField('notes', text)}
        multiline
      />
      <Button title={submitLabel} onPress={handleSubmit} />
    </View>
  );
};

export default JobForm;