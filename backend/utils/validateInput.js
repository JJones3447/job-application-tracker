function isValidDate(dateStr) {
  const date = new Date(dateStr);

  return !Number.isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

function isValidDateTime(dateStr) {
  const date = new Date(dateStr);
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

  return !Number.isNaN(date.getTime()) && isoRegex.test(dateStr);
}

function validateJobInput(job) {
  const errors = [];

  const trimmedFields = [
    'companyName',
    'jobTitle',
    'listedSalary',
    'location',
    'jobURL',
    'status',
  ];

  for (const field of trimmedFields) {
    if (typeof job[field] === 'string') {
      job[field] = job[field].trim();
    }
  }

  if (
    !job.companyName ||
    typeof job.companyName !== 'string' ||
    job.companyName.length === 0
  ) {
    errors.push('Company name is required and must be a non-empty string.');
  } else if (job.companyName.length > 100) {
    errors.push('Company name cannot exceed 100 characters.');
  }

  if (
    !job.jobTitle ||
    typeof job.jobTitle !== 'string' ||
    job.jobTitle.length === 0
  ) {
    errors.push('Job title is required and must be a non-empty string.');
  } else if (job.jobTitle.length > 100) {
    errors.push('Job title cannot exceed 100 characters.');
  }

  if (job.listedSalary && job.listedSalary.length > 50) {
    errors.push('Listed salary cannot exceed 50 characters.');
  }

  if (job.location && job.location.length > 100) {
    errors.push('Location cannot exceed 100 characters.');
  }

  if (job.technologies && typeof job.technologies !== 'string') {
    errors.push('Technologies must be a string (comma-separated if multiple).');
  }

  if (job.jobURL) {
    try {
      new URL(job.jobURL);
    } catch {
      errors.push('Job URL must be a valid URL.');
    }
  }

  if (job.applicationDate && !isValidDate(job.applicationDate)) {
    errors.push('Application date must be a valid date in YYYY-MM-DD format.');
  }

  const validStatuses = [
    'Applied',
    'Interviewing',
    'Rejected',
    'Offer',
    'Accepted',
  ];

  if (job.status && !validStatuses.includes(job.status)) {
    errors.push(
      `Status must be one of the following: ${validStatuses.join(', ')}.`
    );
  }

  if (job.notes && typeof job.notes !== 'string') {
    errors.push('Notes must be text.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateInterviewInput(interview) {
  const errors = [];

  if (!interview.interviewDate || !isValidDateTime(interview.interviewDate)) {
    errors.push(
      'Interview date is required and must be a valid ISO datetime (YYYY-MM-DDTHH:MM:SSZ).'
    );
  }

  const validTypes = [
    'Phone',
    'Technical',
    'HR',
    'Behavioral',
    'On-site',
    'Other',
  ];

  if (!interview.interviewType || !validTypes.includes(interview.interviewType)) {
    errors.push(
      `Interview type is required and must be one of the following: ${validTypes.join(
        ', '
      )}.`
    );
  }

  const validResults = ['Pending', 'Passed', 'Failed', 'Offer Extended'];

  if (interview.result && !validResults.includes(interview.result)) {
    errors.push(
      `Result must be one of the following: ${validResults.join(', ')}.`
    );
  }

  if (interview.interviewNotes && typeof interview.interviewNotes !== 'string') {
    errors.push('Interview notes must be text.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateRegisterInput(data) {
  const errors = [];

  if (
    !data.name ||
    typeof data.name !== 'string' ||
    data.name.trim().length === 0
  ) {
    errors.push('Name is required and must be a non-empty string.');
  }

  if (
    !data.email ||
    typeof data.email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  ) {
    errors.push('Valid email is required.');
  }

  if (
    !data.password ||
    typeof data.password !== 'string' ||
    data.password.length < 6
  ) {
    errors.push('Password is required and must be at least 6 characters long.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateLoginInput(data = {}) {
  const errors = [];

  if (
    !data.email ||
    typeof data.email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  ) {
    errors.push('Valid email is required.');
  }

  if (
    !data.password ||
    typeof data.password !== 'string' ||
    data.password.length === 0
  ) {
    errors.push('Password is required.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  validateJobInput,
  validateInterviewInput,
  validateRegisterInput,
  validateLoginInput,
};