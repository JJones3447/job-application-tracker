import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';

import LoginScreen from '../screens/auth/loginScreen';
import RegisterScreen from '../screens/auth/registerScreen';

import JobDetailsScreen from '../screens/jobs/jobDetailsScreen';
import CreateJobScreen from '../screens/jobs/createJobScreen';
import EditJobScreen from '../screens/jobs/editJobScreen';

import InterviewDetailsScreen from '../screens/interviews/interviewDetailsScreen';
import CreateInterviewScreen from '../screens/interviews/createInterviewScreen';
import EditInterviewScreen from '../screens/interviews/editInterviewScreen';

import MainTabs from './mainTabs';

import { AuthContext } from '../context/authContext';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { userToken } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.black,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '900',
          },
          contentStyle: {
            backgroundColor: colors.black,
          },
        }}
      >
        {userToken ? (
          <>
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="JobDetails"
              component={JobDetailsScreen}
              options={{ title: 'Job Details' }}
            />
            <Stack.Screen
              name="CreateJob"
              component={CreateJobScreen}
              options={{ title: 'Add Job' }}
            />
            <Stack.Screen
              name="EditJob"
              component={EditJobScreen}
              options={{ title: 'Edit Job' }}
            />
            <Stack.Screen
              name="InterviewDetails"
              component={InterviewDetailsScreen}
              options={{ title: 'Interview Details' }}
            />
            <Stack.Screen
              name="CreateInterview"
              component={CreateInterviewScreen}
              options={{ title: 'Add Interview' }}
            />
            <Stack.Screen
              name="EditInterview"
              component={EditInterviewScreen}
              options={{ title: 'Edit Interview' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Create Account' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}