import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const FormField = ({
  label,
  value,
  onChange,
  onBlur,
  multiline = false,
  error,
  keyboardType,
  autoCapitalize,
  secureTextEntry = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  inputError: {
    borderColor: 'red',
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
});

export default FormField;