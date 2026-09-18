// models/Order.js - Order Model for Checkout and History
const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
})

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentResult: { // For Stripe/PayPal
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String }
  },
  taxPrice: { type: Number, required: true, default: 0 },
  shippingPrice: { type: Number, required: true, default: 0 },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  isCancelled: { type: Boolean, default: false },
  cancelledAt: { type: Date },
  status: { // Overall status
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, {
  timestamps: true
})

// Index for user orders
orderSchema.index({ user: 1, createdAt: -1 }) // Recent orders first

module.exports = mongoose.model('Order', orderSchema)