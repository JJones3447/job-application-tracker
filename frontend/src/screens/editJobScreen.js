import { useEffect, useState, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getJob, updateJob } from '../api';
import { AuthContext } from '../context/authContext';
import JobForm from '../components/forms/';
import mapBackendErrors from '../utils/mapBackendErrors';
import Toast from 'react-native-toast-message';

export default function EditJobScreen({ route, navigation }) {
  const { jobID } = route.params;
  const { logout } = useContext(AuthContext);

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadJob();
  }, []);

  const loadJob = async () => {
    try {
      const res = await getJob(jobID);
      const job = res.data.job;
      setFormData({
        companyName: job.companyName ?? '',
        jobTitle: job.jobTitle ?? '',
        listedSalary: job.listedSalary ?? '',
        location: job.location ?? '',
        technologies: job.technologies ?? '',
        jobURL: job.jobURL ?? '',
        applicationDate: job.applicationDate
          ? new Date(job.applicationDate)
          : new Date(),
        status: job.status ?? 'Applied',
        notes: job.notes ?? '',
      });
    } catch (err) {
      if (err.status === 401) {
        logout();
        return;
      }
      setErrors({ general: err.message || 'Failed to load job.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async payload => {
    try {
      setSaving(true);
      setErrors({});
      await updateJob(jobID, payload);
      Toast.show({
        type: 'success',
        text1: 'Job Updated',
      });
      navigation.goBack();
    } catch (error) {
      if (error.details?.length) {
        setErrors(mapBackendErrors(error.details));
      } else {
        setErrors({ general: error.message || 'Something went wrong' });
      }
    } finally {
      setSaving(false);
    }
  };
  if (loading || !formData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <JobForm
        initialValues={formData}
        onSubmit={handleSave}
        submitLabel="Save Changes"
        loading={saving}
        errors={errors}
      />
    </View>
  );
}