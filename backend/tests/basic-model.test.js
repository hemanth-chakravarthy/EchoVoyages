import { jest } from '@jest/globals';
import mongoose from 'mongoose';

// Create a simple schema for testing
const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, min: 0 },
  email: String
});

// Create a model from the schema
const TestModel = mongoose.model('Test', testSchema);

describe('Basic Mongoose Model', () => {
  it('should validate required fields', () => {
    // Create a model instance without required fields
    const testInstance = new TestModel({
      age: 25,
      email: 'test@example.com'
    });

    // Validate the model
    const validationError = testInstance.validateSync();
    
    // Check that validation failed
    expect(validationError).toBeDefined();
    expect(validationError.errors.name).toBeDefined();
  });

  it('should validate field constraints', () => {
    // Create a model instance with invalid age
    const testInstance = new TestModel({
      name: 'Test User',
      age: -5,
      email: 'test@example.com'
    });

    // Validate the model
    const validationError = testInstance.validateSync();
    
    // Check that validation failed
    expect(validationError).toBeDefined();
    expect(validationError.errors.age).toBeDefined();
  });

  it('should accept valid data', () => {
    // Create a model instance with valid data
    const testInstance = new TestModel({
      name: 'Test User',
      age: 25,
      email: 'test@example.com'
    });

    // Validate the model
    const validationError = testInstance.validateSync();
    
    // Check that validation passed
    expect(validationError).toBeUndefined();
  });
});
