import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import LoginScreen from '../screens/auth/loginScreen';
import JobsScreen from '../screens/jobs/jobsScreen';
import JobDetailsScreen from '../screens/jobs/jobDetailsScreen';
import CreateJobScreen from '../screens/jobs/createJobScreen';
import { AuthContext } from '../context/authContext';
import EditJobScreen from '../screens/jobs/editJobScreen';
import RegisterScreen from '../screens/auth/registerScreen';
import InterviewsScreen from '../screens/interviews/interviewsScreen';
import InterviewDetailsScreen from '../screens/interviews/interviewDetailsScreen';
import CreateInterviewScreen from '../screens/interviews/createInterviewScreen';
import EditInterviewScreen from '../screens/interviews/editInterviewScreen';
import HomeScreen from '../screens/homeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const {userToken} = useContext(AuthContext);
  

  return(
    <NavigationContainer>
      <Stack.Navigator>
        {userToken ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{title: 'Dashboard'}}></Stack.Screen>
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