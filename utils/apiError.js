// @descCustom error class for API errors

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // Determine if the error is a client or server error
    this.isOperational = true; // Indicates that this is an operational error
    // Error.captureStackTrace(this, this.constructor);
  } 
};
module.exports = ApiError;
  
