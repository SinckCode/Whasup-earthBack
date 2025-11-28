// src/config/db.js
const mongoose = require('mongoose');

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://192.168.100.109:27017/whatsup_earth';

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB conectado');
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
