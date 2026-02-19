import {useState, useContext} from 'react';
import { View } from 'react-native';
import api from '../services/api';
import AuthForm from '../components/authForm';
import mapAuthErrors from '../utils/mapAuthErrors';
import { AuthContext } from '../context/authContext';

export default function RegisterScreen() {
  const {login} = useContext(AuthContext);
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
        onSubmit={handleRegister}
        submitLabel="Register"
        loading={loading}
        errors={errors}
        isRegister
      />
    </View>
  );
}
