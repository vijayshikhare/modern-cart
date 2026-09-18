// src/pages/Sitemap.jsx - Sitemap Page
import { Link } from 'react-router-dom'
import { Map, Home, ShoppingCart, Heart, User, FileText } from 'lucide-react'
import PageHero from '../components/layout/PageHero'

const Sitemap = () => {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Sitemap"
        subtitle="Navigate every important section of ProShop quickly."
        tone="blue"
        badge="Last updated: January 20, 2026"
        backgroundImage="https://picsum.photos/seed/sitemap-hero/1400/500"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Sitemap' }
        ]}
      />

      <div className="section-wrap py-8">

        <div className="surface-card p-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Home & Shop */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Home className="h-5 w-5 mr-2 text-primary-600" />
                Home & Shop
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
                <li><Link to="/products" className="hover:text-primary-600">Products</Link></li>
                <li><Link to="/new-arrivals" className="hover:text-primary-600">New Arrivals</Link></li>
                <li><Link to="/deals" className="hover:text-primary-600">Deals</Link></li>
                <li><Link to="/products" className="hover:text-primary-600">Categories</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-primary-600" />
                Account
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><Link to="/login" className="hover:text-primary-600">Login</Link></li>
                <li><Link to="/register" className="hover:text-primary-600">Register</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary-600">Dashboard</Link></li>
                <li><Link to="/orders" className="hover:text-primary-600">Orders</Link></li>
                <li><Link to="/wishlist" className="hover:text-primary-600">Wishlist</Link></li>
              </ul>
            </div>

            {/* Cart & Checkout */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-primary-600" />
                Cart & Checkout
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><Link to="/cart" className="hover:text-primary-600">Shopping Cart</Link></li>
                <li><Link to="/orders" className="hover:text-primary-600">Checkout & Orders</Link></li>
                <li><Link to="/returns" className="hover:text-primary-600">Returns</Link></li>
              </ul>
            </div>

            {/* Legal & Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary-600" />
                Legal & Info
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><Link to="/privacy" className="hover:text-primary-600">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary-600">Terms of Service</Link></li>
                <li><Link to="/cookies" className="hover:text-primary-600">Cookie Policy</Link></li>
                <li><Link to="/sitemap" className="hover:text-primary-600">Sitemap</Link></li>
                <li><Link to="/contact" className="hover:text-primary-600">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              © 2026 ProShop. All rights reserved. | 
              <Link to="/sustainability" className="text-primary-600 hover:underline ml-2">Sustainability</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sitemap