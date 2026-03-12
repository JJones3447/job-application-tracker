import { useEffect, useState, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getInterview, updateInterview } from '../api';
import InterviewForm from '../components/forms/';
import mapInterviewErrors from '../utils/mapInterviewErrors';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../context/authContext';

export default function EditInterviewScreen({ route, navigation }) {
  const { interviewID } = route.params;
  const { logout } = useContext(AuthContext);

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadInterview();
  }, []);

  const loadInterview = async () => {
    try {
      const res = await getInterview(interviewID);
      const interview = res.data.interview;

      setFormData({
        interviewDate: interview.interviewDate
          ? new Date(interview.interviewDate)
          : new Date(),
        interviewType: interview.interviewType ?? 'Phone',
        result: interview.result ?? 'Pending',
        interviewNotes: interview.interviewNotes ?? '',
      });
    } catch (err) {
      if (err.status === 401) {
        logout();
        return;
      }

      setErrors({
        general: err.message || 'Failed to load interview.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async payload => {
    try {
      setSaving(true);
      setErrors({});

      await updateInterview(interviewID, payload);

      Toast.show({
        type: 'success',
        text1: 'Interview Updated',
      });

      navigation.goBack();
    } catch (error) {
      if (error.status === 401) {
        logout();
        return;
      }
      if (error.details?.length) {
        setErrors(mapInterviewErrors(error.details));
      } else {
        setErrors({
          general: error.message || 'Something went wrong',
        });
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
      <InterviewForm
        initialValues={formData}
        onSubmit={handleSave}
        submitLabel="Save Changes"
        loading={saving}
        errors={errors}
      />
    </View>
  );
}