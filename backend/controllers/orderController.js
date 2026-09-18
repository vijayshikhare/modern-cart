const asyncHandler = require('express-async-handler')
const Order = require('../models/Order')

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
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice = 0,
    shippingPrice = 0,
    totalPrice
  } = req.body

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    return res.status(400).json({ msg: 'No order items' })
  }

  if (!shippingAddress || !paymentMethod || totalPrice == null) {
    return res.status(400).json({ msg: 'Missing required order fields' })
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

  res.status(201).json(order)
})

module.exports = {
  getOrders,
  getOrderById,
  createOrder
}
