import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInterviews } from '../api';
import Toast from 'react-native-toast-message';
import { queryKeys } from '../api/queryKeys';
import { formatDateTime } from '../utils/dateUtils';

export default function InterviewsScreen({ navigation }) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.interviews,
    queryFn: getInterviews,
  });

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load interviews',
        text2: error.message,
      });
    }
  }, [error]);

  const interviews = data?.interviews || [];

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
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
      style={{ padding: 12, borderBottomWidth: 1 }}
    >
      <Text style={{ fontWeight: 'bold' }}>
        {item.companyName} — {item.jobTitle}
      </Text>
      <Text>Type: {item.interviewType}</Text>
      <Text>Result: {item.result}</Text>
      <Text>
        Date: {formatDateTime(item.interviewDate) || 'N/A'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={interviews}
        keyExtractor={item => item.interviewID.toString()}
        renderItem={renderInterview}
        ListEmptyComponent={
          <Text style={{ padding: 20 }}>
            No documented interviews found.
          </Text>
        }
      />
    </View>
  );
}