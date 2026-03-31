import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

// Get MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("ERROR: MONGO_URI is not defined in environment variables.");
  process.exit(1);
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
