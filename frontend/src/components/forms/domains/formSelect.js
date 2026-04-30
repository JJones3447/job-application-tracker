import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function FormSelect({
  label,
  value,
  onChange,
  onBlur,
  items,
  error,
  placeholder = {},
}) {
  return (
    <View style={{ marginBottom: 15 }}>
      {label && <Text style={{ marginBottom: 5 }}>{label}</Text>}

      <RNPickerSelect
        value={value}
        onValueChange={onChange}
        onClose={onBlur}
        items={items}
        placeholder={placeholder}
        style={{
          inputIOS: {
            borderWidth: 1,
            borderColor: error ? 'red' : '#ccc',
            padding: 10,
            borderRadius: 5,
          },
          inputAndroid: {
            borderWidth: 1,
            borderColor: error ? 'red' : '#ccc',
            padding: 10,
            borderRadius: 5,
          },
          inputWeb: {
            borderWidth: 1,
            borderColor: error ? 'red' : '#ccc',
            padding: 10,
            borderRadius: 5,
          },
        }}
      />

      {error && (
        <Text style={{ color: 'red', marginTop: 5 }}>
          {error}
        </Text>
      )}
    </View>
  );
}