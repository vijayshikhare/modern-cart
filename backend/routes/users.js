const express = require('express')
const { protect } = require('../middleware/auth')
const User = require('../models/User')

const router = express.Router()

router.get('/profile', protect, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin
    }
  })
})

router.put('/profile', protect, async (req, res) => {
  const { name, email, password } = req.body
  const user = await User.findById(req.user._id)

  if (!user) {
    return res.status(404).json({ msg: 'User not found' })
  }

  if (name) user.name = name.trim()
  if (email) user.email = email.trim().toLowerCase()
  if (password) user.password = password

  const updatedUser = await user.save()

  res.json({
    msg: 'Profile updated',
    user: {
      id: updatedUser._id,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    }
  })
})

module.exports = router