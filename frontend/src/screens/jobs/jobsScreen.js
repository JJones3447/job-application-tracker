import { useEffect, } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getJobs } from '../../api';
import Toast from 'react-native-toast-message';
import { queryKeys } from '../../api/queryKeys';
import AppButton from '../../components/common/AppButton';
import AppScreen from '../../components/common/AppScreen';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import { colors, spacing, typography, getJobStatusColor }from '../../theme/theme'
import { formatDate } from '../../utils/dateUtils';

export default function JobsScreen({ navigation }) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.jobs,
    queryFn: getJobs,
  });

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load jobs',
        text2: error.message,
      });
    }
  }, [error]);

  const jobs = data?.jobs || [];

  if (isLoading) {
    return <LoadingState message="Loading jobs..." />;
  }

  const renderJob = ({ item }) => (
    <Pressable
      onPress={() =>
        navigation.navigate('JobDetails', {
          jobID: item.jobID,
        })
      }
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Card>
        <View style={styles.cardHeader}>
          <View style={styles.cardTextGroup}>
            <Text style={styles.company}>{item.companyName}</Text>
            <Text style={styles.jobTitle}>{item.jobTitle}</Text>

            <Text style={styles.cardMeta}>
              {item.applicationDate
                ? `Applied ${formatDate(item.applicationDate)}`
                : 'No application date'}
              {item.location ? ` • ${item.location}` : ''}
            </Text>

            <Text style={styles.tapHint}>Tap to view details →</Text>
          </View>

          <View
            style={[
              styles.statusPill,
              { backgroundColor: getJobStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{item.status || 'N/A'}</Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );

  return (
    <AppScreen scroll={false}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Jobs</Text>
          <Text style={styles.subtitle}>
            Track every role you have applied to.
          </Text>
        </View>

        <AppButton
          title="Add Job"
          onPress={() => navigation.navigate('CreateJob')}
          fullWidth={false}
        />
      </View>

      <FlatList
        data={jobs}
        keyExtractor={item => item.jobID.toString()}
        renderItem={renderJob}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No jobs yet"
            message="Create your first job entry to begin tracking applications."
            actionLabel="Add Job"
            onAction={() => navigation.navigate('CreateJob')}
          />
        }
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.82,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  headerText: {
    flex: 1,
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
    lineHeight: 22,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  cardTextGroup: {
    flex: 1,
  },
  company: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '900',
  },
  jobTitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    marginTop: spacing.xs,
  },
  cardMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: spacing.sm,
  },
  tapHint: {
    color: colors.green,
    fontSize: typography.tiny,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  statusPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  statusText: {
    color: colors.black,
    fontSize: typography.tiny,
    fontWeight: '900',
  },
});