import {useEffect, useState, useContext} from 'react';
import {View, Text, ActivityIndicator, Alert} from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/authContext';

export default function JobDetailsScreen({route}){
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

    useEffect(() => {
        loadJob();
    }, []);

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

    return (
        <View style={{padding: 20}}>
            <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                {job.companyName}
            </Text>
            <Text style ={{fontSize: 18}}>
                {job.jobTitle}
            </Text>
            <Text>Status: {job.status}</Text>
            {job.location && <Text>Location: {job.location}</Text>}
            {job.applicationDate && (<Text>Applied on: {job.applicationDate}</Text>)}
            {job.notes && (
        <>
          <Text style={{ marginTop: 10, fontWeight: 'bold' }}>
            Notes
          </Text>
          <Text>{job.notes}</Text>
        </>
      )}
        </View>
    )
}