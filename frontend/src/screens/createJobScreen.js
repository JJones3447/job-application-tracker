import { View } from 'react-native';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJob } from '../api';
import JobForm from '../components/forms/domains/jobs/jobForm';
import mapBackendErrors from '../utils/mapBackendErrors';
import handleApiError from '../utils/handleApiError';
import Toast from 'react-native-toast-message';
import { queryKeys } from '../api/queryKeys';
import { getTodayString } from '../utils/dateUtils';

export default function CreateJobScreen({ navigation }) {
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
      Toast.show({
        type: 'success',
        text1: 'Job Created',
        text2: 'Your job was added successfully.',
      });
      navigation.goBack();
    },

    onError: (error) => {
      handleApiError(error, setErrors, mapBackendErrors);
    },
  });

  const initialValues = {
    companyName: '',
    jobTitle: '',
    listedSalary: '',
    location: '',
    technologies: '',
    jobURL: '',
    applicationDate: getTodayString(),
    status: 'Applied',
    notes: '',
  };

  return (
    <View style={{ flex: 1 }}>
      <JobForm
        initialValues={initialValues}
        onSubmit={(payload) => {
          setErrors({});
          createJobMutation.mutate(payload);
        }}
        submitLabel="Create Job"
        loading={createJobMutation.isPending}
        errors={errors}
      />
    </View>
  );
}