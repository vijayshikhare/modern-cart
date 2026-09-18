import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom' // Added Navigate
import { lazy, Suspense, useEffect, useState } from 'react'
import { useAuth } from './hooks/useAuth' // New import
import Header from './components/Header'
import Footer from './components/Footer'
import { Loader2 } from 'lucide-react'

// Lazy pages...
const Home = lazy(() => import('./pages/Home'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const NewArrivals = lazy(() => import('./pages/NewArrivals'))
const Deals = lazy(() => import('./pages/Deals'))
const Blog = lazy(() => import('./pages/Blog'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const Sustainability = lazy(() => import('./pages/Sustainability'))
const Services = lazy(() => import('./pages/Services'))
const Contact = lazy(() => import('./pages/Contact'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Orders = lazy(() => import('./pages/Orders'))
// Add these imports at the top
const Returns = lazy(() => import('./pages/Returns'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
const Sitemap = lazy(() => import('./pages/Sitemap'))

const segmentLabelMap = {
  products: 'Products',
  cart: 'Cart',
  checkout: 'Checkout',
  'new-arrivals': 'New Arrivals',
  deals: 'Deals',
  blog: 'Blog',
  search: 'Search',
  sustainability: 'Sustainability',
  services: 'Services',
  contact: 'Contact',
  wishlist: 'Wishlist',
  dashboard: 'Dashboard',
  login: 'Login',
  register: 'Register',
  orders: 'Orders',
  returns: 'Returns',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  cookies: 'Cookie Policy',
  sitemap: 'Sitemap'
}

const BreadcrumbBar = () => {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return null
  }

  const crumbs = [{ label: 'Home', to: '/' }]
  let fullPath = ''

  segments.forEach((segment, index) => {
    fullPath += `/${segment}`
    let label = segmentLabelMap[segment] || decodeURIComponent(segment).replace(/-/g, ' ')

    if (!segmentLabelMap[segment] && segments[index - 1] === 'products') {
      label = 'Product Details'
    }

    crumbs.push({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      to: fullPath
    })
  })

  return (
    <nav className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950" aria-label="Breadcrumb">
      <div className="section-wrap py-3">
        <ol className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1
            return (
              <li key={`${crumb.label}-${crumb.to}`} className="flex items-center">
                {index > 0 && <span className="mx-2 text-slate-400">/</span>}
                {isLast ? (
                  <span className="font-medium text-slate-900 dark:text-slate-100">{crumb.label}</span>
                ) : (
                  <Link to={crumb.to} className="hover:text-primary-600 dark:hover:text-primary-400">
                    {crumb.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="section-wrap flex min-h-[40vh] items-center justify-center">
        <div className="surface-card flex items-center gap-3 px-6 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
          <span className="text-sm font-medium text-slate-700">Checking session...</span>
        </div>
      </div>
    )
  }
  return user ? children : <Navigate to="/login" replace /> // Redirect to login
}

function App() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <BreadcrumbBar />
      <Suspense fallback={
        <main className="flex-grow">
          <div className="section-wrap py-20">
            <div className="surface-card flex min-h-[36vh] flex-col items-center justify-center gap-3 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <p className="text-sm font-medium text-slate-600">Loading your storefront...</p>
            </div>
          </div>
        </main>
      }>
        <main className="flex-grow pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/new-arrivals" element={<NewArrivals />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

      
<Route path="/returns" element={<Returns />} />
<Route path="/privacy" element={<PrivacyPolicy />} />
<Route path="/terms" element={<TermsOfService />} />
<Route path="/cookies" element={<CookiePolicy />} />
<Route path="/sitemap" element={<Sitemap />} />

            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                  <Link to="/" className="btn-primary px-6 py-3">Go Home</Link>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </Suspense>
      <Footer />
    </div>
  )
}

export default App