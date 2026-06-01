import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/homeScreen';
import JobsScreen from '../screens/jobs/jobsScreen';
import InterviewsScreen from '../screens/interviews/interviewsScreen';
import { colors } from '../theme/theme';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
          minHeight: Platform.OS === 'android' ? 86 : 76,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'android' ? 22 : 14,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '800',
          marginBottom: 2,
        },
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.textMuted,

        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Jobs') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Interviews') {
            iconName = focused ? 'people' : 'people-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
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