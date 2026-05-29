const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  image: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

subCategorySchema.pre('save', function (next) {
  if (!this.slug) this.slug = this.name.toLowerCase().replace(/ /g, '-');
  next();
});

module.exports = mongoose.model('SubCategory', subCategorySchema);
