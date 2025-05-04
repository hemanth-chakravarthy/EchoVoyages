import request from 'supertest';
import express from 'express';
// import searchRoutes from '../searchRoutes.js';
import { Guide } from '../../models/guideModel.js';
import { packages } from '../../models/packageModel.js';
import { setupDatabase, clearDatabase, closeDatabase } from '../../tests/setup.js';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';

jest.unstable_mockModule('../../middleware/cacheMiddleware.js', () => ({
  cacheMiddleware: jest.fn().mockImplementation(() => (_, __, next) => next()),
}));

// Then dynamically import the route AFTER the mock
const { default: searchRoutes } = await import('../searchRoutes.js');




const app = express();
app.use(express.json());
app.use('/search', searchRoutes);


// Setup and teardown
beforeAll(async () => await setupDatabase());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('Search Routes', () => {
  describe('GET /search', () => {
    it('should return 400 if entityType is not provided', async () => {
      const response = await request(app).get('/search');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Entity type is required');
    });

    it('should search for guides with no filters', async () => {
      // Create test guides
      const guide1 = new Guide({
        username: 'guide1',
        name: 'Guide One',
        experience: 5,
        languages: ['English', 'Spanish'],
        location: 'New York',
        phno: '1234567890',
        gmail: 'guide1@example.com',
        password: 'password123',
        specialization: 'adventure',
        availability: true
      });

      const guide2 = new Guide({
        username: 'guide2',
        name: 'Guide Two',
        experience: 3,
        languages: ['English', 'French'],
        location: 'Paris',
        phno: '0987654321',
        gmail: 'guide2@example.com',
        password: 'password123',
        specialization: 'luxury',
        availability: false
      });

      await guide1.save();
      await guide2.save();

      // Test search with no filters
      const response = await request(app).get('/search?entityType=Guide');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Guide One');
      expect(response.body[1].name).toBe('Guide Two');
    });

    it('should search for guides with filters', async () => {
      // Create test guides
      const guide1 = new Guide({
        username: 'guide1',
        name: 'Guide One',
        experience: 5,
        languages: ['English', 'Spanish'],
        location: 'New York',
        phno: '1234567890',
        gmail: 'guide1@example.com',
        password: 'password123',
        specialization: 'adventure',
        availability: true
      });

      const guide2 = new Guide({
        username: 'guide2',
        name: 'Guide Two',
        experience: 3,
        languages: ['English', 'French'],
        location: 'Paris',
        phno: '0987654321',
        gmail: 'guide2@example.com',
        password: 'password123',
        specialization: 'luxury',
        availability: false
      });

      await guide1.save();
      await guide2.save();

      // Test search with location filter
      const response = await request(app).get('/search?entityType=Guide&location=New York');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Guide One');

      // Test search with availability filter
      const availabilityResponse = await request(app).get('/search?entityType=Guide&availability=true');

      expect(availabilityResponse.status).toBe(200);
      expect(availabilityResponse.body).toHaveLength(1);
      expect(availabilityResponse.body[0].name).toBe('Guide One');

      // Test search with language filter
      const languageResponse = await request(app).get('/search?entityType=Guide&language=French');

      expect(languageResponse.status).toBe(200);
      expect(languageResponse.body).toHaveLength(1);
      expect(languageResponse.body[0].name).toBe('Guide Two');
    });

    it('should search for packages with no filters', async () => {
      // Create test packages
      const package1 = new packages({
        name: 'Adventure Package',
        description: 'An exciting adventure package',
        price: 1200,
        duration: 7,
        location: 'Switzerland',
        highlights: 'Beautiful views, exciting activities',
        maxGroupSize: 10,
        AgentID: new mongoose.Types.ObjectId(),
        image: ['image1.jpg']
      });

      const package2 = new packages({
        name: 'Luxury Package',
        description: 'A luxurious relaxing package',
        price: 2500,
        duration: 10,
        location: 'Maldives',
        highlights: 'Relaxation, spa treatments',
        maxGroupSize: 4,
        AgentID: new mongoose.Types.ObjectId(),
        image: ['image2.jpg']
      });

      await package1.save();
      await package2.save();

      // Test search with no filters
      const response = await request(app).get('/search?entityType=Package');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Adventure Package');
      expect(response.body[1].name).toBe('Luxury Package');
    });

    it('should search for packages with filters', async () => {
      // Create test packages
      const package1 = new packages({
        name: 'Adventure Package',
        description: 'An exciting adventure package',
        price: 1200,
        duration: 7,
        location: 'Switzerland',
        highlights: 'Beautiful views, exciting activities',
        maxGroupSize: 10,
        AgentID: new mongoose.Types.ObjectId(),
        image: ['image1.jpg']
      });

      const package2 = new packages({
        name: 'Luxury Package',
        description: 'A luxurious relaxing package',
        price: 2500,
        duration: 10,
        location: 'Maldives',
        highlights: 'Relaxation, spa treatments',
        maxGroupSize: 4,
        AgentID: new mongoose.Types.ObjectId(),
        image: ['image2.jpg']
      });

      await package1.save();
      await package2.save();

      // Test search with location filter
      const response = await request(app).get('/search?entityType=Package&location=Switzerland');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Adventure Package');

      // Test search with price range filter
      const priceResponse = await request(app).get('/search?entityType=Package&minPrice=2000&maxPrice=3000');

      expect(priceResponse.status).toBe(200);
      expect(priceResponse.body).toHaveLength(1);
      expect(priceResponse.body[0].name).toBe('Luxury Package');

      // Test search with duration filter
      const durationResponse = await request(app).get('/search?entityType=Package&minDuration=9');

      expect(durationResponse.status).toBe(200);
      expect(durationResponse.body).toHaveLength(1);
      expect(durationResponse.body[0].name).toBe('Luxury Package');

      // Test search with group size filter
      const groupSizeResponse = await request(app).get('/search?entityType=Package&maxGroupSize=5');

      expect(groupSizeResponse.status).toBe(200);
      expect(groupSizeResponse.body).toHaveLength(1);
      expect(groupSizeResponse.body[0].name).toBe('Luxury Package');
    });

    it('should search with text search term', async () => {
      // Create test packages
      const package1 = new packages({
        name: 'Adventure Package',
        description: 'An exciting adventure package',
        price: 1200,
        duration: 7,
        location: 'Switzerland',
        highlights: 'Beautiful views, exciting activities',
        maxGroupSize: 10,
        AgentID: new mongoose.Types.ObjectId(),
        image: ['image1.jpg']
      });

      const package2 = new packages({
        name: 'Luxury Package',
        description: 'A luxurious relaxing package',
        price: 2500,
        duration: 10,
        location: 'Maldives',
        highlights: 'Relaxation, spa treatments',
        maxGroupSize: 4,
        AgentID: new mongoose.Types.ObjectId(),
        image: ['image2.jpg']
      });

      await package1.save();
      await package2.save();

      // Test search with text search term
      const response = await request(app).get('/search?entityType=Package&searchTerm=luxury');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Luxury Package');
    });
  });

  describe('GET /search/guide-languages', () => {
    it('should return all unique guide languages', async () => {
      // Create test guides with different languages
      const guide1 = new Guide({
        username: 'guide1',
        name: 'Guide One',
        experience: 5,
        languages: ['English', 'Spanish'],
        location: 'New York',
        phno: '1234567890',
        gmail: 'guide1@example.com',
        password: 'password123',
        specialization: 'adventure'
      });

      const guide2 = new Guide({
        username: 'guide2',
        name: 'Guide Two',
        experience: 3,
        languages: ['English', 'French', 'German'],
        location: 'Paris',
        phno: '0987654321',
        gmail: 'guide2@example.com',
        password: 'password123',
        specialization: 'luxury'
      });

      await guide1.save();
      await guide2.save();

      // Test getting unique languages
      const response = await request(app).get('/search/guide-languages');

      expect(response.status).toBe(200);
      expect(response.body).toContain('English');
      expect(response.body).toContain('Spanish');
      expect(response.body).toContain('French');
      expect(response.body).toContain('German');
      expect(response.body).toHaveLength(4); // No duplicates
    });
  });

  describe('GET /search/guide-locations', () => {
    it('should return all unique guide locations', async () => {
      // Create test guides with different locations
      const guide1 = new Guide({
        username: 'guide1',
        name: 'Guide One',
        experience: 5,
        languages: ['English'],
        location: 'New York',
        phno: '1234567890',
        gmail: 'guide1@example.com',
        password: 'password123',
        specialization: 'adventure'
      });

      const guide2 = new Guide({
        username: 'guide2',
        name: 'Guide Two',
        experience: 3,
        languages: ['English'],
        location: 'Paris',
        phno: '0987654321',
        gmail: 'guide2@example.com',
        password: 'password123',
        specialization: 'luxury'
      });

      await guide1.save();
      await guide2.save();

      // Test getting unique locations
      const response = await request(app).get('/search/guide-locations');

      expect(response.status).toBe(200);
      expect(response.body.locations).toContain('New York');
      expect(response.body.locations).toContain('Paris');
      expect(response.body.locations).toHaveLength(2);
    });
  });

  describe('GET /search/package-locations', () => {
    it('should return all unique package locations', async () => {
      // Create test packages with different locations
      const package1 = new packages({
        name: 'Adventure Package',
        description: 'An exciting adventure package',
        price: 1200,
        duration: 7,
        location: 'Switzerland',
        highlights: 'Beautiful views, exciting activities',
        maxGroupSize: 10,
        AgentID: new mongoose.Types.ObjectId(),
        image: ['image1.jpg']
      });

      const package2 = new packages({
        name: 'Luxury Package',
        description: 'A luxurious relaxing package',
        price: 2500,
        duration: 10,
        location: 'Maldives',
        highlights: 'Relaxation, spa treatments',
        maxGroupSize: 4,
        AgentID: new mongoose.Types.ObjectId(),
        image: ['image2.jpg']
      });

      await package1.save();
      await package2.save();

      // Test getting unique locations
      const response = await request(app).get('/search/package-locations');

      expect(response.status).toBe(200);
      expect(response.body).toContain('Switzerland');
      expect(response.body).toContain('Maldives');
      expect(response.body).toHaveLength(2);
    });
  });
});
