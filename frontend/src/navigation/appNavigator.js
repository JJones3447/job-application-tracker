import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';

import LoginScreen from '../screens/loginScreen';
import JobsScreen from '../screens/jobsScreen';
import JobDetailsScreen from '../screens/jobDetailsScreen';
import { AuthContext } from '../context/authContext';

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
            <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}