import { StyleSheet, Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { colors, radius, spacing, typography } from '../../../theme/theme';

export default function FormSelect({
  label,
  value,
  onChange,
  onBlur,
  items,
  error,
  placeholder = {},
}) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <RNPickerSelect
        value={value}
        onValueChange={onChange}
        onClose={onBlur}
        items={items}
        placeholder={placeholder}
        useNativeAndroidPickerStyle={false}
        style={{
          inputIOS: {
            ...styles.input,
            ...(error ? styles.inputError : {}),
          },
          inputAndroid: {
            ...styles.input,
            ...(error ? styles.inputError : {}),
          },
          inputWeb: {
            ...styles.input,
            ...(error ? styles.inputError : {}),
          },
          placeholder: {
            color: colors.textMuted,
          },
        }}
      />
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
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    fontSize: typography.small,
    marginTop: spacing.xs,
  },
});