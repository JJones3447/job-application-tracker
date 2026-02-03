import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL =  'http://192.168.1.210:3000';

const request = async (endpoint, method = 'GET', body = null) => {
  const token = await AsyncStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  console.log(`[API Request] ${method} ${endpoint}`, body ? body : '');
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json();
  console.log(`[API Response] ${method} ${endpoint}`, data);

  if (res.status === 400) {
    await AsyncStorage.removeItem('token');
    throw new Error('Unauthorized');
  }

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