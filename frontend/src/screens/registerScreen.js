import { useState } from 'react';
import { View } from 'react-native';
import api from '../services/api';
import AuthForm from '../components/authForm';
import mapAuthErrors from '../utils/mapAuthErrors';

export default function RegisterScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const initialValues = {
    name: '',
    email: '',
    password: '',
  };
  const handleRegister = async formData => {
    try {
      setLoading(true);
      setErrors({});
      await api.register(formData);
      navigation.navigate('Login');
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
        onSubmit={handleRegister}
        submitLabel="Register"
        loading={loading}
        errors={errors}
        isRegister
      />
    </View>
  );
}
