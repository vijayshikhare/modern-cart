// backend/seeder.js - Database Seeder for Sample Products
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Product = require('./models/Product')

dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

// Sample products with real Unsplash images
const sampleProducts = [
  // Electronics
  {
    name: 'Dell XPS 13 Laptop',
    price: 999.99,
    image: 'https://source.unsplash.com/400x400/?laptop,dell,tech',
    description: 'Ultra-thin laptop with Intel Core i7, 16GB RAM, 512GB SSD. Perfect for work and entertainment.',
    category: 'Electronics',
    countInStock: 10,
    isNewArrival: true,
    discount: 10, // 10% off
    rating: 4.7,
    numReviews: 25
  },
  {
    name: 'iPhone 15 Pro',
    price: 999.00,
    image: 'https://source.unsplash.com/400x400/?iphone,smartphone,apple',
    description: 'Latest iPhone with A17 Pro chip, 48MP camera, and titanium frame. Revolutionary performance.',
    category: 'Electronics',
    countInStock: 5,
    isNewArrival: false,
    discount: 0,
    rating: 4.8,
    numReviews: 150
  },
  // Fashion
  {
    name: 'Cotton T-Shirt',
    price: 29.99,
    image: 'https://source.unsplash.com/400x400/?tshirt,cotton,fashion',
    description: 'Comfortable 100% cotton t-shirt in multiple colors. Breathable and machine-washable.',
    category: 'Fashion',
    countInStock: 50,
    isNewArrival: true,
    discount: 15,
    rating: 4.5,
    numReviews: 80
  },
  {
    name: 'Slim Fit Jeans',
    price: 59.99,
    image: 'https://source.unsplash.com/400x400/?jeans,denim,fashion',
    description: 'Classic slim-fit jeans with stretch fabric for all-day comfort. Available in 5 sizes.',
    category: 'Fashion',
    countInStock: 30,
    isNewArrival: false,
    discount: 5,
    rating: 4.6,
    numReviews: 120
  },
  // Home & Garden
  {
    name: 'Modern Floor Lamp',
    price: 89.99,
    image: 'https://source.unsplash.com/400x400/?lamp,home,interior',
    description: 'Stylish LED floor lamp with adjustable height and dimmer. Energy-efficient design.',
    category: 'Home & Garden',
    countInStock: 15,
    isNewArrival: true,
    discount: 0,
    rating: 4.4,
    numReviews: 35
  },
  {
    name: 'Ceramic Vase Set',
    price: 39.99,
    image: 'https://source.unsplash.com/400x400/?vase,ceramic,home',
    description: 'Set of 3 handcrafted ceramic vases for modern decor. Perfect for flowers or as accents.',
    category: 'Home & Garden',
    countInStock: 20,
    isNewArrival: false,
    discount: 20,
    rating: 4.3,
    numReviews: 60
  }
]

// Seed function
const seedDB = async () => {
  try {
    console.log('Seeding database...')

    // Delete existing products
    await Product.deleteMany()
    console.log('Cleared existing products')

    // Insert sample products
    await Product.insertMany(sampleProducts)
    console.log(`Inserted ${sampleProducts.length} sample products`)

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Seeding error:', error)
    process.exit(1)
  } finally {
    // Close connection
    await mongoose.connection.close()
    console.log('MongoDB connection closed')
    process.exit(0)
  }
}

// Run seeder
seedDB()