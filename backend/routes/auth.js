// backend/routes/auth.js - Updated to use your 'protect' middleware
const express = require('express')
const { register, login, getProfile } = require('../controllers/authController')
const { validateRegister, validateLogin } = require('../middleware/validate')
const { protect } = require('../middleware/auth') // Adjust path if your middleware file is named differently (e.g., '../middleware/protect.js')

const router = express.Router()

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.get('/profile', protect, getProfile) // Protected: Uses your 'protect' middleware to verify token

module.exports = router