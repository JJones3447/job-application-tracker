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

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const {userToken, loading} = useContext(AuthContext);
  
  if (loading){
    return(
      <View style={{ flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large"/>
      </View>
    )
  }
  return(
    <NavigationContainer>
      <Stack.Navigator>
        {userToken ? (
          <>
            <Stack.Screen name="Jobs" component={JobsScreen} />
            <Stack.Screen name="JobDetails" component={JobDetailsScreen} options={{title: 'Job Details'}} />
            <Stack.Screen name="CreateJob" component={CreateJobScreen} options={{title: 'Add Job'}} />
            <Stack.Screen name="EditJob" component={EditJobScreen} options={{title: 'Edit Job'}} />
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
            options={{title: 'Create Account'}}
          />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}