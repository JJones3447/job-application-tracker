import {View, Text, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import { useState, useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { AuthContext } from '../context/authContext';

export default function InterviewsScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInterviews = async () => {
    try {
      setLoading(true);
      const res = await api.getInterviews();
      setInterviews(res.data.interviews);
    } catch (err) {
      if (err.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadInterviews();
    }, [])
  );

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
        Date:{' '}
        {item.interviewDate
          ? new Date(item.interviewDate).toLocaleString()
          : 'N/A'}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={interviews}
        keyExtractor={item => item.interviewID.toString()}
        renderItem={renderInterview}
        ListEmptyComponent={
          <Text style={{ padding: 20 }}>
            No Documented interviews found.
          </Text>
        }
      />
    </View>
  );
}