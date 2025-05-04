import { cacheMiddleware, clearCache, clearAllCache, clearCacheMiddleware } from '../cacheMiddleware.js';
import cache from '../../utils/cacheManager.js';
import { jest } from '@jest/globals';

// Mock the cache manager
const mockCache = {
  get: jest.fn(),
  set: jest.fn(),
  keys: jest.fn(),
  del: jest.fn(),
  flushAll: jest.fn()
};

// Replace the actual cache with our mock
cache.get = mockCache.get;
cache.set = mockCache.set;
cache.keys = mockCache.keys;
cache.del = mockCache.del;
cache.flushAll = mockCache.flushAll;

describe('Cache Middleware', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('cacheMiddleware', () => {
    it('should skip caching for non-GET requests', () => {
      // Arrange
      const req = { method: 'POST', originalUrl: '/api/test' };
      const res = {};
      const next = jest.fn();

      // Act
      const middleware = cacheMiddleware();
      middleware(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(cache.get).not.toHaveBeenCalled();
    });

    it('should return cached response if available', () => {
      // Arrange
      const req = { method: 'GET', originalUrl: '/api/test' };
      const res = { send: jest.fn() };
      const next = jest.fn();
      const cachedResponse = { data: 'cached data' };

      // Mock cache hit
      cache.get.mockReturnValue(cachedResponse);

      // Act
      const middleware = cacheMiddleware(300);
      middleware(req, res, next);

      // Assert
      expect(cache.get).toHaveBeenCalledWith('__express__/api/test');
      expect(res.send).toHaveBeenCalledWith(cachedResponse);
      expect(next).not.toHaveBeenCalled();
    });

    it('should cache response if not in cache', () => {
      // Arrange
      const req = { method: 'GET', originalUrl: '/api/test' };
      const res = {
        send: jest.fn(),
        statusCode: 200
      };
      const next = jest.fn();
      const responseBody = { data: 'response data' };

      // Mock cache miss
      cache.get.mockReturnValue(null);

      // Act
      const middleware = cacheMiddleware(300);
      middleware(req, res, next);

      // Call the modified send method
      res.send(responseBody);

      // Assert
      expect(cache.get).toHaveBeenCalledWith('__express__/api/test');
      expect(cache.set).toHaveBeenCalledWith('__express__/api/test', responseBody, 300);
      expect(next).toHaveBeenCalled();
    });

    it('should not cache error responses', () => {
      // Arrange
      const req = { method: 'GET', originalUrl: '/api/test' };
      const res = {
        send: jest.fn(),
        statusCode: 500 // Error status code
      };
      const next = jest.fn();
      const errorResponse = { error: 'Internal server error' };

      // Mock cache miss
      cache.get.mockReturnValue(null);

      // Act
      const middleware = cacheMiddleware(300);
      middleware(req, res, next);

      // Call the modified send method
      res.send(errorResponse);

      // Assert
      expect(cache.get).toHaveBeenCalledWith('__express__/api/test');
      expect(cache.set).not.toHaveBeenCalled(); // Should not cache error responses
      expect(next).toHaveBeenCalled();
    });
  });

  describe('clearCache', () => {
    it('should clear cache entries matching the pattern', () => {
      // Arrange
      const pattern = '/api/packages';
      const keys = ['__express__/api/packages', '__express__/api/packages/123', '__express__/api/guides'];

      cache.keys.mockReturnValue(keys);

      // Act
      clearCache(pattern);

      // Assert
      expect(cache.keys).toHaveBeenCalled();
      expect(cache.del).toHaveBeenCalledTimes(2); // Should delete the 2 matching keys
      expect(cache.del).toHaveBeenCalledWith('__express__/api/packages');
      expect(cache.del).toHaveBeenCalledWith('__express__/api/packages/123');
    });

    it('should not delete any keys if none match the pattern', () => {
      // Arrange
      const pattern = '/api/nonexistent';
      const keys = ['__express__/api/packages', '__express__/api/guides'];

      cache.keys.mockReturnValue(keys);

      // Act
      clearCache(pattern);

      // Assert
      expect(cache.keys).toHaveBeenCalled();
      expect(cache.del).not.toHaveBeenCalled(); // No keys should be deleted
    });
  });

  describe('clearAllCache', () => {
    it('should flush all cache', () => {
      // Act
      clearAllCache();

      // Assert
      expect(cache.flushAll).toHaveBeenCalled();
    });
  });

  describe('clearCacheMiddleware', () => {
    it('should clear cache when response is successful', () => {
      // Arrange
      const pattern = '/api/packages';
      const req = {};
      const res = {
        on: jest.fn(),
        statusCode: 200
      };
      const next = jest.fn();

      // Mock the on method to call the callback immediately
      res.on.mockImplementation((event, callback) => {
        if (event === 'finish') {
          callback();
        }
      });

      // Act
      const middleware = clearCacheMiddleware(pattern);
      middleware(req, res, next);

      // Assert
      expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
      expect(next).toHaveBeenCalled();

      // The clearCache function should be called when the response finishes
      expect(cache.keys).toHaveBeenCalled();
    });

    it('should not clear cache when response is not successful', () => {
      // Arrange
      const pattern = '/api/packages';
      const req = {};
      const res = {
        on: jest.fn(),
        statusCode: 500 // Error status code
      };
      const next = jest.fn();

      // Mock the on method to call the callback immediately
      res.on.mockImplementation((event, callback) => {
        if (event === 'finish') {
          callback();
        }
      });

      // Act
      const middleware = clearCacheMiddleware(pattern);
      middleware(req, res, next);

      // Assert
      expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
      expect(next).toHaveBeenCalled();

      // The clearCache function should not be called for error responses
      expect(cache.keys).not.toHaveBeenCalled();
    });
  });
});
