import { StyleSheet, Text, View } from 'react-native';

import AppButton from './AppButton';
import { colors, spacing, typography } from '../../theme/theme';

export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      {actionLabel && onAction ? (
        <AppButton title={actionLabel} onPress={onAction} variant="secondary" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    color: colors.textMuted,
    fontSize: typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});