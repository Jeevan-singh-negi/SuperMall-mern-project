// NEW & IMPROVED ApiError Class
export class ApiError extends Error {
  constructor(
    statusCode,
    message = 'Something went wrong',
    errors = [],
    stack = ""
  ) {
    super(message); // Call the parent Error constructor with the message
    this.statusCode = statusCode;
    this.data = null; // Consistent with ApiResponse
    this.message = message;
    this.success = false; // Indicates an error
    this.errors = errors; // Array for detailed error messages (e.g., validation)

    // Capture the stack trace for better debugging in non-production environments
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Middleware for handling 404 (Not Found) errors
export const notFound = (req, res, next) => {
  // Use the new ApiError structure
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error); // Pass the error to the next error handling middleware
};

// General Error Handling Middleware
export const errorHandler = (err, req, res, next) => {
  // Use the error's own status code or default to 500
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Enhanced handling for specific Mongoose errors
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Resource not found. Invalid ID: ${err.value}`;
    // Optionally, you could add this error to the errors array:
    // errors.push(`Invalid ID: ${err.value}`);
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value for <span class="math-inline">\{field\}\: '</span>{err.keyValue[field]}'. Please use another value.`;
    // Optionally, add to errors array:
    // errors.push(`Duplicate value for ${field}`);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    // Collect all validation error messages into an array
    const validationErrors = Object.values(err.errors).map((val) => val.message);
    message = 'Validation failed'; // Generic message for validation errors
    err.errors = validationErrors; // Pass detailed errors from the validation
  }

  // In production, don't leak stack trace details
  const stack = process.env.NODE_ENV === 'production' ? null : err.stack;

  res.status(statusCode).json({
    success: err.success || false, // Should be false for errors
    message: message,
    errors: err.errors, // Include the detailed errors array
    stack: stack, // Only send stack trace in development
  });
};