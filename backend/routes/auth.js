const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, businessName, gstNumber, phone, address } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password, businessName, gstNumber, phone, address });
    const token = user.getSignedJwtToken();
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = user.getSignedJwtToken();
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, businessName: user.businessName } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
