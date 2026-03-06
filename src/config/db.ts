/**
 * Database Configuration
 *
 * Handles the connection to MongoDB using Mongoose.
 */

import mongoose from 'mongoose';

/**
 * connectDB
 *
 * Logic:
 * 1. Attempts to connect to MongoDB using the URI from environment variables.
 * 2. Logs success or exits the process on fatal connection failure.
 */
const connectDB = async (): Promise<void> => {
  try {
    // connect() is the entry point for all Mongoose database interactions.
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1); // Kill the server if DB can't be reached
  }
};

export default connectDB;
