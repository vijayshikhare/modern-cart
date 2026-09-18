const express = require('express')
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController')
const { protect, admin } = require('../middleware/auth')

const router = express.Router()

// Product Routes (Public browsing, Protected admin)
router.route('/')
  .get(getProducts) // Public: Search, filter, sort, paginate
  .post(protect, admin, createProduct) // Admin: Create

router.route('/:id')
  .get(getProductById) // Public: Get single
  .put(protect, admin, updateProduct) // Admin: Update
  .delete(protect, admin, deleteProduct) // Admin: Delete

module.exports = router