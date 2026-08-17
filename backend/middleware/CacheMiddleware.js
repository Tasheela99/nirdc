const cacheService = require('../services/CacheService');
const logger = require('../utils/LoggerUtil');

/**
 * Cache Middleware for Express GET routes
 * @param {number} ttlSeconds Time to live in seconds (default 300 = 5 minutes)
 * @param {string} prefix Key prefix for scoping
 */
const cacheMiddleware = (ttlSeconds = 300, prefix = 'cache') => {
    return async (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const cacheKey = `${prefix}_${req.originalUrl || req.url}`;

        try {
            const cachedData = await cacheService.get(cacheKey);
            if (cachedData) {
                logger.debug(`⚡ Cache HIT for [${cacheKey}]`);
                res.setHeader('X-Cache', 'HIT');
                return res.status(200).json(cachedData);
            }

            logger.debug(`🔍 Cache MISS for [${cacheKey}]`);
            res.setHeader('X-Cache', 'MISS');

            // Intercept res.json to store in cache before sending
            const originalJson = res.json.bind(res);
            res.json = (body) => {
                // Only cache successful 200 responses with data
                if (res.statusCode === 200 && body && body.status !== false) {
                    cacheService.set(cacheKey, body, ttlSeconds).catch((err) => {
                        logger.warn(`Failed to set cache key '${cacheKey}': ${err.message}`);
                    });
                }
                return originalJson(body);
            };

            next();
        } catch (error) {
            logger.error(`Cache middleware error: ${error.message}`);
            next();
        }
    };
};

module.exports = cacheMiddleware;
