import {useFocusEffect, useCallback, useState, useContext} from 'react';
import {View, Text, ActivityIndicator, Alert, Button} from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/authContext';

export default function JobDetailsScreen({route, navigation}){
    const {jobID} = route.params;
    const {logout} = useContext(AuthContext);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadJob = async () => {
        try {
            const res = await api.getJob(jobID);
            setJob(res.data.job);
        } catch (error){
            if (error.message === 'Unauthorized') logout();
            else {
                Alert.alert('Error', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadJob();
        }, [jobID])
    );

    if (loading) {
        return (
            <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    if (!job) {
        return (
            <View style={{ padding: 20 }}>
                <Text>Job not found.</Text>
            </View>
        );
    }

    const handleDelete = () => {
        Alert.alert(
            'Delete Job',
            'Are you sure you want to delete this job? This action cannot be undone.',
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
            await api.deleteJob(jobID);
            Alert.alert('Deleted', 'Job deleted successfully.');
            navigation.goBack();
        } catch (error) {
            if (error.status === 401) logout();
            else Alert.alert('Error', error.message);
        }
        };

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

      {job.applicationDate && (
        <Text>
          Applied on:{' '}
          {new Date(job.applicationDate).toDateString()}
        </Text>
      )}

      {job.notes && (
        <>
          <Text style={{ marginTop: 10, fontWeight: 'bold' }}>
            Notes
          </Text>
          <Text>{job.notes}</Text>
        </>
      )}
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