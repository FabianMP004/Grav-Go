const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.body.token || req.query.token;
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const secret = process.env.JWT_SECRET || 'change_this_secret';
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// POST /api/auth/register
router.post(
  '/register',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

  user = new User({ name, email, password: hashed, balance: 0 });
      await user.save();

      const payload = { user: { id: user.id } };
      const secret = process.env.JWT_SECRET || 'change_this_secret';
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });

  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, balance: user.balance } });
    } catch (err) {
      // Log full error for debugging
      console.error(err);
      // Return more info in development to aid debugging (avoid leaking in production)
      const payload = { message: 'Server error' };
      if (process.env.NODE_ENV !== 'production') payload.error = err.message || err;
      res.status(500).json(payload);
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Ensure balance is initialized
      if (user.balance === undefined || user.balance === null) {
        user.balance = 0;
        await user.save();
      }

      const payload = { user: { id: user.id } };
      const secret = process.env.JWT_SECRET || 'change_this_secret';
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });

  res.json({ token, user: { id: user.id, name: user.name, email: user.email, balance: user.balance } });
    } catch (err) {
      console.error(err);
      const payload = { message: 'Server error' };
      if (process.env.NODE_ENV !== 'production') payload.error = err.message || err;
      res.status(500).json(payload);
    }
  }
);

// GET /api/auth/me - Get current user from token
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Ensure balance exists and is a number
    if (user.balance === undefined || user.balance === null) {
      user.balance = 0;
      await user.save();
    }
    res.json({ user: { id: user.id, name: user.name, email: user.email, balance: user.balance } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/topup
router.post(
  '/topup',
  [
    check('amount', 'Amount must be a valid number').isFloat(),
  ],
  async (req, res) => {
    console.log('TopUp endpoint called');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, amount } = req.body;
    let user = null;
    
    try {
      // Try to get user from token first (if authenticated)
      const authHeader = req.headers.authorization || req.headers.Authorization;
      const token = authHeader ? authHeader.replace('Bearer ', '') : req.body.token;
      
      console.log('Token extracted:', token ? token.substring(0, 20) + '...' : 'No token');
      
      if (token) {
        try {
          const secret = process.env.JWT_SECRET || 'change_this_secret';
          const decoded = jwt.verify(token, secret);
          console.log('Token decoded successfully, user id:', decoded.user.id);
          user = await User.findById(decoded.user.id);
          if (user) {
            console.log('User found from token:', user.email);
          }
        } catch (err) {
          console.log('Token verification failed:', err.message);
          // Token invalid, fall back to email lookup
        }
      }
      
      // If no user from token, try email
      if (!user) {
        if (!email) {
          return res.status(400).json({ message: 'Email or valid token required' });
        }
        console.log('Looking up user by email:', email);
        user = await User.findOne({ email });
        if (user) {
          console.log('User found by email:', user.email);
        }
      }
      
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }

      // Ensure balance is initialized
      if (user.balance === undefined || user.balance === null) {
        user.balance = 0;
      }

      const amountNum = Number(amount);
      const oldBalance = user.balance || 0;
      const newBalance = oldBalance + amountNum;
      
      console.log(`TopUp: User ${user.email}, Old balance: ${oldBalance}, Amount: ${amountNum}, New balance: ${newBalance}`);
      
      // For payments (negative amounts), ensure balance doesn't go below 0
      if (amountNum < 0 && newBalance < 0) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      user.balance = +newBalance.toFixed(2);
      await user.save();
      
      console.log(`TopUp: Balance saved to MongoDB. User balance: ${user.balance}`);

      // Return updated user info
      const updatedUser = { id: user.id, name: user.name, email: user.email, balance: user.balance };
      console.log('TopUp: Returning user data:', updatedUser);
      return res.json({ user: updatedUser });
    } catch (err) {
      console.error(err);
      const payload = { message: 'Server error' };
      if (process.env.NODE_ENV !== 'production') payload.error = err.message || err;
      res.status(500).json(payload);
    }
  }
);

module.exports = router;
