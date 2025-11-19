const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

// POST /api/auth/topup
router.post(
  '/topup',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('amount', 'Amount must be a positive number').isFloat({ gt: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, amount } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.balance = +( (user.balance || 0) + Number(amount) ).toFixed(2);
      await user.save();

      // Return updated user info
      return res.json({ user: { id: user.id, name: user.name, email: user.email, balance: user.balance } });
    } catch (err) {
      console.error(err);
      const payload = { message: 'Server error' };
      if (process.env.NODE_ENV !== 'production') payload.error = err.message || err;
      res.status(500).json(payload);
    }
  }
);

module.exports = router;
