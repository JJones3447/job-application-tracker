import {View, Text, ActivityIndicator, Button, Alert, Platform} from 'react-native';
import { useState, useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../context/authContext';

export default function InterviewDetailsScreen({ route, navigation }) {
  const { interviewID } = route.params;
  const { logout } = useContext(AuthContext);

  const [interview, setInterview] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadInterview = async () => {
    try {
      setLoading(true);
      const res = await api.getInterview(interviewID);
      const interviewData = res.data.interview;
      setInterview(interviewData);
      if (interviewData?.jobID) {
        const jobRes = await api.getJob(interviewData.jobID);
        setJob(jobRes.data.job);
      }
    } catch (err) {
      if (err.status === 401) {
        logout();
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadInterview();
    }, [interviewID])
  );

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Are you sure you want to delete this interview? This action cannot be undone.'
      );
      if (confirmed) confirmDelete();
      return;
    }

    Alert.alert(
      'Delete Interview',
      'Are you sure you want to delete this interview? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      await api.deleteInterview(interviewID);
      Toast.show({
        type: 'success',
        text1: 'Interview Deleted',
      });
      navigation.goBack();
    } catch (err) {
      if (err.status === 401) logout();
      else Alert.alert('Error', err.message);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
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
      <View style={{ flex: 1 }}>
        {job && (
          <>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {job.companyName}
            </Text>
            <Text style={{ fontSize: 16 }}>
              {job.jobTitle}
            </Text>
            <Text style={{ marginBottom: 10 }}>
              Status: {job.status}
            </Text>
          </>
        )}
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          Interview Details
        </Text>
        <Text>
          Date:{' '}
          {interview.interviewDate
            ? new Date(interview.interviewDate).toLocaleString()
            : 'N/A'}
        </Text>
        <Text>Type: {interview.interviewType}</Text>
        <Text>Result: {interview.result}</Text>
        {interview.interviewNotes && (
          <>
            <Text style={{ marginTop: 10, fontWeight: 'bold' }}>
              Notes
            </Text>
            <Text>{interview.interviewNotes}</Text>
          </>
        )}
      </View>
      <View style={{ marginTop: 20 }}>
        <Button
          title="Edit Interview"
          onPress={() =>
            navigation.navigate('EditInterview', {
              interviewID,
            })
          }
        />
        <View style={{ marginTop: 10 }}>
          <Button
            title="Delete Interview"
            color="red"
            onPress={handleDelete}
          />
        </View>
      </View>
    </View>
  );
}