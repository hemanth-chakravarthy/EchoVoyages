const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

// Get MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('ERROR: MONGO_URI is not defined in environment variables.');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB with URI:',
  mongoURI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@'));

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });
