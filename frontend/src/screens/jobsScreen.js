import { useEffect, useContext } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../context/authContext';
import { getJobs } from '../api';
import Toast from 'react-native-toast-message';
import { queryKeys } from '../api/queryKeys';

export default function JobsScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.jobs,
    queryFn: getJobs,
  });

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load jobs',
        text2: error.message,
      });
    }
  }, [error]);

  const jobs = data?.jobs || [];

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderJob = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('JobDetails', { jobID: item.jobID })
      }
      style={{ padding: 12, borderBottomWidth: 1 }}
    >
      <Text>{item.companyName}</Text>
      <Text>{item.jobTitle}</Text>
      <Text>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        <Button title="Add Job" onPress={() => navigation.navigate('CreateJob')} />
      </View>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.jobID.toString()}
        renderItem={renderJob}
        ListEmptyComponent={
          <Text style={{ padding: 20 }}>No documented jobs found.</Text>
        }
      />

      <View style={{ padding: 10 }}>
        <Button title="Logout" onPress={logout} />
      </View>
    </View>
  );
}