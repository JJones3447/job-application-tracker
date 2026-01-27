import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
const BASE_URL = Constants.expoConfig.extra.apiUrl;

const request = async (endpoint, method = 'GET', body = null) => {
  const token = await AsyncStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export default {
  login: (credentials) =>
    request('/authentication/login', 'POST', credentials),

  register: (data) =>
    request('/authentication/register', 'POST', data),

  getJobs: () =>
    request('/api/jobs'),

  createJob: (job) =>
    request('/api/jobs', 'POST', job),

  getInterviewsForJob: (jobID) =>
    request(`/api/jobs/${jobID}/interviews`),
};