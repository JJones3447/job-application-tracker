import { useContext, useState } from 'react';
import { View } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/authContext';
import JobForm from '../components/jobForm';

export default function CreateJobScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleCreate = async (payload) => {
    try {
      setLoading(true);
      setError(null);

      await api.createJob(payload);

      navigation.goBack();
    } catch (err) {
      if (err.status === 401) {
        logout();
        return;
      }

      if (err.details?.length) {
        setError(err.details.join('\n'));
      } else {
        setError(err.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <JobForm
        initialValues={initialValues}
        onSubmit={handleCreate}
        submitLabel="Create Job"
        loading={loading}
        error={error}
      />
    </View>
  );
}