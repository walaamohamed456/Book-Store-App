// utils/AppError.js
// A small custom Error subclass that carries an HTTP status code (and,
// optionally, a list of field-level validation messages). Controllers
// throw/next() these for expected error conditions (not found, not
// authorized, bad input, ...) and the central error-handling
// middleware in middleware/errorHandler.js turns them into a
// consistent JSON response.

class AppError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors; // optional array of field-level messages
    this.isOperational = true; // distinguishes "expected" errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
