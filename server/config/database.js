import mongoose from 'mongoose';

export async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is not set. Database features are unavailable.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');
  } catch (error) {
    console.error('Could not connect to MongoDB:', error.message);
  }
}

export function requireDatabase(request, response, next) {
  if (mongoose.connection.readyState !== 1) {
    return response.status(503).json({
      message: 'The database is not connected. Check the server configuration and try again.',
    });
  }

  next();
}