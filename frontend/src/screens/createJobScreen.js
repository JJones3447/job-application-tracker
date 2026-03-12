import { useContext, useState } from 'react';
import { View } from 'react-native';
import { createJob } from '../api';
import { AuthContext } from '../context/authContext';
import JobForm from '../components/forms/';
import mapBackendErrors from '../utils/mapBackendErrors';
import Toast from 'react-native-toast-message';

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

      await createJob(payload);
      Toast.show({
        type: 'success',
        text1: 'Job Created',
        text2: 'Your job was added successfully.',
      });
      navigation.goBack();
    } catch (error) {
      if (error.details?.length) {
        setErrors(mapBackendErrors(error.details));
      } else {
        setErrors({ general: error.message || 'Something went wrong' });
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