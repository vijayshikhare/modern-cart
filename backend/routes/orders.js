const express = require('express')
const { protect } = require('../middleware/auth')
const { getOrders, getOrderById, createOrder } = require('../controllers/orderController')

const router = express.Router()

router.route('/')
	.get(protect, getOrders)
	.post(protect, createOrder)

router.get('/:id', protect, getOrderById)

module.exports = router