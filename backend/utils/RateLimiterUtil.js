const rateLimit = require('express-rate-limit');

const createLimiter = (windowMs, max, message, label) => rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            status: false,
            message,
            label: label || 'RATE_LIMITED'
        });
    }
});

const globalLimiter = createLimiter(
    15 * 60 * 1000,
    1000,
    'Too many requests from this IP, please try again after 15 minutes.',
    'RATE_LIMITED'
);

const authLimiter = createLimiter(
    15 * 60 * 1000,
    15,
    'Too many login attempts, please try again after 15 minutes.',
    'AUTH_RATE_LIMITED'
);

module.exports = {
    globalLimiter,
    authLimiter
};
