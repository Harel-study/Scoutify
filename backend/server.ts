import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import teamRoutes from './routes/TeamsRoutes';
dotenv.config();
const app = express();
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error: unknown) => {
    console.error('Error connecting to MongoDB:', error);
  });
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});