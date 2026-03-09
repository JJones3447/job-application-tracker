import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import FormField from './formField';

const JobForm = ({ onSubmit, initialValues = {}, submitLabel }) => {
  const [formData, setFormData] = useState({
    companyName: initialValues.companyName || '',
    jobTitle: initialValues.jobTitle || '',
    location: initialValues.location || '',
    salaryRange: initialValues.salaryRange || '',
    jobDescription: initialValues.jobDescription || '',
    applicationDate: initialValues.applicationDate || '',
    status: initialValues.status || 'Applied',
  });

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <View>
      <FormField
        label="Company Name"
        value={formData.companyName}
        onChange={(text) => updateField('companyName', text)}
      />
      <FormField
        label="Job Title"
        value={formData.jobTitle}
        onChange={(text) => updateField('jobTitle', text)}
      />
      <FormField
        label="Location"
        value={formData.location}
        onChange={(text) => updateField('location', text)}
      />
      <FormField
        label="Salary Range"
        value={formData.salaryRange}
        onChange={(text) => updateField('salaryRange', text)}
      />
      <FormField
        label="Application Date (YYYY-MM-DD)"
        value={formData.applicationDate}
        onChange={(text) => updateField('applicationDate', text)}
      />
      <FormField
        label="Job Description"
        value={formData.jobDescription}
        onChange={(text) => updateField('jobDescription', text)}
        multiline
      />
      <FormField
        label="Status"
        value={formData.status}
        onChange={(text) => updateField('status', text)}
      />
      <Button title={submitLabel} onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default JobForm;