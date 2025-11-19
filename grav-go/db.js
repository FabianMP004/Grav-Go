// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_ATLAS);
    console.log('MongoDB conectado');
  } catch (err) {
    console.error('Error conexión MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
