const Wishlist = require('../models/Wishlist') // Assume Wishlist model from previous
const Product = require('../models/Product')
const asyncHandler = require('express-async-handler')

const serializeWishlist = (wishlist) => {
  if (!wishlist) {
    return { items: [] }
  }
  const items = (wishlist.items || []).map((item) => (item.toObject ? item.toObject() : item))
  return { items }
}

// GET /api/wishlist - Get user's wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.product', 'name price image description category')
  res.json(serializeWishlist(wishlist))
})

// POST /api/wishlist - Add product to wishlist (body: { productId })
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body

  // Validate product exists
  const product = await Product.findById(productId)
  if (!product) {
    return res.status(404).json({ msg: 'Product not found' })
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id })

  if (!wishlist) {
    wishlist = new Wishlist({
      user: req.user._id,
      items: [{ product: productId }]
    })
  } else {
    // Check if already in wishlist (prevent duplicates)
    const itemIndex = wishlist.items.findIndex(item => item.product.toString() === productId)
    if (itemIndex > -1) {
      return res.status(400).json({ msg: 'Product already in wishlist' })
    }
    wishlist.items.push({ product: productId })
  }

  await wishlist.save()
  await wishlist.populate('items.product', 'name price image description category')

  res.json(serializeWishlist(wishlist))
})

// DELETE /api/wishlist/:productId - Remove product from wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id })
  if (!wishlist) {
    return res.status(404).json({ msg: 'Wishlist not found' })
  }

  const itemIndex = wishlist.items.findIndex(item => item.product.toString() === req.params.productId)
  if (itemIndex === -1) {
    return res.status(404).json({ msg: 'Product not found in wishlist' })
  }

  wishlist.items.splice(itemIndex, 1)
  await wishlist.save()
  await wishlist.populate('items.product', 'name price image description category')

  res.json(serializeWishlist(wishlist))
})

module.exports = { getWishlist, addToWishlist, removeFromWishlist }