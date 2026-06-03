import { del, get, post, put } from '../client/request';

export const getInterviews = () => get('/api/interviews');

export const getInterview = interviewID => get(`/api/interviews/${interviewID}`);

export const getInterviewsForJob = jobID =>
  get(`/api/jobs/${jobID}/interviews`);

export const createInterviewForJob = (jobID, interviewData) =>
  post(`/api/jobs/${jobID}/interviews`, interviewData);

export const updateInterview = (interviewID, interviewData) =>
  put(`/api/interviews/${interviewID}`, interviewData);

export const deleteInterview = interviewID =>
  del(`/api/interviews/${interviewID}`);