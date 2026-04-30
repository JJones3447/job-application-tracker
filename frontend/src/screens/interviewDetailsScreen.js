import {
  View,
  Text,
  ActivityIndicator,
  Button,
} from 'react-native';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInterview, deleteInterview } from '../api';
import Toast from 'react-native-toast-message';
import { queryKeys } from '../api/queryKeys';
import handleApiError from '../utils/handleApiError';
import ConfirmModal from '../components/common/confirmModal';

export default function InterviewDetailsScreen({ route, navigation }) {
  const { interviewID } = route.params;
  const queryClient = useQueryClient();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.interview(interviewID),
    queryFn: () => getInterview(interviewID),
  });
  const interview = data?.interview;

  const deleteMutation = useMutation({
    mutationFn: () => deleteInterview(interviewID),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Interview Deleted',
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews });

      if (interview?.jobID) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.jobInterviews(interview.jobID),
        });
      }
      queryClient.removeQueries({
        queryKey: queryKeys.interview(interviewID),
      });
      navigation.goBack();
    },

    onError: error => {
      handleApiError(error);
    },
  });

  const handleConfirmDelete = () => {
    setConfirmVisible(false);
    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text>{error.message || 'Failed to load interview.'}</Text>
      </View>
    );
  }
  if (!interview) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Interview not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        {interview.companyName}
      </Text>
      <Text style={{ marginBottom: 15 }}>
        {interview.jobTitle}
      </Text>
      <Text>Type: {interview.interviewType}</Text>
      <Text>Result: {interview.result}</Text>
      {interview.interviewNotes ? (
        <>
          <Text style={{ marginTop: 15, fontWeight: 'bold' }}>
            Notes
          </Text>
          <Text>{interview.interviewNotes}</Text>
        </>
      ) : null}
      <View style={{ marginTop: 20 }}>
        <Button
          title="Edit Interview"
          onPress={() =>
            navigation.navigate('EditInterview', { interviewID })
          }
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <Button
          title={
            deleteMutation.isPending ? 'Deleting...' : 'Delete Interview'
          }
          color="red"
          onPress={() => setConfirmVisible(true)}
          disabled={deleteMutation.isPending}
        />
      </View>

      <ConfirmModal
        visible={confirmVisible}
        title="Delete Interview"
        message="Are you sure you want to delete this interview?"
        confirmLabel="Delete"
        destructive
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}