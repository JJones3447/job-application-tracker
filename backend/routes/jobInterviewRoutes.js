const express = require('express');

const {
  createInterviewForJob,
  getInterviewsByJob,
} = require('../controllers/interviewController');
const protect = require('../middleware/protect');
const { validateInterview } = require('../middleware/validateInput');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getInterviewsByJob)
  .post(validateInterview, createInterviewForJob);

module.exports = router;