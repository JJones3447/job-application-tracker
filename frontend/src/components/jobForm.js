import { useState } from 'react';
import {View, Text, TextInput, Button,  ScrollView, ActivityIndicator, Platform,} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function JobForm({
  initialValues,
  onSubmit,
  submitLabel = 'Submit',
  loading = false,
}) {
  const [formData, setFormData] = useState(initialValues);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (_, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) handleChange('applicationDate', selectedDate);
  };

  const normalizePayload = () => {
    const payload = {
      ...formData,
      applicationDate: formData.applicationDate
        .toISOString()
        .split('T')[0],
    };

    Object.keys(payload).forEach(key => {
      if (payload[key] === '') payload[key] = undefined;
    });

    return payload;
  };

  const handleSubmit = () => {
    if (!formData.companyName || !formData.jobTitle) {
      alert('Company name and job title are required.');
      return;
    }

    onSubmit(normalizePayload());
  };

  if (!formData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Company Name *</Text>
      <TextInput
        value={formData.companyName}
        onChangeText={text => handleChange('companyName', text)}
      />
      <Text>Job Title *</Text>
      <TextInput
        value={formData.jobTitle}
        onChangeText={text => handleChange('jobTitle', text)}
      />
      <Text>Listed Salary</Text>
      <TextInput
        value={formData.listedSalary}
        onChangeText={text => handleChange('listedSalary', text)}
      />
      <Text>Location</Text>
      <TextInput
        value={formData.location}
        onChangeText={text => handleChange('location', text)}
      />
      <Text>Technologies</Text>
      <TextInput
        value={formData.technologies}
        onChangeText={text => handleChange('technologies', text)}
      />
      <Text>Job URL</Text>
      <TextInput
        value={formData.jobURL}
        onChangeText={text => handleChange('jobURL', text)}
        autoCapitalize="none"
      />
      <Text>Application Date</Text>
      {Platform.OS === 'web' ? (
        <TextInput
          value={formData.applicationDate.toISOString().split('T')[0]}
          onChangeText={text =>
            handleChange('applicationDate', new Date(text))
          }
        />
      ) : (
        <>
          <Button
            title={formData.applicationDate.toDateString()}
            onPress={() => setShowDatePicker(true)}
          />
          {showDatePicker && (
            <DateTimePicker
              value={formData.applicationDate}
              mode="date"
              onChange={handleDateChange}
            />
          )}
        </>
      )}
      <Text>Status</Text>
      <Picker
        selectedValue={formData.status}
        onValueChange={value => handleChange('status', value)}
      >
        <Picker.Item label="Applied" value="Applied" />
        <Picker.Item label="Interviewing" value="Interviewing" />
        <Picker.Item label="Rejected" value="Rejected" />
        <Picker.Item label="Offer" value="Offer" />
        <Picker.Item label="Accepted" value="Accepted" />
      </Picker>
      <Text>Notes</Text>
      <TextInput
        value={formData.notes}
        onChangeText={text => handleChange('notes', text)}
        multiline
      />
      <Button
        title={loading ? 'Saving…' : submitLabel}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
}