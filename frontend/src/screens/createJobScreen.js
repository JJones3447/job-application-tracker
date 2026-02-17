import { useContext, useState } from 'react';
import { View } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/authContext';
import JobForm from '../components/jobForm';

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

  const mapBackendErrors = (details = []) => {
    const fieldErrors = {};

    details.forEach(msg => {
      const lower = msg.toLowerCase();

      if (lower.includes('company')) {
        fieldErrors.companyName = msg;
      } else if (lower.includes('job title')) {
        fieldErrors.jobTitle = msg;
      } else if (lower.includes('salary')) {
        fieldErrors.listedSalary = msg;
      } else if (lower.includes('location')) {
        fieldErrors.location = msg;
      } else if (lower.includes('url')) {
        fieldErrors.jobURL = msg;
      } else if (lower.includes('status')) {
        fieldErrors.status = msg;
      } else {
        fieldErrors.general = msg;
      }
    });

    return fieldErrors;
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