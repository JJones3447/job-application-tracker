const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

module.exports = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userID: decoded.userID,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
};