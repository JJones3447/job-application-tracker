import AppNavigator from './app/navigation/appNavigator';
import { AuthProvider } from './app/context/authContext';

export default function App() {
  return(
    <AuthProvider>
      <AppNavigator /> 
    </AuthProvider>
  );
}