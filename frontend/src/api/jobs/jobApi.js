import { del, get, post, put } from '../client/request';

export const getJobs = () => get('/api/jobs');

export const getJob = jobID => get(`/api/jobs/${jobID}`);

export const createJob = jobData => post('/api/jobs', jobData);

export const updateJob = (jobID, jobData) => put(`/api/jobs/${jobID}`, jobData);

export const deleteJob = jobID => del(`/api/jobs/${jobID}`);