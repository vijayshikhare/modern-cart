const express = require('express')
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController')
const { protect } = require('../middleware/auth')

const router = express.Router()

// GET /api/wishlist - Get user's wishlist (protected)
router.get('/', protect, getWishlist)

// POST /api/wishlist - Add product (protected)
router.post('/', protect, addToWishlist)

// DELETE /api/wishlist/:productId - Remove product (protected)
router.delete('/:productId', protect, removeFromWishlist)

module.exports = router