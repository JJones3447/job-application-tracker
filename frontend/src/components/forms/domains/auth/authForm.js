import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function AuthForm({
  initialValues,
  onSubmit,
  submitLabel,
  loading = false,
  errors = {},
  isRegister = false,
}) {
  const [formData, setFormData] = useState(initialValues);
  const [localErrors, setLocalErrors] = useState({});

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setLocalErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors = {};

    if (isRegister) {
      if (!formData.name?.trim()) {
        newErrors.name = 'Name is required.';
      }
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (isRegister && formData.password.length < 6) {
      newErrors.password =
        'Password must be at least 6 characters.';
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setLocalErrors(validationErrors);
      return;
    }

    setLocalErrors({});
    onSubmit(formData);
  };

  const combinedErrors = { ...localErrors, ...errors };

  const renderError = field =>
    combinedErrors[field] ? (
      <Text style={{ color: 'red', marginBottom: 8 }}>
        {combinedErrors[field]}
      </Text>
    ) : null;
  return (
    <View style={{ padding: 20 }}>
      {isRegister && (
        <>
          <Text>Name</Text>
          <TextInput
            value={formData.name}
            onChangeText={text => handleChange('name', text)}
          />
          {renderError('name')}
        </>
      )}
      <Text>Email</Text>
      <TextInput
        value={formData.email}
        onChangeText={text => handleChange('email', text)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {renderError('email')}
      <Text>Password</Text>
      <TextInput
        value={formData.password}
        onChangeText={text => handleChange('password', text)}
        secureTextEntry
      />
      {renderError('password')}
      {combinedErrors.general && (
        <Text style={{ color: 'red', marginVertical: 10 }}>
          {combinedErrors.general}
        </Text>
      )}
      <Button
        title={loading ? 'Submitting…' : submitLabel}
        onPress={handleSubmit}
        disabled={loading}
      />
    </View>
  );
}
