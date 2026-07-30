import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    console.log(process.env.MONGODB_URI);
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scoutify';
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
