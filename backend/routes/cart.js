const express = require('express')
const { getCart, addToCart, updateCart, removeFromCart, clearCart } = require('../controllers/cartController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.route('/').get(protect, getCart).post(protect, addToCart)
router.delete('/clear', protect, clearCart)
router.route('/:itemId').put(protect, updateCart).delete(protect, removeFromCart)

module.exports = router