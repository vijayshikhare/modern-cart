const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      if (req.user) {
        next()
      } else {
        res.status(401).json({ msg: 'User not found' })
      }
    } catch (error) {
      console.error('Token verification error:', error)
      res.status(401).json({ msg: 'Not authorized, token failed' })
    }
  } else {
    res.status(401).json({ msg: 'Not authorized, no token' })
  }
}

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next()
  }
  return res.status(403).json({ msg: 'Admin access required' })
}

module.exports = { protect, admin }