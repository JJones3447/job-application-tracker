import { useState, useContext } from 'react';
import { View } from 'react-native';
import { createInterviewForJob } from '../api';
import InterviewForm from '../components/forms/';
import mapInterviewErrors from '../utils/mapInterviewErrors';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../context/authContext';

export default function CreateInterviewScreen({ route, navigation }) {
  const {jobID} = route.params;
  const {logout} = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const initialValues = {
    interviewDate: new Date(),
    interviewType: 'Phone',
    result: 'Pending',
    interviewNotes: '',
  };

  const handleCreate = async payload => {
    try {
      setLoading(true);
      setErrors({});
      await createInterviewForJob(jobID, payload);
      Toast.show({
        type: 'success',
        text1: 'Interview Created',
        text2: 'Interview added successfully.',
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
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <InterviewForm
        initialValues={initialValues}
        onSubmit={handleCreate}
        submitLabel="Create Interview"
        loading={loading}
        errors={errors}
      />
    </View>
  );
}