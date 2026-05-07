import { View, Text, StyleSheet, } from 'react-native';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInterview, deleteInterview } from '../../api';
import Toast from 'react-native-toast-message';
import { queryKeys } from '../../api/queryKeys';
import handleApiError from '../../utils/handleApiError';
import ConfirmModal from '../../components/common/confirmModal';
import AppButton from '../../components/common/AppButton';
import AppScreen from '../../components/common/AppScreen';
import Card from '../../components/common/Card';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import { formatDateTime } from '../../utils/dateUtils';
import { colors, spacing, typography } from '../../theme/theme';

export default function InterviewDetailsScreen({ route, navigation }) {
  const { interviewID } = route.params;
  const queryClient = useQueryClient();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.interview(interviewID),
    queryFn: () => getInterview(interviewID),
  });
  const interview = data?.interview;

  const deleteMutation = useMutation({
    mutationFn: () => deleteInterview(interviewID),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Interview Deleted',
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews });

      if (interview?.jobID) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.jobInterviews(interview.jobID),
        });
      }
      queryClient.removeQueries({
        queryKey: queryKeys.interview(interviewID),
      });
      navigation.goBack();
    },

    onError: error => {
      handleApiError(error);
    },
  });

  const handleConfirmDelete = () => {
    setConfirmVisible(false);
    deleteMutation.mutate();
  };

  if (isLoading) {
    return <LoadingState message="Loading interview..." />;
  }

  if (error) {
    return <ErrorState message={error.message || 'Failed to load interview.'} />;
  }

  if (!interview) {
    return <ErrorState message="Interview not found." />;
  }

  return (
    <AppScreen>
      <Card>
        <Text style={styles.eyebrow}>Interview Details</Text>
        <Text style={styles.title}>{interview.companyName}</Text>
        <Text style={styles.subtitle}>{interview.jobTitle}</Text>

        <View style={styles.detailsGrid}>
          <Detail
            label="Date"
            value={formatDateTime(interview.interviewDate) || 'N/A'}
          />
          <Detail label="Type" value={interview.interviewType || 'N/A'} />
          <Detail label="Result" value={interview.result || 'N/A'} />
        </View>

        {interview.interviewNotes ? (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.body}>{interview.interviewNotes}</Text>
          </View>
        ) : null}
      </Card>

      <View style={styles.actions}>
        <AppButton
          title="Edit Interview"
          onPress={() =>
            navigation.navigate('EditInterview', {
              interviewID,
            })
          }
        />

        <AppButton
          title={deleteMutation.isPending ? 'Deleting...' : 'Delete Interview'}
          variant="danger"
          onPress={() => setConfirmVisible(true)}
          loading={deleteMutation.isPending}
          disabled={deleteMutation.isPending}
        />
      </View>

      <ConfirmModal
        visible={confirmVisible}
        title="Delete Interview"
        message="Are you sure you want to delete this interview?"
        confirmLabel="Delete"
        destructive
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </AppScreen>
  );
}

function Detail({ label, value }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.green,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    marginTop: spacing.xs,
  },
  detailsGrid: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  detailItem: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  detailValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  notesSection: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
  },
  actions: {
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
});