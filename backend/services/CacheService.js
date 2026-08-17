const NodeCache = require('node-cache');
const { createClient } = require('redis');
const logger = require('../utils/LoggerUtil');

class CacheService {
    constructor() {
        // Local in-memory fallback cache (default TTL: 10 minutes)
        this.memoryCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
        this.redisClient = null;
        this.isRedisConnected = false;

        this.initRedis();
    }

    async initRedis() {
        const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
        try {
            this.redisClient = createClient({ url: redisUrl });

            this.redisClient.on('error', (err) => {
                if (this.isRedisConnected) {
                    logger.warn(`Redis disconnected. Falling back to in-memory cache: ${err.message}`);
                    this.isRedisConnected = false;
                }
            });

            this.redisClient.on('connect', () => {
                this.isRedisConnected = true;
                logger.info('✅ Connected to Redis cache service.');
            });

            await this.redisClient.connect().catch((err) => {
                logger.info('ℹ️ Redis server not detected locally. Utilizing in-memory NodeCache.');
            });
        } catch (error) {
            logger.info('ℹ️ Using in-memory NodeCache fallback for caching.');
        }
    }

    /**
     * Get cached value by key
     */
    async get(key) {
        try {
            if (this.isRedisConnected && this.redisClient) {
                const data = await this.redisClient.get(key);
                return data ? JSON.parse(data) : null;
            }
        } catch (err) {
            logger.warn(`Redis GET failed for key '${key}', using memory cache fallback.`);
        }
        return this.memoryCache.get(key) || null;
    }

    /**
     * Set cache value with TTL in seconds
     */
    async set(key, value, ttlSeconds = 600) {
        try {
            const stringVal = JSON.stringify(value);
            if (this.isRedisConnected && this.redisClient) {
                await this.redisClient.set(key, stringVal, { EX: ttlSeconds });
            }
        } catch (err) {
            logger.warn(`Redis SET failed for key '${key}'.`);
        }
        this.memoryCache.set(key, value, ttlSeconds);
    }

    /**
     * Delete specific cache key
     */
    async del(key) {
        try {
            if (this.isRedisConnected && this.redisClient) {
                await this.redisClient.del(key);
            }
        } catch (err) {
            logger.warn(`Redis DEL failed for key '${key}'.`);
        }
        this.memoryCache.del(key);
    }

    /**
     * Clear all keys matching a pattern (e.g. 'news_*')
     */
    async clearPattern(pattern) {
        try {
            if (this.isRedisConnected && this.redisClient) {
                const keys = await this.redisClient.keys(pattern);
                if (keys.length > 0) {
                    await this.redisClient.del(keys);
                }
            }
        } catch (err) {
            logger.warn(`Redis clearPattern failed for pattern '${pattern}'.`);
        }

        // Clear pattern in memory cache
        const memoryKeys = this.memoryCache.keys();
        const regex = new RegExp('^' + pattern.replace('*', '.*'));
        memoryKeys.forEach((key) => {
            if (regex.test(key)) {
                this.memoryCache.del(key);
            }
        });
    }
}

module.exports = new CacheService();
