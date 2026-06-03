import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { createJob } from '../../api';
import { queryKeys } from '../../api/queryKeys';
import AppScreen from '../../components/common/AppScreen';
import JobForm from '../../components/forms/domains/jobs/jobForm';
import { getTodayString } from '../../utils/dateUtils';
import handleApiError from '../../utils/handleApiError';
import mapBackendErrors from '../../utils/mapBackendErrors';

export default function CreateJobScreen({ navigation }) {
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState({});

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

    onError: error => {
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
    <AppScreen>
      <JobForm
        initialValues={initialValues}
        onSubmit={payload => {
          setErrors({});
          createJobMutation.mutate(payload);
        }}
        submitLabel="Create Job"
        loading={createJobMutation.isPending}
        errors={errors}
      />
    </AppScreen>
  );
}