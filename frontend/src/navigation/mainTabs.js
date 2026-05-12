import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/homeScreen';
import JobsScreen from '../screens/jobs/jobsScreen';
import InterviewsScreen from '../screens/interviews/interviewsScreen';
import { colors } from '../theme/theme';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.black,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '900',
        },
        tabBarStyle: {
          backgroundColor: colors.black,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={HomeScreen}
      />
      <Tab.Screen
        name="Jobs"
        component={JobsScreen}
      />
      <Tab.Screen
        name="Interviews"
        component={InterviewsScreen}
      />
    </Tab.Navigator>
  );
}