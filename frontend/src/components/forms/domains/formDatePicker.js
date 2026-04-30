import { useState } from 'react';
import { View, Text, Button, Platform, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const formatLocalDate = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function FormDatePicker({
  label,
  value,
  onChange,
  error,
}) {
  const [show, setShow] = useState(false);

  const handleNativeChange = (event, selectedDate) => {
    setShow(false);

    if (selectedDate) {
      onChange(formatLocalDate(selectedDate));
    }
  };

  return (
    <View style={{ marginBottom: 15 }}>
      {label && (
        <Text style={{ marginBottom: 5 }}>
          {label}
        </Text>
      )}
      {Platform.OS === 'web' ? (
        <TextInput
          value={value}
          placeholder="YYYY-MM-DD"
          onChangeText={onChange}
          style={{
            borderWidth: 1,
            borderColor: error ? 'red' : '#ccc',
            padding: 10,
            borderRadius: 5,
          }}
        />
      ) : (
        <>
          <Button
            title={value || 'Select Date'}
            onPress={() => setShow(true)}
          />
          {show && (
            <DateTimePicker
              value={value ? new Date(value) : new Date()}
              mode="date"
              display="default"
              onChange={handleNativeChange}
            />
          )}
        </>
      )}

      {error && (
        <Text style={{ color: 'red', marginTop: 5 }}>
          {error}
        </Text>
      )}
    </View>
  );
}