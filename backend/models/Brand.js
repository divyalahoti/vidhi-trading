const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  logo: { type: String },
  origin: { type: String },
  description: { type: String },
  website: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

brandSchema.pre('save', function (next) {
  if (!this.slug) this.slug = this.name.toLowerCase().replace(/ /g, '-');
  next();
});

module.exports = mongoose.model('Brand', brandSchema);
