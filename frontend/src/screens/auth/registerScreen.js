import { useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { register } from '../../api';
import AuthForm from '../../components/forms/domains/auth/authForm';
import mapAuthErrors from '../../utils/mapAuthErrors';
import handleApiError from '../../utils/handleApiError';
import { AuthContext } from '../../context/authContext';
import AppScreen from '../../components/common/AppScreen';
import { colors, spacing, typography } from '../../theme/theme';

export default function RegisterScreen() {
  const { login, authenticating } = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const initialValues = {
    name: '',
    email: '',
    password: '',
  };

  const handleRegister = async (formData) => {
    try {
      setErrors({});
      await register(formData);
      await login(formData.email, formData.password);
    } catch (error) {
      handleApiError(error, setErrors, mapAuthErrors);
    }
  };

  return (
    <AppScreen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Job Tracker</Text>

        <Text style={styles.title}>Create account</Text>

        <Text style={styles.subtitle}>
          Start tracking jobs, interviews, and hiring progress.
        </Text>
      </View>

      <AuthForm
        initialValues={initialValues}
        onSubmit={handleRegister}
        submitLabel="Register"
        loading={authenticating}
        errors={errors}
        isRegister
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  eyebrow: {
    color: colors.green,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: colors.text,
    fontSize: 36,
    fontWeight: '900',
    marginTop: spacing.sm,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    marginTop: spacing.sm,
    lineHeight: 24,
  },
});