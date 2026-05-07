import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInterviews } from '../../api';
import Toast from 'react-native-toast-message';
import { queryKeys } from '../../api/queryKeys';
import { formatDateTime } from '../../utils/dateUtils';
import AppScreen from '../../components/common/AppScreen';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import { colors, spacing, typography } from '../../theme/theme';

export default function InterviewsScreen({ navigation }) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.interviews,
    queryFn: getInterviews,
  });

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load interviews',
        text2: error.message,
      });
    }
  }, [error]);

  const interviews = data?.interviews || [];

  if (isLoading) {
    return <LoadingState message="Loading interviews..." />;
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
      <Card>
        <Text style={styles.cardTitle}>{item.companyName}</Text>
        <Text style={styles.cardSubtitle}>{item.jobTitle}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.badge}>
            {item.interviewType || 'Interview'}
          </Text>
          <Text style={styles.metaText}>
            {item.result || 'N/A'}
          </Text>
        </View>

        <Text style={styles.date}>
          {formatDateTime(item.interviewDate) || 'N/A'}
        </Text>
      </Card>
    </Pressable>
  );

  return (
    <AppScreen scroll={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Interviews</Text>
        <Text style={styles.subtitle}>
          Review upcoming and completed interview activity.
        </Text>
      </View>

      <FlatList
        data={interviews}
        keyExtractor={item => item.interviewID.toString()}
        renderItem={renderInterview}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No interviews yet"
            message="Add an interview for a job once one is scheduled."
          />
        }
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.md,
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
  pressed: {
    opacity: 0.82,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '900',
  },
  cardSubtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    marginTop: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  badge: {
    color: colors.black,
    backgroundColor: colors.green,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: typography.small,
    fontWeight: '900',
  },
  metaText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  date: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: spacing.md,
  },
});