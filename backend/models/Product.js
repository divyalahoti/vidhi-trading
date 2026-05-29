const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
  images: [{ type: String }],
  price: { type: Number, required: true },
  mrp: { type: Number },
  gstPercent: { type: Number, default: 18 },
  unit: { type: String, default: 'pcs' },
  weight: { type: String },
  minimumOrderQty: { type: Number, default: 1 },
  stock: { type: Number, default: 0 },
  sku: { type: String, unique: true },
  tags: [String],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (!this.slug) this.slug = this.name.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
