import { useContext, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import AppScreen from '../../components/common/AppScreen';
import AuthForm from '../../components/forms/domains/auth/authForm';
import { AuthContext } from '../../context/authContext';
import handleApiError from '../../utils/handleApiError';
import mapAuthErrors from '../../utils/mapAuthErrors';
import { colors, spacing, typography } from '../../theme/theme';

export default function LoginScreen({ navigation }) {
  const { login, authenticating } = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const initialValues = {
    email: '',
    password: '',
  };

  const handleLogin = async formData => {
    try {
      setErrors({});
      await login(formData.email, formData.password);
    } catch (error) {
      handleApiError(error, setErrors, mapAuthErrors);
    }
  };

  return (
    <AppScreen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Job Tracker</Text>

        <Text style={styles.title}>Log in</Text>

        <Text style={styles.subtitle}>
          Continue managing your applications and interviews.
        </Text>
      </View>

      <AuthForm
        initialValues={initialValues}
        onSubmit={handleLogin}
        submitLabel="Login"
        loading={authenticating}
        errors={errors}
      />

      <Pressable
        style={styles.linkContainer}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.link}>Don’t have an account? Register</Text>
      </Pressable>
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
  linkContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  link: {
    color: colors.green,
    fontSize: typography.body,
    fontWeight: '800',
  },
});