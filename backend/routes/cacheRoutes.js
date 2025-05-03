import express from 'express';
import cache from '../utils/cacheManager.js';
import { clearCache, clearAllCache } from '../middleware/cacheMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cache
 *   description: API endpoints for managing application cache
 */

/**
 * @swagger
 * /cache/stats:
 *   get:
 *     summary: Get cache statistics
 *     tags: [Cache]
 *     description: Retrieve statistics about the current cache state
 *     responses:
 *       200:
 *         description: Cache statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 keys:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of all cache keys
 *                 keyCount:
 *                   type: integer
 *                   description: Number of keys in the cache
 *                 hits:
 *                   type: integer
 *                   description: Number of cache hits
 *                 misses:
 *                   type: integer
 *                   description: Number of cache misses
 *                 ksize:
 *                   type: integer
 *                   description: Size of keys in bytes
 *                 vsize:
 *                   type: integer
 *                   description: Size of values in bytes
 */
router.get('/stats', (req, res) => {
    const stats = {
        keys: cache.keys(),
        keyCount: cache.keys().length,
        hits: cache.getStats().hits,
        misses: cache.getStats().misses,
        ksize: cache.getStats().ksize,
        vsize: cache.getStats().vsize
    };

    res.json(stats);
});

/**
 * @swagger
 * /cache/clear-all:
 *   post:
 *     summary: Clear all cache
 *     tags: [Cache]
 *     description: Clear all cached data in the application
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All cache cleared successfully
 */
router.post('/clear-all', (req, res) => {
    clearAllCache();
    res.json({ message: 'All cache cleared successfully' });
});

/**
 * @swagger
 * /cache/clear:
 *   post:
 *     summary: Clear cache by pattern
 *     tags: [Cache]
 *     description: Clear cached data matching a specific pattern
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pattern
 *             properties:
 *               pattern:
 *                 type: string
 *                 description: Pattern to match cache keys (e.g., "packages", "guides")
 *                 example: "packages"
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cache cleared for pattern: packages"
 *       400:
 *         description: Pattern is required
 */
router.post('/clear', (req, res) => {
    const { pattern } = req.body;

    if (!pattern) {
        return res.status(400).json({ message: 'Pattern is required' });
    }

    clearCache(pattern);
    res.json({ message: `Cache cleared for pattern: ${pattern}` });
});

export default router;
