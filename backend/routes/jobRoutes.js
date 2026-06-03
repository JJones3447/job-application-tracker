const express = require('express');

const {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  updateJob,
} = require('../controllers/jobController');
const protect = require('../middleware/protect');
const { validateJob } = require('../middleware/validateInput');

const router = express.Router();

router.use(protect);

router.route('/').get(getJobs).post(validateJob, createJob);

router.route('/:id').get(getJob).put(validateJob, updateJob).delete(deleteJob);

module.exports = router;