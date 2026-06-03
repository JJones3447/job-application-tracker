import { StyleSheet, Text, View } from 'react-native';

import Card from './Card';
import { colors, radius, spacing, typography } from '../../theme/theme';

const startOfWeek = date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;

  d.setDate(diff);
  d.setHours(0, 0, 0, 0);

  return d;
};

const toDateKey = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const interviewDateKey = isoString => {
  if (!isoString) return '';

  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export default function HomeWeekCalendar({ interviews = [] }) {
  const today = new Date();
  const weekStart = startOfWeek(today);

  const days = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(weekStart);

    date.setDate(weekStart.getDate() + index);

    const key = toDateKey(date);

    return {
      key,
      date,
      dayName: date.toLocaleDateString(undefined, { weekday: 'short' }),
      dayNumber: date.getDate(),
      isToday: key === toDateKey(today),
      interviews: interviews.filter(
        item => interviewDateKey(item.interviewDate) === key
      ),
    };
  });

  return (
    <Card>
      <Text style={styles.heading}>This Week</Text>

      <View style={styles.weekGrid}>
        {days.map(day => (
          <View
            key={day.key}
            style={[styles.dayCard, day.isToday && styles.todayCard]}
          >
            <Text style={[styles.dayName, day.isToday && styles.todayText]}>
              {day.dayName}
            </Text>

            <Text style={[styles.dayNumber, day.isToday && styles.todayText]}>
              {day.dayNumber}
            </Text>

            <View style={styles.dotRow}>
              {day.interviews.length > 0 ? <View style={styles.dot} /> : null}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.interviewList}>
        {days.some(day => day.interviews.length > 0) ? (
          days.map(day =>
            day.interviews.map(interview => (
              <View key={interview.interviewID} style={styles.interviewItem}>
                <Text style={styles.interviewTitle}>
                  {interview.companyName} — {interview.jobTitle}
                </Text>

                <Text style={styles.interviewMeta}>
                  {day.dayName} • {interview.interviewType} •{' '}
                  {interview.result}
                </Text>
              </View>
            ))
          )
        ) : (
          <Text style={styles.noInterviews}>
            No interviews scheduled this week.
          </Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  weekGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dayCard: {
    flex: 1,
    minHeight: 76,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCard: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  dayName: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    fontWeight: '700',
  },
  dayNumber: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  todayText: {
    color: colors.black,
  },
  dotRow: {
    height: 8,
    marginTop: spacing.xs,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.warning,
  },
  interviewList: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  interviewItem: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  interviewTitle: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '800',
  },
  interviewMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: spacing.xs,
  },
  noInterviews: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
});