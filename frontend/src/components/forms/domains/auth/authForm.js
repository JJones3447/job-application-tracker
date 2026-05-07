import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import AppButton from '../../../common/AppButton';
import Card from '../../../common/Card';
import { colors, radius, spacing, typography } from '../../../../theme/theme';

export default function AuthForm({
  initialValues,
  onSubmit,
  submitLabel,
  loading = false,
  errors = {},
  isRegister = false,
}) {
  const [formData, setFormData] = useState(initialValues);
  const [localErrors, setLocalErrors] = useState({});

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setLocalErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (isRegister) {
      if (!formData.name?.trim()) {
        newErrors.name = 'Name is required.';
      } else if (formData.name.length > 100) {
        newErrors.name = 'Name cannot exceed 100 characters.';
      }
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setLocalErrors(validationErrors);
      return;
    }
    setLocalErrors({});
    onSubmit(formData);
  };

  const combinedErrors = {
    ...errors,
    ...localErrors,
  };

  const renderError = field =>
    combinedErrors[field] ? (
      <Text style={styles.error}>{combinedErrors[field]}</Text>
    ) : null;

  return (
    <Card>
      {isRegister ? (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={formData.name}
            onChangeText={text => handleChange('name', text)}
            style={[styles.input, combinedErrors.name && styles.inputError]}
            placeholder="Your name"
            placeholderTextColor={colors.textMuted}
          />
          {renderError('name')}
        </View>
      ) : null}

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={formData.email}
          onChangeText={text => handleChange('email', text)}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[styles.input, combinedErrors.email && styles.inputError]}
          placeholder="you@example.com"
          placeholderTextColor={colors.textMuted}
        />
        {renderError('email')}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          value={formData.password}
          onChangeText={text => handleChange('password', text)}
          secureTextEntry
          style={[styles.input, combinedErrors.password && styles.inputError]}
          placeholder="••••••••"
          placeholderTextColor={colors.textMuted}
        />
        {renderError('password')}
      </View>
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
  fieldGroup: {
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
  generalError: {
    color: colors.danger,
    fontSize: typography.small,
    marginBottom: spacing.md,
  },
});