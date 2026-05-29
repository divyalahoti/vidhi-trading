const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  businessName: { type: String },
  gstNumber: { type: String },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model('User', userSchema);
