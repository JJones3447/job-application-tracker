import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.210:3000';

let logoutHandler = null;

export const setLogoutHandler = handler => {
  logoutHandler = handler;
};

const request = async (endpoint, method = 'GET', body = null) => {
  const token = await AsyncStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log(`[API Request] ${method} ${endpoint}`, body || '');

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  console.log(`[API Response] ${method} ${endpoint}`, data);

  if (!res.ok) {
    if (res.status === 401 && logoutHandler) {
      await AsyncStorage.removeItem('token');
      logoutHandler();
    }

    const error = new Error(data.error?.message || 'Something went wrong');
    error.status = res.status;
    error.type = data.error?.type;
    error.details = data.error?.details;

    throw error;
  }

  return data;
};

export default {
  login: credentials =>
    request('/authentication/login', 'POST', credentials),

  register: data =>
    request('/authentication/register', 'POST', data),

  getMe: () =>
    request('/authentication/me'),

  getJobs: () =>
    request('/api/jobs'),

  getJob: jobID =>
    request(`/api/jobs/${jobID}`),

  createJob: job =>
    request('/api/jobs', 'POST', job),

  updateJob: (jobID, job) =>
    request(`/api/jobs/${jobID}`, 'PUT', job),

  deleteJob: jobID =>
    request(`/api/jobs/${jobID}`, 'DELETE'),

  getInterviewsForJob: jobID =>
    request(`/api/jobs/${jobID}/interviews`),
};