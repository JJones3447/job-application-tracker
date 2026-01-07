const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');

const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const {validateJob} = require('../middleware/validateInput');

router.use(protect);

router.route('/')
  .get(getJobs)
  .post(validateJob, createJob);

router.route('/:id')
  .get(getJob)
  .put(validateJob, updateJob)
  .delete(deleteJob);

module.exports = router;