import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import AppButton from './AppButton';
import { colors, radius, shadows, spacing, typography } from '../../theme/theme';

export default function ConfirmModal({
  visible,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={event => event.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.actions}>
            <View style={styles.actionButton}>
              <AppButton
                title={cancelLabel}
                onPress={onCancel}
                variant="secondary"
                fullWidth
              />
            </View>

            <View style={styles.actionButton}>
              <AppButton
                title={confirmLabel}
                onPress={onConfirm}
                variant={destructive ? 'danger' : 'primary'}
                fullWidth
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  title: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  message: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});