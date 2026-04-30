import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';

import LoginScreen from '../screens/loginScreen';
import JobsScreen from '../screens/jobsScreen';
import JobDetailsScreen from '../screens/jobDetailsScreen';
import CreateJobScreen from '../screens/createJobScreen';
import { AuthContext } from '../context/authContext';
import EditJobScreen from '../screens/editJobScreen';
import RegisterScreen from '../screens/registerScreen';
import InterviewsScreen from '../screens/interviewsScreen';
import InterviewDetailsScreen from '../screens/interviewDetailsScreen';
import CreateInterviewScreen from '../screens/createInterviewScreen';
import EditInterviewScreen from '../screens/editInterviewScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const {userToken} = useContext(AuthContext);
  

  return(
    <NavigationContainer>
      <Stack.Navigator>
        {userToken ? (
          <>
            <Stack.Screen name="Jobs" component={JobsScreen} />
            <Stack.Screen name="JobDetails" component={JobDetailsScreen} options={{title: 'Job Details'}} />
            <Stack.Screen name="CreateJob" component={CreateJobScreen} options={{title: 'Add Job'}} />
            <Stack.Screen name="EditJob" component={EditJobScreen} options={{title: 'Edit Job'}} />
            <Stack.Screen name="Interviews" component={InterviewsScreen} options={{title: 'All Interviews'}} />
            <Stack.Screen name="InterviewDetails" component={InterviewDetailsScreen} options={{title: 'Interview Details'}} />
            <Stack.Screen name="CreateInterview" component={CreateInterviewScreen} options={{title: 'Add Interview'}} />
            <Stack.Screen name="EditInterview" component={EditInterviewScreen} options={{title: 'Edit Interview'}} />
          </>
        ) : (
          <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{title: 'Create Account'}} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}