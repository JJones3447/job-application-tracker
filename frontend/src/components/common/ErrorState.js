import { StyleSheet, Text, View } from 'react-native';

import AppButton from './AppButton';
import { colors, spacing, typography } from '../../theme/theme';

export default function ErrorState({
  message = 'Something went wrong.',
  onRetry,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops</Text>

      <Text style={styles.message}>{message}</Text>

      {onRetry ? <AppButton title="Try Again" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  message: {
    color: colors.textMuted,
    fontSize: typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});