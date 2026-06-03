const {
  validateInterviewInput,
  validateJobInput,
  validateLoginInput,
  validateRegisterInput,
} = require('../utils/validateInput');
const AppError = require('../utils/appError');

function createValidationMiddleware(validator) {
  return (req, res, next) => {
    if (!req.body) {
      const error = new AppError('Request body is missing.', 400);
      return next(error);
    }

    const { valid, errors } = validator(req.body);

    if (!valid) {
      const error = new AppError('Validation failed.', 400);
      error.details = errors;
      return next(error);
    }

    next();
  };
}

const validateJob = createValidationMiddleware(validateJobInput);
const validateInterview = createValidationMiddleware(validateInterviewInput);
const validateRegister = createValidationMiddleware(validateRegisterInput);
const validateLogin = createValidationMiddleware(validateLoginInput);

module.exports = {
  validateJob,
  validateInterview,
  validateRegister,
  validateLogin,
};