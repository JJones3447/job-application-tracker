const express = require('express');

const {
  deleteInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
} = require('../controllers/interviewController');
const protect = require('../middleware/protect');
const { validateInterview } = require('../middleware/validateInput');

const router = express.Router();

router.use(protect);

router.route('/').get(getAllInterviews);

router
  .route('/:id')
  .get(getInterviewById)
  .put(validateInterview, updateInterview)
  .delete(deleteInterview);

module.exports = router;