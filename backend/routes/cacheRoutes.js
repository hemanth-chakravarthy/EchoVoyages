import express from 'express';
import cache from '../utils/cacheManager.js';
import { clearCache, clearAllCache } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// Get cache statistics
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

// Clear all cache
router.post('/clear-all', (req, res) => {
    clearAllCache();
    res.json({ message: 'All cache cleared successfully' });
});

// Clear cache for a specific pattern
router.post('/clear', (req, res) => {
    const { pattern } = req.body;
    
    if (!pattern) {
        return res.status(400).json({ message: 'Pattern is required' });
    }
    
    clearCache(pattern);
    res.json({ message: `Cache cleared for pattern: ${pattern}` });
});

export default router;
