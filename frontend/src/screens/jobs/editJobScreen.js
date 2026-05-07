import { useState } from 'react';
import { getJob, updateJob } from '../../api';
import JobForm from '../../components/forms/domains/jobs/jobForm';
import mapBackendErrors from '../../utils/mapBackendErrors';
import handleApiError from '../../utils/handleApiError';
import Toast from 'react-native-toast-message';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../api/queryKeys';
import AppScreen from '../../components/common/AppScreen';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';

export default function EditJobScreen({ route, navigation }) {
  const { jobID } = route.params;
  const queryClient = useQueryClient();
  const [formErrors, setFormErrors] = useState({});

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.job(jobID),
    queryFn: () => getJob(jobID),
  });

  const updateMutation = useMutation({
    mutationFn: payload => updateJob(jobID, payload),
    onSuccess: updated => {
      Toast.show({
        type: 'success',
        text1: 'Job Updated',
      });
      queryClient.setQueryData(
        queryKeys.job(jobID),
        updated
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobs,
      });
      navigation.goBack();
    },

    onError: error => {
      handleApiError(error, setFormErrors, mapBackendErrors);
    },
  });

  const job = data?.job;

  const formData = job
    ? {
        companyName: job.companyName ?? '',
        jobTitle: job.jobTitle ?? '',
        listedSalary: job.listedSalary ?? '',
        location: job.location ?? '',
        technologies: job.technologies ?? '',
        jobURL: job.jobURL ?? '',
        applicationDate: job.applicationDate
          ? job.applicationDate.slice(0, 10)
          : '',
        status: job.status ?? 'Applied',
        notes: job.notes ?? '',
      }
    : null;

  if (isLoading) return <LoadingState message="Loading job..." />;

  if (error || !formData) {
    return <ErrorState message={error?.message || 'Failed to load job.'} />;
  }

  return (
    <AppScreen>
      <JobForm
        initialValues={formData}
        onSubmit={payload => {
          setFormErrors({});
          updateMutation.mutate(payload);
        }}
        submitLabel="Save Changes"
        loading={updateMutation.isPending}
        errors={formErrors}
      />
    </AppScreen>
  );
}