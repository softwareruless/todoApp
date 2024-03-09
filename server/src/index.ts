import { app } from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  // Check all parameters not required
  // if (!process.env.JWT_KEY) {
  //   throw new Error('JWT_KEY must be defined');
  // }

  // if (!process.env.SECRET_KEY) {
  //   throw new Error('SECRET_KEY must be defined');
  // }

  // if (!process.env.CLOUD_NAME) {
  //   throw new Error('CLOUD_NAME must be defined');
  // }

  // if (!process.env.API_KEY) {
  //   throw new Error('API_KEY must be defined');
  // }

  // if (!process.env.API_SECRET) {
  //   throw new Error('API_SECRET must be defined');
  // }

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!');
  });
};

start();
