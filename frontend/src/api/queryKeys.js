export const queryKeys = {
  jobs: ['jobs'],
  job: (jobID) => ['job', jobID],

  interviews: ['interviews'],
  interview: (interviewID) => ['interview', interviewID],

  jobInterviews: (jobID) => ['jobInterviews', jobID],
};
