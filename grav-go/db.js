// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (err) {
    console.error('Error conexión MongoDB:', err.message);
    console.error('URI utilizada:', process.env.MONGO_URI ? 'URI presente' : 'URI no encontrada');
    process.exit(1);
  }
};

module.exports = connectDB;
