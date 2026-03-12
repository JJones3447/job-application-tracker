export const INTERVIEW_TYPES = [
  { label: 'Phone', value: 'Phone' },
  { label: 'Behavioral', value: 'Behavioral' },
  { label: 'Onsite', value: 'Onsite' },
  { label: 'Technical', value: 'Technical' },
  { label: 'HR', value: 'HR' },
  { label: 'Other', value: 'Other'}
];

export const INTERVIEW_RESULTS = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Passed', value: 'Passed' },
  { label: 'Failed', value: 'Failed' },
  { label: 'Offer Extended', value: 'Offer Extended' },
];

export const JOB_STATUS_OPTIONS = [
  { label: 'Applied', value: 'Applied' },
  { label: 'Interviewing', value: 'Interviewing' },
  { label: 'Offer', value: 'Offer' },
  { label: 'Rejected', value: 'Rejected' },
  { label: 'Accepted', value: 'Accepted' },
];

export const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}));

export const MINUTE_OPTIONS = [
  { label: '00', value: '00' },
  { label: '15', value: '15' },
  { label: '30', value: '30' },
  { label: '45', value: '45' },
];

export const PERIOD_OPTIONS = [
  { label: 'AM', value: 'AM' },
  { label: 'PM', value: 'PM' },
];