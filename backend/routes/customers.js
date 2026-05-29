const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password');
    res.json({ success: true, data: customers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Customer not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
