import { useState } from 'react';
import {
  FlatList,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { deleteJob, getInterviewsForJob, getJob } from '../../api';
import { queryKeys } from '../../api/queryKeys';
import AppButton from '../../components/common/AppButton';
import AppScreen from '../../components/common/AppScreen';
import Card from '../../components/common/Card';
import ConfirmModal from '../../components/common/confirmModal';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import { colors, spacing, typography } from '../../theme/theme';
import handleApiError from '../../utils/handleApiError';
import { formatDate, formatDateTime } from '../../utils/dateUtils';

export default function JobDetailsScreen({ route, navigation }) {
  const { jobID } = route.params;
  const queryClient = useQueryClient();

  const [confirmVisible, setConfirmVisible] = useState(false);

  const {
    data: jobData,
    isLoading: jobLoading,
    error: jobError,
  } = useQuery({
    queryKey: queryKeys.job(jobID),
    queryFn: () => getJob(jobID),
  });

  const {
    data: interviewsData,
    isLoading: interviewsLoading,
    error: interviewsError,
  } = useQuery({
    queryKey: queryKeys.jobInterviews(jobID),
    queryFn: () => getInterviewsForJob(jobID),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteJob(jobID),

    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Job Deleted',
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.jobs,
      });

      queryClient.removeQueries({
        queryKey: queryKeys.job(jobID),
      });

      queryClient.removeQueries({
        queryKey: queryKeys.jobInterviews(jobID),
      });

      navigation.navigate('MainTabs', {
        screen: 'Jobs',
      });
    },

    onError: error => {
      handleApiError(error);
    },
  });

  const handleConfirmDelete = () => {
    setConfirmVisible(false);
    deleteMutation.mutate();
  };

  const openUrl = async url => {
    if (!url) return;

    if (Platform.OS === 'web') {
      window.open(url, '_blank');
      return;
    }

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    }
  };

  if (jobLoading || interviewsLoading) {
    return <LoadingState message="Loading job details..." />;
  }

  if (jobError || interviewsError) {
    return (
      <ErrorState
        message={
          jobError?.message ||
          interviewsError?.message ||
          'Something went wrong.'
        }
      />
    );
  }

  const job = jobData?.job;
  const interviews = interviewsData?.interviews || [];

  if (!job) {
    return <ErrorState message="Job not found." />;
  }

  const renderInterview = ({ item }) => (
    <Pressable
      onPress={() =>
        navigation.navigate('InterviewDetails', {
          interviewID: item.interviewID,
        })
      }
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.interviewItem}>
        <Text style={styles.interviewTitle}>
          {item.interviewType || 'Interview'} — {item.result || 'N/A'}
        </Text>

        <Text style={styles.interviewDate}>
          {item.interviewDate ? formatDateTime(item.interviewDate) : 'No date'}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <AppScreen>
      <Card>
        <Text style={styles.eyebrow}>Job Details</Text>
        <Text style={styles.title}>{job.companyName}</Text>
        <Text style={styles.subtitle}>{job.jobTitle}</Text>

        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{job.status || 'N/A'}</Text>
        </View>

        <View style={styles.detailsGrid}>
          {job.location ? <Detail label="Location" value={job.location} /> : null}

          <Detail label="Listed Salary" value={job.listedSalary || '-'} />

          {job.technologies ? (
            <Detail label="Technologies" value={job.technologies} />
          ) : null}

          {job.applicationDate ? (
            <Detail label="Applied On" value={formatDate(job.applicationDate)} />
          ) : null}
        </View>

        {job.jobURL ? (
          <Pressable onPress={() => openUrl(job.jobURL)} style={styles.linkBox}>
            <Text style={styles.linkLabel}>Job URL</Text>
            <Text style={styles.linkValue} numberOfLines={2}>
              {job.jobURL}
            </Text>
          </Pressable>
        ) : null}

        {job.notes ? (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.body}>{job.notes}</Text>
          </View>
        ) : null}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Interviews</Text>

        <FlatList
          data={interviews}
          keyExtractor={item => item.interviewID.toString()}
          renderItem={renderInterview}
          scrollEnabled={false}
          ListEmptyComponent={
            <EmptyState
              title="No interviews recorded"
              message="Create one when you schedule your first interview for this job."
            />
          }
        />

        <AppButton
          title="Add Interview"
          onPress={() =>
            navigation.navigate('CreateInterview', {
              jobID,
            })
          }
          variant="secondary"
        />
      </Card>

      <View style={styles.actions}>
        <AppButton
          title="Edit Job"
          onPress={() =>
            navigation.navigate('EditJob', {
              jobID,
            })
          }
        />

        <AppButton
          title={deleteMutation.isPending ? 'Deleting...' : 'Delete Job'}
          variant="danger"
          onPress={() => setConfirmVisible(true)}
          loading={deleteMutation.isPending}
          disabled={deleteMutation.isPending}
        />
      </View>

      <ConfirmModal
        visible={confirmVisible}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
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
  pressed: {
    opacity: 0.82,
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
    fontSize: typography.title,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    marginTop: spacing.xs,
  },
  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.green,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.md,
  },
  statusText: {
    color: colors.black,
    fontSize: typography.small,
    fontWeight: '900',
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
  linkBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  linkLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  linkValue: {
    color: colors.green,
    fontSize: typography.small,
    marginTop: spacing.xs,
  },
  notesSection: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  body: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
  },
  interviewItem: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.md,
  },
  interviewTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  interviewDate: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: spacing.xs,
  },
  actions: {
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
});