const express = require('express');

const { login, register } = require('../controllers/authController');
const {
  validateLogin,
  validateRegister,
} = require('../middleware/validateInput');
const protect = require('../middleware/protect');

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

router.get('/me', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user },
  });
});

module.exports = router;