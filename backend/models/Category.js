const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String },
  image: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

categorySchema.pre('save', function (next) {
  if (!this.slug) this.slug = this.name.toLowerCase().replace(/ /g, '-');
  next();
});

module.exports = mongoose.model('Category', categorySchema);
