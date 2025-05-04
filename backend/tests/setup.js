import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Setup MongoDB Memory Server for testing
let mongoServer;

// Connect to the in-memory database before tests
export const setupDatabase = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await mongoose.connect(uri);
  console.log('Connected to in-memory MongoDB server');
};

// Clear all collections between tests
export const clearDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
};

// Disconnect and close MongoDB Memory Server
export const closeDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
  
  if (mongoServer) {
    await mongoServer.stop();
  }
  
  console.log('Disconnected from in-memory MongoDB server');
};
