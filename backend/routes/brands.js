const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true });
    res.json({ success: true, data: brands });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json({ success: true, data: brands });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json({ success: true, data: brand });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: brand });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Brand deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
