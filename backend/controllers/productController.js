const Product = require('../models/Product')
const asyncHandler = require('express-async-handler')

const normalizeCategory = (value = '') => {
  const v = value.trim().toLowerCase()
  const map = {
    electronics: 'Electronics',
    fashion: 'Fashion',
    home: 'Home & Garden',
    'home & garden': 'Home & Garden',
    books: 'Books',
    sports: 'Sports'
  }
  return map[v] || value
}

// Enhanced getProducts with filtering, searching, sorting, pagination
const getProducts = asyncHandler(async (req, res) => {
  const {
    search = '',
    category = '',
    sort = 'relevance', // relevance, price-low, price-high, name
    page = 1,
    limit = 12 // Default items per page
  } = req.query

  // Build query
  const query = {}
  if (search) {
    query.name = { $regex: search, $options: 'i' } // Case-insensitive search
  }
  if (category && category !== 'All') {
    const categories = String(category)
      .split(',')
      .map((value) => normalizeCategory(value))
      .filter(Boolean)

    if (categories.length === 1) {
      query.category = categories[0]
    } else if (categories.length > 1) {
      query.category = { $in: categories }
    }
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit)
  const total = await Product.countDocuments(query)
  const totalPages = Math.ceil(total / parseInt(limit))

  // Sorting
  const sortOptions = {
    'relevance': { createdAt: -1 }, // Default: newest first
    'price-low': { price: 1 },
    'price-high': { price: -1 },
    'name': { name: 1 }
  }
  const sortBy = sortOptions[sort] || sortOptions.relevance

  const products = await Product.find(query)
    .sort(sortBy)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v') // Exclude version field

  res.json({
    products,
    totalPages,
    currentPage: parseInt(page),
    total
  })
})

// Get single product by ID (unchanged, but added populate if needed for reviews/images)
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('reviews.user', 'name') // If you have reviews, populate user name
    .select('-__v')

  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ msg: 'Product not found' })
  }
})

// Create product (admin only - unchanged)
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    ...req.body,
    // Auto-generate real image URL if not provided (integrate with Unsplash or CDN)
    image: req.body.image || `https://source.unsplash.com/400x400/?${req.body.name?.toLowerCase() || 'product'}`,
    user: req.user?._id // If authenticated admin
  })
  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// Update product (admin only - unchanged, but support image update)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      image: req.body.image || `https://source.unsplash.com/400x400/?${req.body.name?.toLowerCase() || 'product'}` // Dynamic image
    },
    { new: true, runValidators: true }
  ).select('-__v')

  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ msg: 'Product not found' })
  }
})

// Delete product (admin only - unchanged)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (product) {
    res.json({ msg: 'Product removed' })
  } else {
    res.status(404).json({ msg: 'Product not found' })
  }
})

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct }