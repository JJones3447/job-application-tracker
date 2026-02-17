import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function JobForm({
  initialValues,
  onSubmit,
  submitLabel = 'Submit',
  loading = false,
  errors = {}, 
}) {
  const [formData, setFormData] = useState(initialValues);
  const [localErrors, setLocalErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    setLocalErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleDateChange = (_, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) handleChange('applicationDate', selectedDate);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.companyName?.trim()) {
      newErrors.companyName = 'Company name is required.';
    } else if (formData.companyName.length > 100) {
      newErrors.companyName =
        'Company name cannot exceed 100 characters.';
    }

    if (!formData.jobTitle?.trim()) {
      newErrors.jobTitle = 'Job title is required.';
    } else if (formData.jobTitle.length > 100) {
      newErrors.jobTitle =
        'Job title cannot exceed 100 characters.';
    }

    if (formData.listedSalary?.length > 50) {
      newErrors.listedSalary =
        'Listed salary cannot exceed 50 characters.';
    }

    if (formData.location?.length > 100) {
      newErrors.location =
        'Location cannot exceed 100 characters.';
    }

    if (formData.jobURL) {
      try {
        new URL(formData.jobURL);
      } catch {
        newErrors.jobURL = 'Job URL must be valid.';
      }
    }

    const validStatuses = [
      'Applied',
      'Interviewing',
      'Rejected',
      'Offer',
      'Accepted',
    ];

    if (
      formData.status &&
      !validStatuses.includes(formData.status)
    ) {
      newErrors.status = 'Invalid job status selected.';
    }

    return newErrors;
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
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setLocalErrors(validationErrors);
      return;
    }

    setLocalErrors({});
    onSubmit(normalizePayload());
  };

  if (!formData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const combinedErrors = { ...localErrors, ...errors };

  const renderError = field =>
    combinedErrors[field] ? (
      <Text style={{ color: 'red', marginBottom: 8 }}>
        {combinedErrors[field]}
      </Text>
    ) : null;

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Company Name *</Text>
      <TextInput
        value={formData.companyName}
        onChangeText={text =>
          handleChange('companyName', text)
        }
      />
      {renderError('companyName')}
      <Text>Job Title *</Text>
      <TextInput
        value={formData.jobTitle}
        onChangeText={text =>
          handleChange('jobTitle', text)
        }
      />
      {renderError('jobTitle')}
      <Text>Listed Salary</Text>
      <TextInput
        value={formData.listedSalary}
        onChangeText={text =>
          handleChange('listedSalary', text)
        }
      />
      {renderError('listedSalary')}
      <Text>Location</Text>
      <TextInput
        value={formData.location}
        onChangeText={text =>
          handleChange('location', text)
        }
      />
      {renderError('location')}
      <Text>Technologies</Text>
      <TextInput
        value={formData.technologies}
        onChangeText={text =>
          handleChange('technologies', text)
        }
      />
      <Text>Job URL</Text>
      <TextInput
        value={formData.jobURL}
        onChangeText={text =>
          handleChange('jobURL', text)
        }
        autoCapitalize="none"
      />
      {renderError('jobURL')}

      <Text>Application Date</Text>
      {Platform.OS === 'web' ? (
        <TextInput
          value={formData.applicationDate
            .toISOString()
            .split('T')[0]}
          onChangeText={text =>
            handleChange(
              'applicationDate',
              new Date(text)
            )
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
        onValueChange={value =>
          handleChange('status', value)
        }
      >
        <Picker.Item label="Applied" value="Applied" />
        <Picker.Item
          label="Interviewing"
          value="Interviewing"
        />
        <Picker.Item label="Rejected" value="Rejected" />
        <Picker.Item label="Offer" value="Offer" />
        <Picker.Item label="Accepted" value="Accepted" />
      </Picker>
      {renderError('status')}
      <Text>Notes</Text>
      <TextInput
        value={formData.notes}
        onChangeText={text =>
          handleChange('notes', text)
        }
        multiline
      />
      {combinedErrors.general && (
        <Text style={{ color: 'red', marginVertical: 10 }}>
          {combinedErrors.general}
        </Text>
      )}
      <Button
        title={loading ? 'Saving…' : submitLabel}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
}