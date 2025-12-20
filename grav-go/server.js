// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

// CORS usando el paquete oficial
const allowedOrigins = ['https://grav-go.vercel.app'];
app.use(cors({
  origin: function(origin, callback){
    if(!origin || allowedOrigins.includes(origin)){
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Connect to MongoDB
connectDB();

// Example route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Debug route (remove in production)
app.get('/debug', (req, res) => {
  res.json({
    message: 'Debug info',
    mongoUri: process.env.MONGO_URI ? 'Present' : 'Missing',
    jwtSecret: process.env.JWT_SECRET ? 'Present' : 'Missing',
    nodeEnv: process.env.NODE_ENV || 'Not set'
  });
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Error handling middleware - must be after routes
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Server error',
    error: process.env.NODE_ENV !== 'production' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
