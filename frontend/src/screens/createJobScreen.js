import { useContext, useState } from 'react';
import { View } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/authContext';
import JobForm from '../components/jobForm';
import mapBackendErrors from '../utils/mapBackendErrors';

export default function CreateJobScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
      setErrors({});

      await api.createJob(payload);

      navigation.goBack();
    } catch (err) {
      if (err.status === 401) {
        logout();
        return;
      }

      if (err.details?.length) {
        setErrors(mapBackendErrors(err.details));
      } else {
        setErrors({ general: err.message || 'Something went wrong' });
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
        errors={errors}
      />
    </View>
  );
}