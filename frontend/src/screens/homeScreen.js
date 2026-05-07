import { useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useQuery } from '@tanstack/react-query';
import AppButton from '../components/common/AppButton';
import AppScreen from '../components/common/AppScreen';
import Card from '../components/common/Card';
import HomeWeekCalendar from '../components/common/HomeWeekCalendar';
import LoadingState from '../components/common/LoadingState';
import { AuthContext } from '../context/authContext';
import { getInterviews, getJobs } from '../api';
import { queryKeys } from '../api/queryKeys';
import { colors, spacing, typography } from '../theme/theme';

export default function HomeScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  const {
    data: jobsData,
    isLoading: jobsLoading,
    error: jobsError,
  } = useQuery({
    queryKey: queryKeys.jobs,
    queryFn: getJobs,
  });

  const {
    data: interviewsData,
    isLoading: interviewsLoading,
    error: interviewsError,
  } = useQuery({
    queryKey: queryKeys.interviews,
    queryFn: getInterviews,
  });

  useEffect(() => {
    const error = jobsError || interviewsError;
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load dashboard',
        text2: error.message,
      });
    }
  }, [jobsError, interviewsError]);

  if (jobsLoading || interviewsLoading) {
    return <LoadingState message="Loading your dashboard..." />;
  }

  const jobs = jobsData?.jobs || [];
  const interviews = interviewsData?.interviews || [];

  return (
    <AppScreen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Job Search Tracker</Text>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Track applications, interviews, and progress in one place.</Text>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{jobs.length}</Text>
          <Text style={styles.statLabel}>Jobs</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{interviews.length}</Text>
          <Text style={styles.statLabel}>Interviews</Text>
        </Card>
      </View>

      <HomeWeekCalendar interviews={interviews} />

      <Card>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actions}>
          <AppButton title="View Jobs" onPress={() => navigation.navigate('Jobs')} />
          <AppButton
            title="View Interviews"
            onPress={() => navigation.navigate('Interviews')}
            variant="secondary"
          />
          <AppButton
            title="Add New Job"
            onPress={() => navigation.navigate('CreateJob')}
            variant="secondary"
          />
          <AppButton title="Logout" onPress={logout} variant="danger" />
        </View>
      </Card>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
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
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
  },
  statValue: {
    color: colors.green,
    fontSize: 34,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  actions: {
    gap: spacing.md,
  },
});