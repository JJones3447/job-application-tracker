import { Platform, StyleSheet, Text, View } from 'react-native';
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
        doneText="Done"
        fixAndroidTouchableBug
        pickerProps={{
          itemStyle: {
            color: colors.text,
            fontSize: typography.body,
          },
        }}
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
          inputIOSContainer: {
            pointerEvents: 'none',
          },
          placeholder: {
            color: colors.textMuted,
          },
          modalViewMiddle: {
            backgroundColor: colors.surfaceElevated,
          },
          modalViewBottom: {
            backgroundColor: colors.surfaceElevated,
          },
          done: {
            color: colors.green,
            fontWeight: '800',
          },
        }}
        Icon={
          Platform.OS === 'ios'
            ? () => <Text style={styles.chevron}>⌄</Text>
            : undefined
        }
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
    paddingRight: spacing.xl,
  },
  inputError: {
    borderColor: colors.danger,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 20,
    paddingRight: spacing.md,
    paddingTop: spacing.md,
  },
  error: {
    color: colors.danger,
    fontSize: typography.small,
    marginTop: spacing.xs,
  },
});