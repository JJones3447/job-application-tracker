import { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/appNavigator';
import { AuthProvider, AuthContext } from './src/context/authContext';
import Toast from 'react-native-toast-message';

function Root() {
  const {authenticating} = useContext(AuthContext);

  return (
    <>
      <AppNavigator />
      <Toast />
      {authenticating && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});