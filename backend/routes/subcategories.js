const express = require('express');
const router = express.Router();
const SubCategory = require('../models/SubCategory');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    const subs = await SubCategory.find(filter).populate('category', 'name');
    res.json({ success: true, data: subs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const subs = await SubCategory.find().populate('category', 'name');
    res.json({ success: true, data: subs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const sub = await SubCategory.create(req.body);
    res.status(201).json({ success: true, data: sub });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const sub = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: sub });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'SubCategory deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
