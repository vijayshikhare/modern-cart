const asyncHandler = require('express-async-handler')
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Product = require('../models/Product')

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('orderItems.product', 'name price image')

  res.json(orders)
})

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name price image')

  if (!order) {
    return res.status(404).json({ msg: 'Order not found' })
  }

  if (String(order.user._id || order.user) !== String(req.user._id) && !req.user.isAdmin) {
    return res.status(403).json({ msg: 'Not authorized to view this order' })
  }

  res.json(order)
})

const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body

  if (!shippingAddress || !paymentMethod) {
    return res.status(400).json({ msg: 'Missing required order fields' })
  }

  const requiredAddressFields = ['address', 'city', 'postalCode', 'country']
  if (requiredAddressFields.some((field) => !String(shippingAddress[field] || '').trim())) {
    return res.status(400).json({ msg: 'Complete shipping address is required' })
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name price image countInStock'
  )

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ msg: 'Your cart is empty' })
  }

  const unavailableItem = cart.items.find((item) => (
    !item.product || item.quantity > item.product.countInStock
  ))
  if (unavailableItem) {
    return res.status(400).json({ msg: 'One or more items are no longer available in the requested quantity' })
  }

  const orderItems = cart.items.map((item) => ({
    name: item.product.name,
    quantity: item.quantity,
    image: item.product.image,
    price: item.price,
    product: item.product._id
  }))
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingPrice = subtotal > 50 ? 0 : 4.99
  const taxPrice = Number((subtotal * 0.1).toFixed(2))
  const totalPrice = Number((subtotal + shippingPrice + taxPrice).toFixed(2))

  const stockUpdates = await Product.bulkWrite(cart.items.map((item) => ({
    updateOne: {
      filter: { _id: item.product._id, countInStock: { $gte: item.quantity } },
      update: { $inc: { countInStock: -item.quantity } }
    }
  })))

  if (stockUpdates.modifiedCount !== cart.items.length) {
    return res.status(409).json({ msg: 'Stock changed while checking out. Please review your cart and try again.' })
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice
  })

  cart.items = []
  await cart.save()

  res.status(201).json(order)
})

module.exports = {
  getOrders,
  getOrderById,
  createOrder
}
