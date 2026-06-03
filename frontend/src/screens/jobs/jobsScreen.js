import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { getJobs } from '../../api';
import { queryKeys } from '../../api/queryKeys';
import AppButton from '../../components/common/AppButton';
import AppScreen from '../../components/common/AppScreen';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import {
  colors,
  getJobStatusColor,
  spacing,
  typography,
} from '../../theme/theme';
import { formatDate } from '../../utils/dateUtils';

export default function JobsScreen({ navigation }) {
  const [searchTerm, setSearchTerm] = useState('');

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
  const search = searchTerm.trim().toLowerCase();

  const filteredJobs = jobs.filter(job => {
    if (!search) return true;

    const searchableText = [
      job.companyName,
      job.jobTitle,
      job.location,
      job.technologies,
      job.status,
      job.listedSalary,
      job.notes,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(search);
  });

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

            <Text style={styles.tapHint}>Tap to view details</Text>
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

      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search by company, title, location, tech, or status..."
        placeholderTextColor={colors.textMuted}
        style={styles.searchInput}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FlatList
        data={filteredJobs}
        keyExtractor={item => item.jobID.toString()}
        renderItem={renderJob}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title={searchTerm ? 'No matching jobs' : 'No jobs yet'}
            message={
              searchTerm
                ? 'Try searching for a different company, title, location, technology, or status.'
                : 'Create your first job entry to begin tracking applications.'
            }
            actionLabel={searchTerm ? undefined : 'Add Job'}
            onAction={
              searchTerm ? undefined : () => navigation.navigate('CreateJob')
            }
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
  searchInput: {
    minHeight: 48,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.text,
    fontSize: typography.body,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
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