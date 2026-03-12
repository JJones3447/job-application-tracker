import { useState, useContext } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { AuthContext } from '../context/authContext';
import AuthForm from '../components/forms/domains/auth/authForm';
import mapAuthErrors from '../utils/mapAuthErrors';

export default function LoginScreen({navigation}) {
  const { login } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const initialValues = {
    email: '',
    password: '',
  };

  const handleLogin = async formData => {
    try {
      setLoading(true);
      setErrors({});
      await login(formData.email, formData.password);
    } catch (err) {
      if (err.details?.length) {
        setErrors(mapAuthErrors(err.details));
      } else {
        setErrors({ general: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <AuthForm
        initialValues={initialValues}
        onSubmit={handleLogin}
        submitLabel="Login"
        loading={loading}
        errors={errors}
      />
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={{ color: 'blue' }}>
            Don’t have an account? Register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}