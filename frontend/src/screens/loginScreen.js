import { useState, useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/authContext';
import AuthForm from '../components/forms/domains/auth/authForm';
import mapAuthErrors from '../utils/mapAuthErrors';
import handleApiError from '../utils/handleApiError';

export default function LoginScreen({ navigation }) {
  const { login, authenticating } = useContext(AuthContext);

  const [errors, setErrors] = useState({});

  const initialValues = {
    email: '',
    password: '',
  };

  const handleLogin = async (formData) => {
    try {
      setErrors({});
      await login(formData.email, formData.password);
    } catch (error) {
      handleApiError(error, setErrors, mapAuthErrors);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <AuthForm
        initialValues={initialValues}
        onSubmit={handleLogin}
        submitLabel="Login"
        loading={authenticating}
        errors={errors}
      />

      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: 'blue' }}>
            Don’t have an account? Register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}