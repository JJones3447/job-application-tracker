import {View, Text, ActivityIndicator, Alert, Button, Platform, FlatList, TouchableOpacity} from 'react-native';
import { useCallback, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { AuthContext } from '../context/authContext';
import Toast from 'react-native-toast-message';

export default function JobDetailsScreen({ route, navigation }) {
  const { jobID } = route.params;
  const { logout } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const jobRes = await api.getJob(jobID);
      setJob(jobRes.data.job);
      const interviewRes = await api.getInterviewsForJob(jobID);
      setInterviews(interviewRes.data.interviews);
    } catch (error) {
      if (error.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [jobID])
  );

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Are you sure you want to delete this job? This action cannot be undone.'
      );
      if (confirmed) confirmDelete();
      return;
    }

    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDelete },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      await api.deleteJob(jobID);
      Toast.show({
        type: 'success',
        text1: 'Job Deleted',
      });
      navigation.navigate('Jobs');
    } catch (error) {
      if (error.status === 401) logout();
      else Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
        {item.interviewDate
          ? new Date(item.interviewDate).toLocaleString()
          : ''}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
          {job.companyName}
        </Text>
        <Text style={{ fontSize: 18 }}>
          {job.jobTitle}
        </Text>
        <Text>Status: {job.status}</Text>
        {job.location && <Text>Location: {job.location}</Text>}
        <Text>Listed Salary: {job.listedSalary || '-'}</Text>
        {job.technologies && <Text>Technologies: {job.technologies}</Text>}
        {job.jobURL && (
          <Text>
            Job URL:{' '}
            <Text
              style={{ color: 'blue' }}
              onPress={() => {
                if (Platform.OS === 'web') window.open(job.jobURL, '_blank');
              }}
            >
              {job.jobURL}
            </Text>
          </Text>
        )}
        {job.applicationDate && (
          <Text>
            Applied on: {new Date(job.applicationDate).toDateString()}
          </Text>
        )}
        {job.notes && (
          <>
            <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Notes</Text>
            <Text>{job.notes}</Text>
          </>
        )}
        <View style={{ marginTop: 25 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            Interviews
          </Text>
          <FlatList
            data={interviews}
            keyExtractor={(item) =>
              item.interviewID.toString()
            }
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
                navigation.navigate('CreateInterview', {
                  jobID,
                })
              }
            />
          </View>
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <Button
          title="Edit Job"
          onPress={() =>
            navigation.navigate('EditJob', { jobID })
          }
        />
        <View style={{ marginTop: 10 }}>
          <Button
            title="Delete Job"
            color="red"
            onPress={handleDelete}
          />
        </View>
      </View>
    </View>
  );
}