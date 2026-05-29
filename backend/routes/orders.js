const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// Customer: place order
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;
    if (!items || !items.length) return res.status(400).json({ success: false, message: 'No items in order' });

    let subtotal = 0;
    let gstAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      if (item.quantity < product.minimumOrderQty)
        return res.status(400).json({ success: false, message: `Min order qty for ${product.name} is ${product.minimumOrderQty}` });

      const itemTotal = product.price * item.quantity;
      const itemGst = (itemTotal * product.gstPercent) / 100;
      subtotal += itemTotal;
      gstAmount += itemGst;
      orderItems.push({ product: product._id, name: product.name, quantity: item.quantity, price: product.price, gstPercent: product.gstPercent });
    }

    const totalAmount = subtotal + gstAmount;
    const order = await Order.create({
      customer: req.user._id, items: orderItems, shippingAddress,
      subtotal, gstAmount, totalAmount, paymentMethod, notes,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Customer: my orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.product', 'name images')
      .sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Customer: single order
router.get('/my/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, customer: req.user._id })
      .populate('items.product', 'name images brand');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Admin: all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.orderStatus = req.query.status;
    const orders = await Order.find(filter)
      .populate('customer', 'name businessName email phone')
      .sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Admin: update order status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.orderStatus, paymentStatus: req.body.paymentStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
