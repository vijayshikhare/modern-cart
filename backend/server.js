const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
const dotenv = require('dotenv')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')

dotenv.config()

connectDB()

const app = express()

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

// Middleware
app.use(helmet()) // Security headers
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(morgan('combined')) // Logging

// Rate limiting (relaxed for dev)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Strict in prod, loose in dev
  skip: (req) => {
    // Skip for localhost (dev testing)
    return req.ip === '::1' || req.ip === '127.0.0.1' || req.connection.remoteAddress === '::1'
  },
  message: { msg: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
})
app.use(limiter)

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/cart', require('./routes/cart'))
app.use('/api/wishlist', require('./routes/wishlist'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/users', require('./routes/users'))

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'ProShop Backend Running!', 
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'Route not found' })
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack)
  res.status(err.statusCode || 500).json({ 
    msg: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Database: Connected`)
})