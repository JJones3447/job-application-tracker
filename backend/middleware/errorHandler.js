function errorHandler(error, req, res, next){
    console.error('Error: ', error);
    const statusCode = error.statusCode || 500;
    let type = 'server';
    
    if (statusCode === 400) type = 'validation';
    if (statusCode === 401) type = 'auth';
    if (statusCode === 404) type = 'not_found';

  res.status(statusCode).json({
    success: false,
    error: {
      type,
      message:
        error.isOperational && error.message
          ? error.message
          : 'Something went wrong on the server.',
      details: error.details || null,
    },
  });
}

module.exports = errorHandler;