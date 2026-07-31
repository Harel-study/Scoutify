import mongoose from 'mongoose';
import logger from './logger.js';

export const connectDB = async (): Promise<void> => {
  try {
    logger.info(process.env.MONGODB_URI || 'undefined');
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scoutify';
    const conn = await mongoose.connect(mongoURI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
