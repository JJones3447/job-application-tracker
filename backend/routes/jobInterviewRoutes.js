const express = require('express');
const router = express.Router({ mergeParams: true });
const protect = require('../middleware/protect');
const {
  getInterviewsByJob,
  createInterviewForJob,
} = require('../controllers/interviewController');
const {validateInterview} = require('../middleware/validateInput');

router.use(protect);

router.route('/')
  .get(getInterviewsByJob)
  .post(validateInterview, createInterviewForJob);
module.exports = router;