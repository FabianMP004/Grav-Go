// db.js
const mongoose = require('mongoose');

// Prefer IPv4 loopback to avoid issues when MongoDB is not listening on IPv6 (::1)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grav-go';

const connectDB = async () => {
  try {
    // mongoose v6+ no necesita las opciones useNewUrlParser/useUnifiedTopology
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
