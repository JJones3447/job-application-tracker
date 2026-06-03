const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { createUser, findUserByEmail } = require('../models/authModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const generateToken = (userID, email) => {
  return jwt.sign({ userID, email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return next(new AppError('Email already in use', 400));
  }

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = await createUser({ name, email, passwordHash });
  const token = generateToken(newUser.userID, newUser.email);

  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordValid) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = generateToken(user.userID, user.email);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        userID: user.userID,
        name: user.name,
        email: user.email,
      },
    },
  });
});