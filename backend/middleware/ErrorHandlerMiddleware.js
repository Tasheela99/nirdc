const logger = require('../utils/LoggerUtil');

/**
 * Express Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
    logger.error('Unhandled Error caught in middleware:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            status: false,
            label: 'VALIDATION_ERROR',
            message: 'Validation error occurred.',
            errors,
        });
    }

    // Mongoose Duplicate Key Error
    if (err.code && err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            status: false,
            label: 'DUPLICATE_FIELD',
            message: `A record with this ${field} already exists.`,
        });
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: false,
            label: 'INVALID_TOKEN',
            message: 'Invalid authorization token.',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: false,
            label: 'TOKEN_EXPIRED',
            message: 'Session expired. Please sign in again.',
        });
    }

    // Default Internal Server Error
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    return res.status(statusCode).json({
        status: false,
        label: 'SERVER_ERROR',
        message: process.env.NODE_ENV === 'production'
            ? 'An internal server error occurred. Please try again later.'
            : err.message || 'Internal server error.',
    });
};

module.exports = errorHandler;
