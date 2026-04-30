import {
  View,
  Text,
  ActivityIndicator,
  Button,
  Platform,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import { getJob, getInterviewsForJob, deleteJob } from '../api';
import Toast from 'react-native-toast-message';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import handleApiError from '../utils/handleApiError';
import ConfirmModal from '../components/common/confirmModal';
import { formatDate, formatDateTime } from '../utils/dateUtils';

export default function JobDetailsScreen({ route, navigation }) {
  const { jobID } = route.params;
  const queryClient = useQueryClient();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const {
    data: jobData,
    isLoading: jobLoading,
    error: jobError,
  } = useQuery({
    queryKey: queryKeys.job(jobID),
    queryFn: () => getJob(jobID),
  });

  const {
    data: interviewsData,
    isLoading: interviewsLoading,
    error: interviewsError,
  } = useQuery({
    queryKey: queryKeys.jobInterviews(jobID),
    queryFn: () => getInterviewsForJob(jobID),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteJob(jobID),

    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Job Deleted',
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobs,
      });
      queryClient.removeQueries({
        queryKey: queryKeys.job(jobID),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.jobInterviews(jobID),
      });
      navigation.navigate('Jobs');
    },

    onError: error => {
      handleApiError(error);
    },
  });

  const handleConfirmDelete = () => {
    setConfirmVisible(false);
    deleteMutation.mutate();
  };

  if (jobLoading || interviewsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (jobError || interviewsError) {
    return (
      <View style={{ padding: 20 }}>
        <Text>
          {jobError?.message ||
            interviewsError?.message ||
            'Something went wrong'}
        </Text>
      </View>
    );
  }

  const job = jobData?.job;
  const interviews = interviewsData?.interviews || [];

  if (!job) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Job not found.</Text>
      </View>
    );
  }

  const renderInterview = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('InterviewDetails', {
          interviewID: item.interviewID,
        })
      }
      style={{ paddingVertical: 8 }}
    >
      <Text style={{ fontWeight: 'bold' }}>
        {item.interviewType} — {item.result}
      </Text>
      <Text>
        {item.interviewDate ? formatDateTime(item.interviewDate) : 'No date'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
          {job.companyName}
        </Text>
        <Text style={{ fontSize: 18 }}>{job.jobTitle}</Text>
        <Text>Status: {job.status}</Text>
        {job.location && <Text>Location: {job.location}</Text>}
        <Text>Listed Salary: {job.listedSalary || '-'}</Text>
        {job.technologies && (
          <Text>Technologies: {job.technologies}</Text>
        )}
        {job.jobURL && (
          <Text>
            Job URL:{' '}
            <Text
              style={{ color: 'blue' }}
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.open(job.jobURL, '_blank');
                }
              }}
            >
              {job.jobURL}
            </Text>
          </Text>
        )}
        {job.applicationDate && (
          <Text>Applied on: {formatDate(job.applicationDate)}</Text>
        )}
        {job.notes && (
          <>
            <Text style={{ marginTop: 10, fontWeight: 'bold' }}>
              Notes
            </Text>
            <Text>{job.notes}</Text>
          </>
        )}
        <View style={{ marginTop: 25 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            Interviews
          </Text>
          <FlatList
            data={interviews}
            keyExtractor={item => item.interviewID.toString()}
            renderItem={renderInterview}
            ListEmptyComponent={
              <Text style={{ marginTop: 10 }}>
                No interviews recorded.
              </Text>
            }
          />
          <View style={{ marginTop: 10 }}>
            <Button
              title="Add Interview"
              onPress={() =>
                navigation.navigate('CreateInterview', { jobID })
              }
            />
          </View>
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <Button
          title="Edit Job"
          onPress={() => navigation.navigate('EditJob', { jobID })}
        />
        <View style={{ marginTop: 10 }}>
          <Button
            title={deleteMutation.isPending ? 'Deleting...' : 'Delete Job'}
            color="red"
            onPress={() => setConfirmVisible(true)}
            disabled={deleteMutation.isPending}
          />
        </View>
      </View>

      <ConfirmModal
        visible={confirmVisible}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}