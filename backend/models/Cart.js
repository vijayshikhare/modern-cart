// models/Cart.js - Cart Model for User Shopping Cart
const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: { // Snapshot of price at add time (prevents price change issues)
    type: Number,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true }) // Allow _id for individual items

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One cart per user
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Index for fast user lookup
cartSchema.index({ user: 1 })

// Pre-save: Update totals
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0)
  this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  next()
})

module.exports = mongoose.model('Cart', cartSchema)