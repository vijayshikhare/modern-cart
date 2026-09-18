// Updated Header.jsx - Removed modals, added links to /login and /register
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, User, Menu, LogIn, UserPlus, ChevronDown, Package, Leaf, Loader2, Phone, UserCheck, Moon, Sun, X } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Search from '../components/ui/Search' // Adjusted path if needed

const SEARCH_PAGES = [
  { label: 'Products', description: 'Browse all products', path: '/products' },
  { label: 'Deals', description: 'Discounts and limited offers', path: '/deals' },
  { label: 'New Arrivals', description: 'Latest products in store', path: '/new-arrivals' },
  { label: 'Blog', description: 'Shopping tips and insights', path: '/blog' },
  { label: 'Services', description: 'Shipping, returns and support', path: '/services' },
  { label: 'Contact', description: 'Reach our support team', path: '/contact' },
  { label: 'Sustainability', description: 'Our eco commitment', path: '/sustainability' },
  { label: 'Wishlist', description: 'Your saved items', path: '/wishlist' },
  { label: 'Cart', description: 'Items ready for checkout', path: '/cart' },
  { label: 'Orders', description: 'Track your orders', path: '/orders' }
]

const Header = ({ theme = 'light', toggleTheme }) => {
  const { cart, wishlist } = useCart()
  const { user, logout, loading: authLoading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [productSuggestions, setProductSuggestions] = useState([])
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const userMenuRef = useRef(null)
  const searchRef = useRef(null)
  const searchBlurTimeoutRef = useRef(null)

  const handleSearch = (term) => {
    const query = String(term || searchQuery).trim()
    if (!query) return

    navigate(`/search?q=${encodeURIComponent(query)}`)
    setIsOpen(false)
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const wishlistCount = wishlist.length
  const trimmedSearch = searchQuery.trim()

  const pageSuggestions = trimmedSearch.length >= 2
    ? SEARCH_PAGES
      .filter((page) => `${page.label} ${page.description}`.toLowerCase().includes(trimmedSearch.toLowerCase()))
      .slice(0, 4)
      .map((page) => ({ ...page, type: 'page' }))
    : []

  const productSuggestionItems = productSuggestions.map((product) => ({
    id: product._id || product.id,
    label: product.name,
    description: `$${Number(product.price || 0).toFixed(2)} • ${product.category || 'Product'}`,
    path: `/products/${product._id || product.id}`,
    type: 'product'
  }))

  const suggestions = [...productSuggestionItems, ...pageSuggestions].slice(0, 7)
  const showSuggestions = !isOpen && searchFocused && trimmedSearch.length >= 2 && (searchLoading || suggestions.length > 0)

  const handleSearchFocus = () => {
    if (searchBlurTimeoutRef.current) {
      clearTimeout(searchBlurTimeoutRef.current)
    }
    setSearchFocused(true)
  }

  const handleSearchBlur = () => {
    searchBlurTimeoutRef.current = setTimeout(() => {
      setSearchFocused(false)
    }, 150)
  }

  const handleSuggestionSelect = (path) => {
    navigate(path)
    setSearchFocused(false)
    setIsOpen(false)
  }

  // Close mobile menu and user menu on route change
  useEffect(() => {
    setIsOpen(false)
    setUserMenuOpen(false)
    setActiveSubmenu(null)
    setSearchFocused(false)
  }, [location.pathname])

  useEffect(() => {
    const currentSearch = trimmedSearch

    if (currentSearch.length < 2) {
      setProductSuggestions([])
      setSearchLoading(false)
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const params = new URLSearchParams({
          search: currentSearch,
          limit: '4',
          sort: 'relevance',
          _t: String(Date.now())
        })

        const res = await fetch(`/api/products?${params}`, {
          signal: controller.signal,
          cache: 'no-cache',
          headers: { 'Cache-Control': 'no-cache' }
        })

        if (!res.ok) {
          throw new Error('Suggestion fetch failed')
        }

        const data = await res.json()
        setProductSuggestions(data.products || [])
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Search suggestion error:', error)
          setProductSuggestions([])
        }
      } finally {
        setSearchLoading(false)
      }
    }, 250)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [trimmedSearch])

  useEffect(() => {
    const handleOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false)
      }
    }

    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const closeUserMenu = () => {
    setUserMenuOpen(false)
    setActiveSubmenu(null)
  }

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu)
  }

  const navItems = [
    { to: '/', label: 'Home', exact: true },
    { to: '/products', label: 'Products', exact: false },
    { 
      label: 'Categories', 
      submenu: [
        { to: '/products?category=electronics', label: 'Electronics' },
        { to: '/products?category=fashion', label: 'Fashion' },
        { to: '/products?category=home', label: 'Home & Garden' },
      ]
    },
    { to: '/new-arrivals', label: 'New Arrivals' },
    { to: '/deals', label: 'Deals' },
    { to: '/blog', label: 'Blog' },
    { to: '/sustainability', label: 'Sustainability' },
    { to: '/services', label: 'Services' },
    { to: '/contact', label: 'Contact' },
  ]

  const mobileMenu = isOpen
    ? createPortal(
      <div className="fixed inset-0 z-[120] lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile menu">
        <button
          type="button"
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu overlay"
        />

        <aside className="absolute inset-y-0 right-0 h-dvh w-[88%] max-w-[360px] border-l border-slate-200 bg-white p-4 shadow-[0_24px_80px_rgba(2,6,23,0.45)] dark:border-slate-800 dark:bg-slate-950">
          <div className="flex h-full flex-col">
            <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">Menu</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
              <Search
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={handleSearch}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                isLoading={searchLoading}
                placeholder="Search..."
                className="w-full"
              />
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="mb-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>

            <div className="mb-3 grid grid-cols-2 gap-2">
              <Link
                to="/wishlist"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Heart className="mr-2 h-4 w-4" /> Wishlist
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Cart
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Navigation</p>
              <div className="space-y-2">
                {navItems.map((item, i) => (
                  <div key={i}>
                    {item.to ? (
                      <Link
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                        className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-gray-50 hover:text-primary-600 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-primary-400"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => toggleSubmenu(item.label)}
                        className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-gray-50 hover:text-primary-600 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-primary-400"
                      >
                        <span>{item.label}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeSubmenu === item.label ? 'rotate-180' : ''}`} />
                      </button>
                    )}

                    {item.submenu && activeSubmenu === item.label && (
                      <div className="mt-1 space-y-1 rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                        {item.submenu.map((sub, j) => (
                          <Link
                            key={j}
                            to={sub.to}
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-50 hover:text-primary-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-primary-400"
                            onClick={() => setIsOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 space-y-2 border-t border-gray-200 pt-3 dark:border-slate-700">
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Account</p>
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="flex items-center rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-gray-50 hover:text-primary-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-primary-400"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-gray-50 hover:text-primary-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-primary-400"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" /> Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-gray-50 hover:text-primary-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-primary-400"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserCheck className="mr-2 h-4 w-4" /> Dashboard
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-gray-50 hover:text-primary-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-primary-400"
                    onClick={() => setIsOpen(false)}
                  >
                    <Package className="mr-2 h-4 w-4" /> Orders
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    <LogIn className="mr-2 h-4 w-4" /> Logout
                  </button>
                </>
              )}
              <Link
                to="/contact"
                className="flex items-center rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-gray-50 hover:text-primary-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-primary-400"
                onClick={() => setIsOpen(false)}
              >
                <Phone className="mr-2 h-4 w-4" /> Support
              </Link>
            </div>
          </div>
        </aside>
      </div>,
      document.body
    )
    : null

  if (authLoading) {
    return (
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-700">Loading...</span>
        </div>
      </header>
    )
  }

  return (
    <>
      {/* Promo Bar */}
      <div className="hidden bg-slate-900 py-2 px-4 text-center text-xs text-white md:block">
        <span className="flex items-center justify-center">
          <Leaf className="h-4 w-4 mr-1" />
          Free Shipping on Orders Over $50 | Sustainable Shopping in 2025
        </span>
      </div>

      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between gap-2 py-3 sm:gap-4 sm:py-4">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center text-xl font-bold text-slate-900 transition-all duration-300 hover:text-primary-700 sm:text-2xl lg:text-3xl dark:text-slate-100"
              aria-label="ProShop Home"
            >
              ProShop
            </Link>

            {/* Desktop Search */}
            <div className="relative mx-4 hidden flex-1 max-w-2xl lg:flex" ref={searchRef}>
              <Search 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                onSearch={handleSearch}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                isLoading={searchLoading}
                placeholder="Search products, blog, deals, services..."
                className="w-full min-w-[280px]"
              />

              {showSuggestions && (
                <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-[70] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                  <div className="border-b border-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    Quick Results
                  </div>
                  {suggestions.map((item) => (
                    <button
                      key={`${item.type}-${item.path}`}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSuggestionSelect(item.path)}
                      className="flex w-full items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.label}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{item.description}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {item.type}
                      </span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSearch(trimmedSearch)}
                    className="w-full px-4 py-3 text-left text-sm font-semibold text-primary-700 transition hover:bg-primary-50 dark:hover:bg-slate-800"
                  >
                    See all results for "{trimmedSearch}"
                  </button>
                </div>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-1 xl:space-x-2">
              {/* Wishlist */}
              <Link 
                to="/wishlist" 
                className="group relative rounded-xl p-2 transition-all duration-300 hover:bg-gray-50 sm:p-3 dark:hover:bg-slate-800" 
                aria-label={`Wishlist (${wishlistCount} items)`}
              >
                <Heart className="h-5 w-5 text-gray-600 transition-colors group-hover:text-red-500 dark:text-slate-300" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="group relative rounded-xl p-2 transition-all duration-300 hover:bg-gray-50 sm:p-3 dark:hover:bg-slate-800" 
                aria-label={`Shopping cart (${cartCount} items)`}
              >
                <ShoppingCart className="h-5 w-5 text-gray-600 transition-colors group-hover:text-primary-600 dark:text-slate-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-xl p-2 text-gray-600 transition-all duration-300 hover:bg-gray-50 hover:text-primary-600 sm:p-3 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-400"
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* User Menu */}
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)} 
                  className="group flex items-center rounded-xl p-3 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  <User className="h-5 w-5 text-gray-600 transition-colors group-hover:text-primary-600 dark:text-slate-300" />
                  <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 z-50 w-56 animate-in rounded-xl border border-gray-200 bg-white py-2 shadow-2xl fade-in-0 slide-in-from-top-2 duration-200 dark:border-slate-700 dark:bg-slate-900">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link 
                          to="/dashboard" 
                          className="block px-4 py-2 hover:bg-gray-50 flex items-center transition-colors" 
                          onClick={closeUserMenu}
                        >
                          <UserCheck className="h-4 w-4 mr-3 text-gray-600" /> Dashboard
                        </Link>
                        <Link 
                          to="/orders" 
                          className="block px-4 py-2 hover:bg-gray-50 flex items-center transition-colors" 
                          onClick={closeUserMenu}
                        >
                          <Package className="h-4 w-4 mr-3 text-gray-600" /> Orders
                        </Link>
                        <hr className="my-1 border-gray-100" />
                        <button 
                          onClick={() => { closeUserMenu(); logout(); }} 
                          className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center text-red-600 transition-colors"
                        >
                          <LogIn className="h-4 w-4 mr-3" /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link 
                          to="/login"
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center transition-colors" 
                          onClick={closeUserMenu}
                        >
                          <LogIn className="h-4 w-4 mr-3 text-gray-600" /> Login
                        </Link>
                        <Link 
                          to="/register"
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center transition-colors" 
                          onClick={closeUserMenu}
                        >
                          <UserPlus className="h-4 w-4 mr-3 text-gray-600" /> Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                className="rounded-xl p-2 transition-all duration-300 hover:bg-gray-50 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <Menu className="h-6 w-6 text-gray-600 dark:text-slate-300" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block" aria-label="Main navigation">
            <div className="flex justify-center space-x-1 py-3 border-t border-gray-100">
              {navItems.map((item, i) => (
                <div key={i} className="relative group">
                  {item.to ? (
                    <Link 
                      to={item.to} 
                      className={`px-4 py-3 rounded-lg transition-all duration-300 block ${
                        (item.exact && location.pathname === item.to) || 
                        (!item.exact && location.pathname.startsWith(item.to) && item.to !== '/')
                          ? 'text-primary-600 bg-primary-50 shadow-md' 
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                      onClick={closeUserMenu}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="px-4 py-3 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-300 cursor-default block">
                      {item.label}
                    </span>
                  )}
                  
                  {item.submenu && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-200">
                      {item.submenu.map((sub, j) => (
                        <Link 
                          key={j} 
                          to={sub.to} 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                          onClick={() => setActiveSubmenu(null)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {mobileMenu}
        </div>
      </header>
    </>
  )
}

export default Header