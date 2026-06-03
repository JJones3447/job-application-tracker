const Job = require('../models/jobModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getJobs = catchAsync(async (req, res, next) => {
  const jobs = await Job.getAllJobs(req.user.userID);

  res.status(200).json({
    status: 'success',
    results: jobs.length,
    data: { jobs },
  });
});

exports.getJob = catchAsync(async (req, res, next) => {
  const job = await Job.getJobById(req.params.id, req.user.userID);

  if (!job) {
    return next(new AppError('Job not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { job },
  });
});

exports.createJob = catchAsync(async (req, res, next) => {
  const newJob = await Job.createJob({
    ...req.body,
    userID: req.user.userID,
  });

  res.status(201).json({
    status: 'success',
    data: { job: newJob },
  });
});

exports.updateJob = catchAsync(async (req, res, next) => {
  const existingJob = await Job.getJobById(req.params.id, req.user.userID);

  if (!existingJob) {
    return next(new AppError('Job not found', 404));
  }

  const updatedJob = await Job.updateJob(
    req.params.id,
    req.user.userID,
    req.body
  );

  res.status(200).json({
    status: 'success',
    data: { job: updatedJob },
  });
});

exports.deleteJob = catchAsync(async (req, res, next) => {
  const existingJob = await Job.getJobById(req.params.id, req.user.userID);

  if (!existingJob) {
    return next(new AppError('Job not found', 404));
  }

  await Job.deleteJob(req.params.id, req.user.userID);

  res.status(200).json({
    status: 'success',
    message: 'Job deleted successfully',
  });
});