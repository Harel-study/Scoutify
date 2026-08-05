/**
 * @module db
 *
 * Database connection setup module for MongoDB via Mongoose.
 * Manages database connection lifecycle, custom DNS resolution overrides for network resilience,
 * and handles connection startup errors.
 */

import mongoose from 'mongoose';
import dns from 'dns';
import logger from './logger.js';

// Apply custom DNS servers if configured in environment (resolves local ISP DNS lookup issues for MongoDB Atlas)
if (process.env.DNS_SERVERS) {
  const servers = process.env.DNS_SERVERS.split(',').map((s) => s.trim());
  dns.setServers(servers);
}

/**
 * Establishes a persistent connection to the MongoDB cluster using Mongoose.
 *
 * Logs connection progress and host details upon success. Exits process with code 1
 * if unable to connect during startup to prevent the backend from running un-backed.
 *
 * @returns {Promise<void>} Resolves when database connection is successfully established.
 * @throws  {Error} Terminates application process on connection failure.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scoutify';
    const conn = await mongoose.connect(mongoURI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
