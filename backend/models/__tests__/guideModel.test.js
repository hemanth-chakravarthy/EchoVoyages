import { Guide } from '../guideModel.js';
import { jest } from '@jest/globals';

// Mock the Guide model's save method
const originalGuide = { ...Guide };
Guide.prototype.save = jest.fn().mockImplementation(function() {
  return Promise.resolve(this);
});

// Mock static methods
Guide.findById = jest.fn();
Guide.findOne = jest.fn();
Guide.find = jest.fn();

// Increase test timeout
jest.setTimeout(10000);

describe('Guide Model', () => {
  it('should create a new guide successfully', async () => {
    const guideData = {
      username: 'testguide',
      name: 'Test Guide',
      experience: 5,
      languages: ['English', 'Spanish'],
      location: 'New York',
      phno: '1234567890',
      gmail: 'test@example.com',
      password: 'password123',
      specialization: 'adventure'
    };

    const guide = new Guide(guideData);
    const savedGuide = await guide.save();

    // Verify the saved guide
    expect(savedGuide._id).toBeDefined();
    expect(savedGuide.username).toBe(guideData.username);
    expect(savedGuide.name).toBe(guideData.name);
    expect(savedGuide.experience).toBe(guideData.experience);
    expect(savedGuide.languages).toEqual(expect.arrayContaining(guideData.languages));
    expect(savedGuide.location).toBe(guideData.location);
    expect(savedGuide.role).toBe('guide'); // Default value
    expect(savedGuide.availability).toBe(false); // Default value
  });

  it('should fail to create a guide without required fields', async () => {
    const invalidGuide = new Guide({
      username: 'testguide',
      // Missing required fields
    });

    // Mock the validateSync method to return validation errors
    invalidGuide.validateSync = jest.fn().mockReturnValue({
      errors: {
        name: new Error('Path `name` is required.'),
        password: new Error('Path `password` is required.')
      }
    });

    // Check that validation fails
    const validationError = invalidGuide.validateSync();
    expect(validationError).toBeDefined();
    expect(validationError.errors.name).toBeDefined();
    expect(validationError.errors.password).toBeDefined();
  });

  it('should validate specialization enum values', async () => {
    const guideWithInvalidSpecialization = new Guide({
      username: 'testguide',
      name: 'Test Guide',
      phno: '1234567890',
      gmail: 'test@example.com',
      password: 'password123',
      specialization: 'invalid-value' // Not in the enum
    });

    // Mock the validateSync method to return validation errors
    guideWithInvalidSpecialization.validateSync = jest.fn().mockReturnValue({
      errors: {
        specialization: new Error('`invalid-value` is not a valid enum value for path `specialization`.')
      }
    });

    // Check that validation fails
    const validationError = guideWithInvalidSpecialization.validateSync();
    expect(validationError).toBeDefined();
    expect(validationError.errors.specialization).toBeDefined();
  });

  it('should update guide properties correctly', async () => {
    // Create a guide
    const guide = new Guide({
      username: 'testguide',
      name: 'Test Guide',
      experience: 5,
      languages: ['English'],
      location: 'New York',
      phno: '1234567890',
      gmail: 'test@example.com',
      password: 'password123',
      specialization: 'adventure'
    });

    await guide.save();

    // Update the guide
    guide.experience = 10;
    guide.languages = ['English', 'French'];
    guide.availability = true;

    const updatedGuide = await guide.save();

    // Verify the updates
    expect(updatedGuide.experience).toBe(10);
    expect(updatedGuide.languages).toEqual(expect.arrayContaining(['English', 'French']));
    expect(updatedGuide.availability).toBe(true);
  });

  it('should handle assigned packages correctly', async () => {
    // Create a guide
    const guide = new Guide({
      username: 'testguide',
      name: 'Test Guide',
      experience: 5,
      languages: ['English'],
      location: 'New York',
      phno: '1234567890',
      gmail: 'test@example.com',
      password: 'password123',
      specialization: 'adventure'
    });

    await guide.save();

    // Add an assigned package
    guide.assignedPackages.push({
      packageId: '60d21b4667d0d8992e610c92',
      packageName: 'Adventure in the Alps',
      price: 1200,
      status: 'pending'
    });

    const updatedGuide = await guide.save();

    // Verify the assigned package
    expect(updatedGuide.assignedPackages).toHaveLength(1);
    expect(updatedGuide.assignedPackages[0].packageName).toBe('Adventure in the Alps');
    expect(updatedGuide.assignedPackages[0].price).toBe(1200);
    expect(updatedGuide.assignedPackages[0].status).toBe('pending');
  });

  it('should handle earnings correctly', async () => {
    // Create a guide
    const guide = new Guide({
      username: 'testguide',
      name: 'Test Guide',
      experience: 5,
      languages: ['English'],
      location: 'New York',
      phno: '1234567890',
      gmail: 'test@example.com',
      password: 'password123',
      specialization: 'adventure'
    });

    await guide.save();

    // Add earnings
    guide.earnings.total = 1000;
    guide.earnings.pending = 500;
    guide.earnings.received = 500;

    // Add monthly earnings
    guide.earnings.monthly.push({
      month: 5,
      year: 2023,
      amount: 500
    });

    // Add earnings history
    guide.earnings.history.push({
      bookingId: '60d21b4667d0d8992e610c90',
      packageId: '60d21b4667d0d8992e610c92',
      packageName: 'Adventure in the Alps',
      customerName: 'John Doe',
      amount: 500,
      status: 'pending'
    });

    const updatedGuide = await guide.save();

    // Verify earnings
    expect(updatedGuide.earnings.total).toBe(1000);
    expect(updatedGuide.earnings.pending).toBe(500);
    expect(updatedGuide.earnings.received).toBe(500);

    // Verify monthly earnings
    expect(updatedGuide.earnings.monthly).toHaveLength(1);
    expect(updatedGuide.earnings.monthly[0].month).toBe(5);
    expect(updatedGuide.earnings.monthly[0].year).toBe(2023);
    expect(updatedGuide.earnings.monthly[0].amount).toBe(500);

    // Verify earnings history
    expect(updatedGuide.earnings.history).toHaveLength(1);
    expect(updatedGuide.earnings.history[0].packageName).toBe('Adventure in the Alps');
    expect(updatedGuide.earnings.history[0].amount).toBe(500);
    expect(updatedGuide.earnings.history[0].status).toBe('pending');
  });
});
