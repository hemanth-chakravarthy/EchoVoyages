import { packages } from '../packageModel.js';
import { setupDatabase, clearDatabase, closeDatabase } from '../../tests/setup.js';
import mongoose from 'mongoose';

// Setup and teardown
beforeAll(async () => await setupDatabase());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('Package Model', () => {
  it('should create a new package successfully', async () => {
    const packageData = {
      name: 'Test Package',
      description: 'A test package description',
      price: 1200,
      duration: 7,
      location: 'Switzerland',
      highlights: 'Beautiful views, exciting activities',
      maxGroupSize: 10,
      AgentID: new mongoose.Types.ObjectId(),
      image: ['image1.jpg', 'image2.jpg']
    };

    const packageInstance = new packages(packageData);
    const savedPackage = await packageInstance.save();

    // Verify the saved package
    expect(savedPackage._id).toBeDefined();
    expect(savedPackage.name).toBe(packageData.name);
    expect(savedPackage.description).toBe(packageData.description);
    expect(savedPackage.price).toBe(packageData.price);
    expect(savedPackage.duration).toBe(packageData.duration);
    expect(savedPackage.location).toBe(packageData.location);
    expect(savedPackage.highlights).toBe(packageData.highlights);
    expect(savedPackage.maxGroupSize).toBe(packageData.maxGroupSize);
    expect(savedPackage.isActive).toBe('pending'); // Default value
  });

  it('should fail to create a package without required fields', async () => {
    const invalidPackage = new packages({
      name: 'Test Package',
      // Missing required fields
    });

    // Expect validation error when saving
    await expect(invalidPackage.save()).rejects.toThrow();
  });

  it('should validate price is a positive number', async () => {
    const packageWithNegativePrice = new packages({
      name: 'Test Package',
      description: 'A test package description',
      price: -100, // Negative price
      duration: 7,
      location: 'Switzerland',
      highlights: 'Beautiful views, exciting activities',
      maxGroupSize: 10,
      AgentID: new mongoose.Types.ObjectId(),
      image: ['image1.jpg', 'image2.jpg']
    });

    // Expect validation error when saving
    await expect(packageWithNegativePrice.save()).rejects.toThrow();
  });

  it('should validate maxGroupSize is at least 1', async () => {
    const packageWithInvalidGroupSize = new packages({
      name: 'Test Package',
      description: 'A test package description',
      price: 1200,
      duration: 7,
      location: 'Switzerland',
      highlights: 'Beautiful views, exciting activities',
      maxGroupSize: 0, // Invalid group size
      AgentID: new mongoose.Types.ObjectId(),
      image: ['image1.jpg', 'image2.jpg']
    });

    // Expect validation error when saving
    await expect(packageWithInvalidGroupSize.save()).rejects.toThrow();
  });

  it('should update package properties correctly', async () => {
    // Create a package
    const packageInstance = new packages({
      name: 'Test Package',
      description: 'A test package description',
      price: 1200,
      duration: 7,
      location: 'Switzerland',
      highlights: 'Beautiful views, exciting activities',
      maxGroupSize: 10,
      AgentID: new mongoose.Types.ObjectId(),
      image: ['image1.jpg', 'image2.jpg']
    });
    
    await packageInstance.save();

    // Update the package
    packageInstance.price = 1500;
    packageInstance.duration = 10;
    packageInstance.isActive = 'confirmed';
    
    const updatedPackage = await packageInstance.save();

    // Verify the updates
    expect(updatedPackage.price).toBe(1500);
    expect(updatedPackage.duration).toBe(10);
    expect(updatedPackage.isActive).toBe('confirmed');
  });

  it('should handle guides array correctly', async () => {
    // Create a package
    const packageInstance = new packages({
      name: 'Test Package',
      description: 'A test package description',
      price: 1200,
      duration: 7,
      location: 'Switzerland',
      highlights: 'Beautiful views, exciting activities',
      maxGroupSize: 10,
      AgentID: new mongoose.Types.ObjectId(),
      image: ['image1.jpg', 'image2.jpg']
    });
    
    await packageInstance.save();

    // Add guides
    const guideId1 = new mongoose.Types.ObjectId();
    const guideId2 = new mongoose.Types.ObjectId();
    
    packageInstance.guides = [guideId1, guideId2];
    
    const updatedPackage = await packageInstance.save();

    // Verify the guides array
    expect(updatedPackage.guides).toHaveLength(2);
    expect(updatedPackage.guides[0].toString()).toBe(guideId1.toString());
    expect(updatedPackage.guides[1].toString()).toBe(guideId2.toString());
  });

  it('should handle reviews correctly', async () => {
    // Create a package
    const packageInstance = new packages({
      name: 'Test Package',
      description: 'A test package description',
      price: 1200,
      duration: 7,
      location: 'Switzerland',
      highlights: 'Beautiful views, exciting activities',
      maxGroupSize: 10,
      AgentID: new mongoose.Types.ObjectId(),
      image: ['image1.jpg', 'image2.jpg']
    });
    
    await packageInstance.save();

    // Add a review
    const customerId = new mongoose.Types.ObjectId();
    
    packageInstance.reviews.push({
      customer: customerId,
      rating: 4,
      comment: 'Great package!',
      date: new Date()
    });
    
    const updatedPackage = await packageInstance.save();

    // Verify the review
    expect(updatedPackage.reviews).toHaveLength(1);
    expect(updatedPackage.reviews[0].rating).toBe(4);
    expect(updatedPackage.reviews[0].comment).toBe('Great package!');
    expect(updatedPackage.reviews[0].customer.toString()).toBe(customerId.toString());
  });
});
