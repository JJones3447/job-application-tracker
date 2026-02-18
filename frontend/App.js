import AppNavigator from './src/navigation/appNavigator';
import { AuthProvider } from './src/context/authContext';
import Toast from 'react-native-toast-message';

export default function App() {
  return(
    <AuthProvider>
      <AppNavigator />
      <Toast />
    </AuthProvider>
  );
}