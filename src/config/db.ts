// src/config/db.ts
import mongoose from 'mongoose';

const MONGO_URI: string =
  process.env.MONGO_URI || 'mongodb://192.168.100.109:27017/whatsup_earth';

async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB conectado');
  } catch (err: any) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  }
}

export default connectDB;
