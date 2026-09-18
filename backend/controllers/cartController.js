const Cart = require('../models/Cart')
const Product = require('../models/Product')
const asyncHandler = require('express-async-handler')

const serializeCart = (cart) => {
  if (!cart) {
    return { items: [], totalItems: 0, totalPrice: 0 }
  }

  const items = (cart.items || []).map((item) => {
    const plain = item.toObject ? item.toObject() : item
    return {
      ...plain,
      subtotal: plain.price * plain.quantity
    }
  })

  return {
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.subtotal, 0)
  }
}

// GET /api/cart - Get user's cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price image description category countInStock')
  res.json(serializeCart(cart))
})

// POST /api/cart - Add item to cart (body: { productId, quantity = 1 })
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body

  // Validate product and stock
  const product = await Product.findById(productId)
  if (!product) {
    return res.status(404).json({ msg: 'Product not found' })
  }
  if (product.countInStock < quantity) {
    return res.status(400).json({ msg: `Only ${product.countInStock} items in stock` })
  }

  let cart = await Cart.findOne({ user: req.user._id })

  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: [{ product: productId, quantity, price: product.price }]
    })
  } else {
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId)
    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + quantity
      if (newQuantity > product.countInStock) {
        return res.status(400).json({ msg: `Only ${product.countInStock} items in stock` })
      }
      cart.items[itemIndex].quantity = newQuantity
    } else {
      cart.items.push({ product: productId, quantity, price: product.price })
    }
  }

  await cart.save()
  await cart.populate('items.product', 'name price image description category countInStock')

  // Recalculate totals
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  await cart.save()

  res.json(serializeCart(cart))
})

// PUT /api/cart/:itemId - Update item quantity (body: { quantity })
const updateCart = asyncHandler(async (req, res) => {
  const { quantity } = req.body
  if (quantity < 1) {
    return res.status(400).json({ msg: 'Quantity must be at least 1' })
  }

  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) {
    return res.status(404).json({ msg: 'Cart not found' })
  }

  const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.itemId)
  if (itemIndex === -1) {
    return res.status(404).json({ msg: 'Item not found in cart' })
  }

  // Check stock
  const product = await Product.findById(cart.items[itemIndex].product)
  if (product.countInStock < quantity) {
    return res.status(400).json({ msg: `Only ${product.countInStock} items in stock` })
  }

  cart.items[itemIndex].quantity = quantity
  await cart.save()
  await cart.populate('items.product', 'name price image description category countInStock')

  // Recalculate totals
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  await cart.save()

  res.json(serializeCart(cart))
})

// DELETE /api/cart/:itemId - Remove item from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) {
    return res.status(404).json({ msg: 'Cart not found' })
  }

  const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.itemId)
  if (itemIndex === -1) {
    return res.status(404).json({ msg: 'Item not found in cart' })
  }

  cart.items.splice(itemIndex, 1)
  await cart.save()
  await cart.populate('items.product', 'name price image description category countInStock')

  // Recalculate totals
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  await cart.save()

  res.json(serializeCart(cart))
})

// Clear entire cart (utility)
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) {
    return res.json({ items: [], totalItems: 0, totalPrice: 0 })
  }

  cart.items = []
  await cart.save()
  res.json(serializeCart(cart))
})

module.exports = { 
  getCart, 
  addToCart, 
  updateCart, 
  removeFromCart, 
  clearCart 
}