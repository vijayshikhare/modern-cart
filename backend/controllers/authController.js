const User = require('../models/User')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })
  if (userExists) return res.status(400).json({ msg: 'User already exists' })

  const user = await User.create({ name, email, password })
  res.status(201).json({ token: generateToken(user._id), user: { id: user._id, name, email } })
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (user && (await user.matchPassword(password))) {
    res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, email } })
  } else {
    res.status(401).json({ msg: 'Invalid credentials' })
  }
})

// GET /profile - Fetch current user profile (requires authentication)
const getProfile = asyncHandler(async (req, res) => {
  // req.user is set by authenticateToken middleware (decoded from JWT)
  const user = await User.findById(req.user._id).select('-password') // Exclude password
  if (!user) {
    return res.status(404).json({ msg: 'User not found' })
  }
  res.json({
    user: {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    }
  })
})

module.exports = { register, login, getProfile }