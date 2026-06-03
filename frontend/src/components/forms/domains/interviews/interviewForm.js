import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AppButton from '../../../common/AppButton';
import Card from '../../../common/Card';
import FormDatePicker from '../formDatePicker';
import FormField from '../formField';
import FormSelect from '../formSelect';
import {
  HOUR_OPTIONS,
  INTERVIEW_RESULTS,
  INTERVIEW_TYPES,
  MINUTE_OPTIONS,
  PERIOD_OPTIONS,
} from '../../../../constants/formOptions';
import useFormValidation from '../../../../hooks/useFormValidation';
import { colors, spacing, typography } from '../../../../theme/theme';

const buildISODate = (date, hour, minute, period) => {
  if (!date) return null;

  const [year, month, day] = date.split('-').map(Number);

  let parsedHour = parseInt(hour, 10);

  if (period === 'PM' && parsedHour !== 12) parsedHour += 12;
  if (period === 'AM' && parsedHour === 12) parsedHour = 0;

  const localDate = new Date(
    year,
    month - 1,
    day,
    parsedHour,
    Number(minute),
    0
  );

  return localDate.toISOString().replace('.000Z', 'Z');
};

const extractDate = isoString => {
  if (!isoString) return '';

  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const extractTime = isoString => {
  if (!isoString) return { hour: '9', minute: '00', period: 'AM' };

  const date = new Date(isoString);
  let hours = date.getHours();

  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;

  return {
    hour: String(hours),
    minute: minutes,
    period,
  };
};

const isValidDate = value => {
  if (!value) return false;

  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(new Date(value).getTime())
  );
};

const interviewValidators = {
  date: value => {
    if (!value) return 'Interview date is required.';

    if (!isValidDate(value)) {
      return 'Interview date must use YYYY-MM-DD format.';
    }

    return undefined;
  },

  interviewType: value => {
    const validTypes = INTERVIEW_TYPES.map(option => option.value);

    if (!value) return 'Interview type is required.';

    if (!validTypes.includes(value)) {
      return 'Please select a valid interview type.';
    }

    return undefined;
  },

  result: value => {
    const validResults = INTERVIEW_RESULTS.map(option => option.value);

    if (value && !validResults.includes(value)) {
      return 'Please select a valid result.';
    }

    return undefined;
  },

  interviewNotes: value => {
    if (value && typeof value !== 'string') {
      return 'Interview notes must be text.';
    }

    return undefined;
  },
};

export default function InterviewForm({
  onSubmit,
  initialValues = {},
  submitLabel,
  loading = false,
  errors = {},
}) {
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
      date: '',
      hour: '9',
      minute: '00',
      period: 'AM',
      interviewType: 'Phone',
      result: 'Pending',
      interviewNotes: '',
    },
    interviewValidators
  );

  useEffect(() => {
    let date = '';
    let hour = '9';
    let minute = '00';
    let period = 'AM';

    if (initialValues.interviewDate) {
      date = extractDate(initialValues.interviewDate);

      const time = extractTime(initialValues.interviewDate);

      hour = time.hour;
      minute = time.minute;
      period = time.period;
    }

    resetForm({
      date,
      hour,
      minute,
      period,
      interviewType: initialValues.interviewType || 'Phone',
      result: initialValues.result || 'Pending',
      interviewNotes: initialValues.interviewNotes || '',
    });
  }, [initialValues]);

  const combinedErrors = {
    ...validationErrors,
    ...errors,
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const interviewDate = buildISODate(
      formData.date,
      formData.hour,
      formData.minute,
      formData.period
    );

    onSubmit({
      interviewDate,
      interviewType: formData.interviewType,
      result: formData.result,
      interviewNotes: formData.interviewNotes?.trim() || '',
    });
  };

  return (
    <Card>
      <FormDatePicker
        label="Interview Date"
        value={formData.date}
        onChange={value => handleChange('date', value)}
        error={shouldShowError('date') || combinedErrors.interviewDate}
      />

      <View style={styles.timeRow}>
        <View style={styles.timeItem}>
          <FormSelect
            label="Hour"
            value={formData.hour}
            onChange={value => handleChange('hour', value)}
            items={HOUR_OPTIONS}
          />
        </View>

        <View style={styles.timeItem}>
          <FormSelect
            label="Minute"
            value={formData.minute}
            onChange={value => handleChange('minute', value)}
            items={MINUTE_OPTIONS}
          />
        </View>

        <View style={styles.timeItem}>
          <FormSelect
            label="AM / PM"
            value={formData.period}
            onChange={value => handleChange('period', value)}
            items={PERIOD_OPTIONS}
          />
        </View>
      </View>

      <FormSelect
        label="Interview Type"
        value={formData.interviewType}
        onChange={value => handleChange('interviewType', value)}
        onBlur={() => handleBlur('interviewType')}
        items={INTERVIEW_TYPES}
        error={shouldShowError('interviewType') || combinedErrors.interviewType}
      />

      <FormSelect
        label="Result"
        value={formData.result}
        onChange={value => handleChange('result', value)}
        onBlur={() => handleBlur('result')}
        items={INTERVIEW_RESULTS}
        error={shouldShowError('result') || combinedErrors.result}
      />

      <FormField
        label="Notes"
        value={formData.interviewNotes}
        onChange={text => handleChange('interviewNotes', text)}
        onBlur={() => handleBlur('interviewNotes')}
        multiline
        placeholder="Add interview notes..."
        error={
          shouldShowError('interviewNotes') || combinedErrors.interviewNotes
        }
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
}

const styles = StyleSheet.create({
  timeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timeItem: {
    flex: 1,
  },
  generalError: {
    color: colors.danger,
    fontSize: typography.small,
    marginBottom: spacing.md,
  },
});