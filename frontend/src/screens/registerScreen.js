import { useState, useContext } from 'react';
import { View } from 'react-native';
import { register } from '../api';
import AuthForm from '../components/forms/domains/auth/authForm';
import mapAuthErrors from '../utils/mapAuthErrors';
import handleApiError from '../utils/handleApiError';
import { AuthContext } from '../context/authContext';

export default function RegisterScreen() {
  const { login, authenticating } = useContext(AuthContext);

  const [errors, setErrors] = useState({});

  const initialValues = {
    name: '',
    email: '',
    password: '',
  };

  const handleRegister = async (formData) => {
    try {
      setErrors({});
      await register(formData);
      await login(formData.email, formData.password);
    } catch (error) {
      handleApiError(error, setErrors, mapAuthErrors);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <AuthForm
        initialValues={initialValues}
        onSubmit={handleRegister}
        submitLabel="Register"
        loading={authenticating}
        errors={errors}
        isRegister
      />
    </View>
  );
}