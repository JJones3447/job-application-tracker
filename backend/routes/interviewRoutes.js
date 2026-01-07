const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const {
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
} = require('../controllers/interviewController');
const {validateInterview} = require('../middleware/validateInput');

router.use(protect);

router.route('/')
  .get(getAllInterviews);

router.route('/:id')
  .get(getInterviewById)
  .put(validateInterview, updateInterview)
  .delete(deleteInterview);

module.exports = router;