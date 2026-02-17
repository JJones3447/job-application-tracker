import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/authContext';
import JobForm from '../components/jobForm';

export default function CreateJobScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    companyName: '',
    jobTitle: '',
    listedSalary: '',
    location: '',
    technologies: '',
    jobURL: '',
    applicationDate: new Date(),
    status: 'Applied',
    notes: '',
  };

  const handleCreate = async payload => {
    try {
      setLoading(true);
      await api.createJob(payload);
      Alert.alert('Success', 'Job created successfully!');
      navigation.goBack();
    } catch (error) {
      if (error.status === 401) logout();
      else if (error.details?.length) {
        Alert.alert('Validation failed', error.details.join('\n'));
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <JobForm
      initialValues={initialValues}
      onSubmit={handleCreate}
      submitLabel="Create Job"
      loading={loading}
    />
  );
}