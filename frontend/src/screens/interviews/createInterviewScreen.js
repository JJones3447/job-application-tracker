import { View } from 'react-native';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInterviewForJob } from '../../api';
import InterviewForm from '../../components/forms/domains/interviews/interviewForm';
import mapInterviewErrors from '../../utils/mapInterviewErrors';
import handleApiError from '../../utils/handleApiError';
import Toast from 'react-native-toast-message';
import { queryKeys } from '../../api/queryKeys';
import AppScreen from '../../components/common/AppScreen';

export default function CreateInterviewScreen({ route, navigation }) {
  const { jobID } = route.params;
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: payload => createInterviewForJob(jobID, payload),

    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Interview Created',
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobInterviews(jobID) });
      navigation.goBack();
    },

    onError: error => {
      handleApiError(error, setErrors, mapInterviewErrors);
    },
  });

  return (
    <AppScreen>
      <InterviewForm
        onSubmit={payload => {
          setErrors({});
          mutation.mutate(payload);
        }}
        submitLabel="Create Interview"
        loading={mutation.isPending}
        errors={errors}
      />
    </AppScreen>
  );
}