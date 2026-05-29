const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  gstPercent: { type: Number, default: 18 },
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    street: String, city: String, state: String, pincode: String,
  },
  subtotal: { type: Number, required: true },
  gstAmount: { type: Number, default: 0 },
  shippingCharge: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['UPI', 'NEFT', 'Card', 'COD'], default: 'UPI' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  paymentId: { type: String },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Confirmed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'],
    default: 'Placed',
  },
  notes: { type: String },
}, { timestamps: true });

orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = 'ORD-' + String(count + 1).padStart(6, '0');
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
