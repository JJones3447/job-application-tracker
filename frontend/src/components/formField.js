import React from 'react';
import { View, Text, TextInput } from 'react-native';

const FormField = ({
  label,
  value,
  onChange,
  error,
  type = 'text',
  multiline = false,
}) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ marginBottom: 4 }}>{label}</Text>

      <TextInput
        value={value}
        onChange={onChange}
        multiline={multiline}
        style={{
          borderWidth: 1,
          borderColor: error ? 'red' : '#ccc',
          padding: 8,
          borderRadius: 4,
        }}
        {...(type === 'date' || type === 'time'
          ? { type }
          : {})}
      />

      {error && (
        <Text style={{ color: 'red', marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default FormField;