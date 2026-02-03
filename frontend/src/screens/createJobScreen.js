import {useState, useContext} from 'react';
import {View, Text, TextInput, Button, Alert, ScrollView, ActivityIndicator} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../context/authContext';
import api from '../services/api';

export default function CreateJobScreen({navigation}) {
  const {logout} = useContext(AuthContext);
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    listedSalary: '',
    location: '',
    technologies: '',
    jobURL: '',
    applicationDate: new Date(),
    status: 'Applied',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) handleChange('applicationDate', selectedDate);
  };

  const handleSubmit = async () => {
    if (!formData.companyName || !formData.jobTitle) {
      Alert.alert('Error', 'Company name and job title are required.');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        ...formData,
        applicationDate: formData.applicationDate.toISOString().split('T')[0],
      };
      await api.createJob(payload);
      Alert.alert('Success', 'Job created successfully!');
      navigation.goBack();
    } catch (error) {
      if (error.details) {
        Alert.alert('Validation Error', error.details.join('\n'));
      } else if (error.message.toLowerCase().includes('unauthorized')) {
        logout();
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{padding: 20}}>
      {loading && <ActivityIndicator size="large" />}
      <Text>Company Name *</Text>
      <TextInput
        value={formData.companyName}
        onChangeText={text => handleChange('companyName', text)}
        placeholder="Enter company name"
      />
      <Text>Job Title *</Text>
      <TextInput
        value={formData.jobTitle}
        onChangeText={text => handleChange('jobTitle', text)}
        placeholder="Enter job title"
      />
      <Text>Listed Salary</Text>
      <TextInput
        value={formData.listedSalary}
        onChangeText={text => handleChange('listedSalary', text)}
        placeholder="e.g., $70,000"
      />
      <Text>Location</Text>
      <TextInput
        value={formData.location}
        onChangeText={text => handleChange('location', text)}
        placeholder="Enter location"
      />
      <Text>Technologies</Text>
      <TextInput
        value={formData.technologies}
        onChangeText={text => handleChange('technologies', text)}
        placeholder="Comma-separated, e.g., React, Node.js"
      />
      <Text>Job URL</Text>
      <TextInput
        value={formData.jobURL}
        onChangeText={text => handleChange('jobURL', text)}
        placeholder="Enter job URL"
      />
      <Text>Application Date</Text>
      <Button title={formData.applicationDate.toDateString()} onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={formData.applicationDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Text>Status</Text>
      <Picker
        selectedValue={formData.status}
        onValueChange={value => handleChange('status', value)}>
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
        placeholder="Any notes..."
        multiline
        numberOfLines={3}
      />
      <View style={{ marginVertical: 20 }}>
        <Button
          title={loading ? 'Creating...' : 'Create Job'}
          onPress={handleSubmit}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}