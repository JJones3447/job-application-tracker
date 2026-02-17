const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validateInput');
const protect = require('../middleware/protect');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user }
  });
});

module.exports = router;