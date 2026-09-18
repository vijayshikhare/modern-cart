// models/Product.js - Enhanced Product Schema for Full E-Commerce
const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true })

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: { 
    type: String, 
    required: [true, 'Product image is required']
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: ['Electronics', 'Fashion', 'Home & Garden', 'Books', 'Sports'] // Expand as needed
  },
  countInStock: { 
    type: Number, 
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  isNewArrival: { 
    type: Boolean, 
    default: false 
  },
  discount: { 
    type: Number, 
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0 
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema], // Embedded reviews for fast loading
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true, // Auto-updates createdAt/updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Index for fast queries
productSchema.index({ name: 'text', description: 'text' }) // Text search
productSchema.index({ category: 1, price: 1 }) // Filter/sort
productSchema.index({ createdAt: -1 }) // New arrivals

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  return this.price * (1 - this.discount / 100)
})

// Pre-save middleware for updatedAt
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Product', productSchema)