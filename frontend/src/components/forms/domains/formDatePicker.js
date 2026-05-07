import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View,} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, radius, spacing, typography } from '../../../theme/theme';

const formatLocalDate = date => {
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const parseLocalDate = value => {
  if (!value) return new Date();

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(year, month - 1, day);
};

export default function FormDatePicker({ label, value, onChange, error }) {
  const [show, setShow] = useState(false);

  const handleNativeChange = (event, selectedDate) => {
    setShow(false);

    if (selectedDate) {
      onChange(formatLocalDate(selectedDate));
    }
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {Platform.OS === 'web' ? (
        <TextInput
          value={value}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textMuted}
          onChangeText={onChange}
          style={[styles.input, error && styles.inputError]}
          autoCapitalize="none"
        />
      ) : (
        <>
          <Pressable
            onPress={() => setShow(true)}
            style={({ pressed }) => [
              styles.dateButton,
              error && styles.inputError,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.dateButtonText, !value && styles.placeholder]}>
              {value || 'Select Date'}
            </Text>
          </Pressable>

          {show ? (
            <DateTimePicker
              value={parseLocalDate(value)}
              mode="date"
              display="default"
              onChange={handleNativeChange}
            />
          ) : null}
        </>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  input: {
    minHeight: 48,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.text,
    fontSize: typography.body,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dateButton: {
    minHeight: 48,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  dateButtonText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  placeholder: {
    color: colors.textMuted,
  },
  inputError: {
    borderColor: colors.danger,
  },
  pressed: {
    opacity: 0.82,
  },
  error: {
    color: colors.danger,
    fontSize: typography.small,
    marginTop: spacing.xs,
  },
});