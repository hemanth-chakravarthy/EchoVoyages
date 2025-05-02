import cache from '../utils/cacheManager.js';

/**
 * Middleware to cache API responses
 * @param {number} duration - Cache duration in seconds (defaults to 300s/5min if not specified)
 * @returns {Function} Express middleware function
 */
export const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create a unique cache key based on the full URL
    const key = `__express__${req.originalUrl || req.url}`;

    // Check if we have a cache hit
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      // Return cached response
      console.log(`Cache hit for ${key}`);
      return res.send(cachedResponse);
    }

    // If no cache hit, capture the response
    const originalSend = res.send;

    res.send = function(body) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, body, duration);
        console.log(`Cached response for ${key} with TTL ${duration}s`);
      }

      // Call the original send function
      originalSend.call(this, body);
    };

    next();
  };
};

/**
 * Clear cache for a specific route or pattern
 * @param {string} pattern - Route pattern to clear (e.g., '/api/packages')
 */
export const clearCache = (pattern) => {
  const keys = cache.keys();
  const matchingKeys = keys.filter(key => key.includes(pattern));

  if (matchingKeys.length > 0) {
    matchingKeys.forEach(key => cache.del(key));
    console.log(`Cleared ${matchingKeys.length} cache entries matching pattern: ${pattern}`);
  }
};

/**
 * Clear all cache
 */
export const clearAllCache = () => {
  cache.flushAll();
  console.log('Cleared all cache');
};

/**
 * Middleware to clear cache for specific routes when data is modified
 * @param {string} pattern - Route pattern to clear (e.g., '/api/packages')
 * @returns {Function} Express middleware function
 */
export const clearCacheMiddleware = (pattern) => {
  return (_, res, next) => {
    // After the route handler is done, clear the cache
    res.on('finish', () => {
      // Only clear cache if the request was successful
      if (res.statusCode >= 200 && res.statusCode < 300) {
        clearCache(pattern);
      }
    });

    next();
  };
};
