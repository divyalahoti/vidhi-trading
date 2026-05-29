const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments({ isActive: true });
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;
    const recentOrders = await Order.find()
      .populate('customer', 'name businessName')
      .sort('-createdAt').limit(10);
    res.json({ success: true, data: { totalOrders, totalCustomers, totalProducts, totalRevenue, recentOrders } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
