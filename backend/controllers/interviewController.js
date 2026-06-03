const Interview = require('../models/interviewModel');
const Job = require('../models/jobModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllInterviews = catchAsync(async (req, res, next) => {
  const filters = {
    result: req.query.result,
    interviewType: req.query.interviewType,
  };

  const interviews = await Interview.getAllInterviews(
    req.user.userID,
    filters
  );

  res.status(200).json({
    status: 'success',
    results: interviews.length,
    data: { interviews },
  });
});

exports.getInterviewsByJob = catchAsync(async (req, res, next) => {
  const { jobID } = req.params;
  const job = await Job.getJobById(jobID, req.user.userID);

  if (!job) {
    return next(new AppError('Job not found', 404));
  }

  const interviews = await Interview.getInterviewsByJobId(
    jobID,
    req.user.userID
  );

  res.status(200).json({
    status: 'success',
    results: interviews.length,
    data: { interviews },
  });
});

exports.createInterviewForJob = catchAsync(async (req, res, next) => {
  const { jobID } = req.params;

  const newInterview = await Interview.createInterview(req.user.userID, {
    ...req.body,
    jobID,
  });

  if (!newInterview) {
    return next(new AppError('Job not found or not authorized', 404));
  }

  res.status(201).json({
    status: 'success',
    data: { interview: newInterview },
  });
});

exports.getInterviewById = catchAsync(async (req, res, next) => {
  const interview = await Interview.getInterviewById(
    req.params.id,
    req.user.userID
  );

  if (!interview) {
    return next(new AppError('Interview not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { interview },
  });
});

exports.updateInterview = catchAsync(async (req, res, next) => {
  const existing = await Interview.getInterviewById(
    req.params.id,
    req.user.userID
  );

  if (!existing) {
    return next(new AppError('Interview not found', 404));
  }

  const updated = await Interview.updateInterview(
    req.params.id,
    req.user.userID,
    req.body
  );

  res.status(200).json({
    status: 'success',
    data: { interview: updated },
  });
});

exports.deleteInterview = catchAsync(async (req, res, next) => {
  const existing = await Interview.getInterviewById(
    req.params.id,
    req.user.userID
  );

  if (!existing) {
    return next(new AppError('Interview not found', 404));
  }

  await Interview.deleteInterview(req.params.id, req.user.userID);

  res.status(200).json({
    status: 'success',
    message: 'Interview deleted successfully',
  });
});