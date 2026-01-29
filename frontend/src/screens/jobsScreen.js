import { View, Text, Button, FlatList, TouchableOpacity, ActivityIndicator,
  Alert } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import api from '../services/api';

export default function JobsScreen({navigation}) {
  const { logout } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await api.getJobs();
      setJobs(res.data.jobs);
    } catch (error) {
      Alert.alert('Error: ', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const renderJob = ({item}) => (
    <TouchableOpacity onPress={() => {
      // Still need navigation
      console.log('Selected jobID: ', item.jobID);
    }}
    style={{padding: 12, borderBottomWidth: 1}}
    >
      <Text>{item.companyName}</Text>
      <Text>{item.jobTitle}</Text>
      <Text>Status: {item.status}</Text>
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
    <View style={{flex: 1}}>
      <FlatList
        data={jobs} keyExtractor={(item) => item.jobID.toString()}
        renderItem={renderJob}
        ListEmptyComponent={
          <Text style={{padding: 20}}>No documented jobs found.</Text>
        }
      />
      <View style ={{padding: 10}}>
        <Button title="Logout" onPress={logout} />
      </View>
    </View>
  );
}