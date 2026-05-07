import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import AppButton from '../../../common/AppButton';
import Card from '../../../common/Card';
import FormField from '../formField';
import FormDatePicker from '../formDatePicker';
import FormSelect from '../formSelect';
import { JOB_STATUS_OPTIONS } from '../../../../constants/formOptions';
import useFormValidation from '../../../../hooks/useFormValidation';
import { colors, spacing, typography } from '../../../../theme/theme';

const isValidUrl = value => {
  if (!value?.trim()) return true;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const isValidDate = value => {
  if (!value) return true;

  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(new Date(value).getTime())
  );
};

const jobValidators = {
  companyName: value => {
    if (!value?.trim()) return 'Company name is required.';
    if (value.trim().length > 100) return 'Company name cannot exceed 100 characters.';
    return undefined;
  },

  jobTitle: value => {
    if (!value?.trim()) return 'Job title is required.';
    if (value.trim().length > 100) return 'Job title cannot exceed 100 characters.';
    return undefined;
  },

  listedSalary: value => {
    if (value && value.length > 50) return 'Listed salary cannot exceed 50 characters.';
    return undefined;
  },

  location: value => {
    if (value && value.length > 100) return 'Location cannot exceed 100 characters.';
    return undefined;
  },

  technologies: value => {
    if (value && typeof value !== 'string') return 'Technologies must be text.';
    return undefined;
  },

  jobURL: value => {
    if (!isValidUrl(value)) return 'Job URL must be a valid URL.';
    return undefined;
  },

  applicationDate: value => {
    if (!isValidDate(value)) return 'Application date must use YYYY-MM-DD format.';
    return undefined;
  },

  status: value => {
    const validStatuses = JOB_STATUS_OPTIONS.map(option => option.value);

    if (value && !validStatuses.includes(value)) {
      return 'Please select a valid status.';
    }

    return undefined;
  },

  notes: value => {
    if (value && typeof value !== 'string') return 'Notes must be text.';
    return undefined;
  },
};

const JobForm = ({
  onSubmit,
  initialValues = {},
  submitLabel,
  loading = false,
  errors = {},
}) => {
  const {
    formData,
    resetForm,
    errors: validationErrors,
    handleChange,
    handleBlur,
    validateForm,
    shouldShowError,
  } = useFormValidation(
    {
      companyName: '',
      jobTitle: '',
      listedSalary: '',
      location: '',
      technologies: '',
      jobURL: '',
      applicationDate: '',
      status: 'Applied',
      notes: '',
    },
    jobValidators
  );

  useEffect(() => {
    resetForm({
      companyName: initialValues.companyName ?? '',
      jobTitle: initialValues.jobTitle ?? '',
      listedSalary: initialValues.listedSalary ?? '',
      location: initialValues.location ?? '',
      technologies: initialValues.technologies ?? '',
      jobURL: initialValues.jobURL ?? '',
      applicationDate: initialValues.applicationDate ?? '',
      status: initialValues.status ?? 'Applied',
      notes: initialValues.notes ?? '',
    });
  }, [initialValues]);

  const combinedErrors = {
    ...validationErrors,
    ...errors,
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit({
      ...formData,
      companyName: formData.companyName.trim(),
      jobTitle: formData.jobTitle.trim(),
      listedSalary: formData.listedSalary?.trim() || '',
      location: formData.location?.trim() || '',
      technologies: formData.technologies?.trim() || '',
      jobURL: formData.jobURL?.trim() || '',
      applicationDate: formData.applicationDate || null,
      status: formData.status,
      notes: formData.notes?.trim() || '',
    });
  };

  return (
    <Card>
      <FormField
        label="Company Name"
        value={formData.companyName}
        onChange={text => handleChange('companyName', text)}
        onBlur={() => handleBlur('companyName')}
        placeholder="Company name"
        error={shouldShowError('companyName') || combinedErrors.companyName}
      />
      <FormField
        label="Job Title"
        value={formData.jobTitle}
        onChange={text => handleChange('jobTitle', text)}
        onBlur={() => handleBlur('jobTitle')}
        placeholder="Software Engineer"
        error={shouldShowError('jobTitle') || combinedErrors.jobTitle}
      />
      <FormField
        label="Listed Salary"
        value={formData.listedSalary}
        onChange={text => handleChange('listedSalary', text)}
        onBlur={() => handleBlur('listedSalary')}
        placeholder="$80,000 - $100,000"
        error={shouldShowError('listedSalary') || combinedErrors.listedSalary}
      />
      <FormField
        label="Location"
        value={formData.location}
        onChange={text => handleChange('location', text)}
        onBlur={() => handleBlur('location')}
        placeholder="Remote, Chicago, IL, etc."
        error={shouldShowError('location') || combinedErrors.location}
      />
      <FormField
        label="Technologies"
        value={formData.technologies}
        onChange={text => handleChange('technologies', text)}
        onBlur={() => handleBlur('technologies')}
        placeholder="React, Node.js, MySQL"
        error={shouldShowError('technologies') || combinedErrors.technologies}
      />
      <FormField
        label="Job URL"
        value={formData.jobURL}
        onChange={text => handleChange('jobURL', text)}
        onBlur={() => handleBlur('jobURL')}
        autoCapitalize="none"
        keyboardType="url"
        placeholder="https://example.com/job-posting"
        error={shouldShowError('jobURL') || combinedErrors.jobURL}
      />
      <FormDatePicker
        label="Application Date"
        value={formData.applicationDate}
        onChange={value => handleChange('applicationDate', value)}
        error={shouldShowError('applicationDate') || combinedErrors.applicationDate}
      />
      <FormSelect
        label="Status"
        value={formData.status}
        onChange={value => handleChange('status', value)}
        onBlur={() => handleBlur('status')}
        items={JOB_STATUS_OPTIONS}
        error={shouldShowError('status') || combinedErrors.status}
      />
      <FormField
        label="Notes"
        value={formData.notes}
        onChange={text => handleChange('notes', text)}
        onBlur={() => handleBlur('notes')}
        multiline
        placeholder="Add notes about the role..."
        error={shouldShowError('notes') || combinedErrors.notes}
      />
      {combinedErrors.general ? (
        <Text style={styles.generalError}>{combinedErrors.general}</Text>
      ) : null}
      <AppButton
        title={loading ? 'Submitting...' : submitLabel}
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  generalError: {
    color: colors.danger,
    fontSize: typography.small,
    marginBottom: spacing.md,
  },
});

export default JobForm;