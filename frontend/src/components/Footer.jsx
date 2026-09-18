import { Link } from 'react-router-dom'
import { Mail, Facebook, Twitter, Instagram, Youtube, Phone, MapPin, Clock } from 'lucide-react'
import Input from './ui/Input'
import { Button } from './ui/Button' // Fixed: Named import
import { partners } from '../data/products'

const Footer = () => (
  <footer className="mt-auto border-t border-slate-200/70 bg-slate-950 text-white">
    <div className="h-1 w-full bg-slate-800" />
    {/* Main Footer Content */}
    <div className="section-wrap py-12 md:py-14">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-10">
        {/* Company Info */}
        <div>
          <h3 className="mb-4 flex items-center text-2xl font-bold">
            <span className="mr-2">ProShop</span>
            <span className="rounded-full bg-emerald-500/90 px-2 py-1 text-xs font-semibold text-white">Trusted 2026</span>
          </h3>
          <p className="mb-6 leading-relaxed text-slate-300">Your trusted ecommerce partner for premium products, reliable delivery, and seamless customer service.</p>
          {/* Social Links */}
          <div className="flex space-x-4 mb-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 p-2 hover:bg-slate-800 transition-colors" aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 p-2 hover:bg-slate-800 transition-colors" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 p-2 hover:bg-slate-800 transition-colors" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 p-2 hover:bg-slate-800 transition-colors" aria-label="Youtube">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
          {/* Contact Info */}
          <div className="space-y-2 text-sm text-slate-300">
            <p className="flex items-center"><Phone className="h-4 w-4 mr-2" /> +1 (555) 123-4567</p>
            <p className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> 123 Eco Street, Green City</p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-3">
            <li><Link to="/" className="block text-slate-300 hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/products" className="block text-slate-300 hover:text-white transition-colors">Products</Link></li>
            <li><Link to="/new-arrivals" className="block text-slate-300 hover:text-white transition-colors">New Arrivals</Link></li>
            <li><Link to="/deals" className="block text-slate-300 hover:text-white transition-colors">Deals</Link></li>
            <li><Link to="/blog" className="block text-slate-300 hover:text-white transition-colors">Blog</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-lg font-semibold mb-6">Shop by Category</h4>
          <ul className="space-y-3">
            <li><Link to="/products?category=electronics" className="block text-slate-300 hover:text-white transition-colors">Electronics</Link></li>
            <li><Link to="/products?category=fashion" className="block text-slate-300 hover:text-white transition-colors">Fashion</Link></li>
            <li><Link to="/products?category=home" className="block text-slate-300 hover:text-white transition-colors">Home & Garden</Link></li>
            <li><Link to="/products?category=books" className="block text-slate-300 hover:text-white transition-colors">Books</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-semibold mb-6">Customer Support</h4>
          <ul className="space-y-3">
            <li><Link to="/services" className="block flex items-center text-slate-300 hover:text-white transition-colors">
              <Clock className="h-4 w-4 mr-2" /> Order Tracking
            </Link></li>
            <li><Link to="/returns" className="block text-slate-300 hover:text-white transition-colors">Returns & Refunds</Link></li>
            <li><Link to="/contact" className="block text-slate-300 hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="/services" className="block text-slate-300 hover:text-white transition-colors">FAQ & Help</Link></li>
          </ul>
        </div>
      </div>

      {/* Newsletter */}
      <div className="mb-10 rounded-2xl border border-slate-700/80 bg-slate-900/80 p-6 md:p-8">
        <div className="text-center">
          <h4 className="text-xl font-semibold mb-4">Stay Updated with Exclusive Deals</h4>
          <p className="mb-6 text-slate-300">Subscribe to our newsletter for 10% off your first order and the latest trends.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              placeholder="Enter your email" 
              className="flex-1 rounded-xl border-slate-600 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:ring-primary-500" 
              type="email"
            />
            <Button className="flex items-center justify-center whitespace-nowrap rounded-xl px-8 py-3">
              <Mail className="h-4 w-4 mr-2" /> Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Partners */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
        <p className="mr-2 text-sm text-slate-300">Accepted Payment Methods:</p>
        {partners.map((partner, i) => (
          <span
            key={i}
            className="inline-flex rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200"
          >
            {partner.name}
          </span>
        ))}
      </div>

      {/* Copyright & Legal */}
      <div className="space-y-2 border-t border-slate-800 pt-6 text-center">
        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-300">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
        </div>
        <p className="text-sm text-slate-400">&copy; 2026 ProShop. All rights reserved.</p>
      </div>
    </div>
  </footer>
)

export default Footer