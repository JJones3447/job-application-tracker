import { View, ActivityIndicator, Text } from 'react-native';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInterview, updateInterview } from '../api';
import InterviewForm from '../components/forms/domains/interviews/interviewForm';
import mapInterviewErrors from '../utils/mapInterviewErrors';
import handleApiError from '../utils/handleApiError';
import Toast from 'react-native-toast-message';
import { queryKeys } from '../api/queryKeys';

export default function EditInterviewScreen({ route, navigation }) {
  const { interviewID } = route.params;
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState({});

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.interview(interviewID),
    queryFn: () => getInterview(interviewID),
  });

  const interview = data?.interview;

  const mutation = useMutation({
    mutationFn: payload => updateInterview(interviewID, payload),
    onSuccess: updated => {
      Toast.show({
        type: 'success',
        text1: 'Interview Updated',
      });
      queryClient.setQueryData(
        queryKeys.interview(interviewID),
        updated
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.interviews,
      });
      if (interview?.jobID) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.jobInterviews(interview.jobID),
        });
      }
      navigation.goBack();
    },
    onError: error => {
      handleApiError(error, setErrors, mapInterviewErrors);
    },
  });
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error || !interview) {
    return (
      <View style={{ padding: 20 }}>
        <Text>{error?.message || 'Interview not found.'}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <InterviewForm
        initialValues={interview}
        onSubmit={payload => {
          setErrors({});
          mutation.mutate(payload);
        }}
        submitLabel="Save Changes"
        loading={mutation.isPending}
        errors={errors}
      />
    </View>
  );
}