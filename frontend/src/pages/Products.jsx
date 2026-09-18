import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useCart } from '../hooks/useCart'
import PageHero from '../components/layout/PageHero'
import { Filter, Search as SearchIcon, ChevronDown, Shield, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { apiUrl } from '../utils/api'

const Products = () => {
  const { addToCart, addToWishlist, wishlist } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([]) // Real data from API
  const [filter, setFilter] = useState('All')
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const [sort, setSort] = useState('relevance')
  const [view, setView] = useState('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCategories, setSelectedCategories] = useState([]) // For multi-filter
  const category = searchParams.get('category') || 'All'
  const appliedSearch = searchParams.get('search') || ''

  useEffect(() => {
    setFilter(category)
    setSelectedCategories(category === 'All' ? [] : [category])
  }, [category])

  useEffect(() => {
    setSearchInput(appliedSearch)
  }, [appliedSearch])

  // Real API fetch for products with cache busting
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError('')
      try {
        // Multi-category support: Join selectedCategories with commas
        const categoryParam = selectedCategories.length > 0 ? selectedCategories.join(',') : (filter === 'All' ? '' : filter)
        
        const params = new URLSearchParams({
          search: appliedSearch || '',
          category: categoryParam,
          sort,
          page: String(currentPage),
          limit: 12,
          _t: Date.now() // Cache buster to avoid 304 stale data
        })
        const res = await fetch(apiUrl(`/api/products?${params}`), {
          cache: 'no-cache', // Force fresh fetch
          headers: { 'Cache-Control': 'no-cache' }
        })
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
          setTotalPages(data.totalPages || 1)
        } else {
          const errorData = await res.json()
          setError(errorData.msg || 'Failed to load products. Please try again.')
        }
      } catch (err) {
        setError('Network error. Please check your connection.')
        console.error('Products fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [appliedSearch, filter, selectedCategories, sort, currentPage]) // Added selectedCategories to deps

  // Categories from seeded data (match exactly)
  const categories = ['All', 'Electronics', 'Fashion', 'Home & Garden']

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const applyProductSearch = (value) => {
    const cleanValue = value.trim()
    const next = new URLSearchParams(searchParams)

    if (cleanValue) {
      next.set('search', cleanValue)
    } else {
      next.delete('search')
    }

    next.delete('page')
    setSearchParams(next)
    setCurrentPage(1)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    applyProductSearch(searchInput)
  }

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
    if (selectedCategories.includes(cat)) {
      setFilter('All') // If deselecting last, reset filter
    } else {
      setFilter(cat)
    }
    setCurrentPage(1) // Reset page
  }

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1) // Pass quantity 1
    } catch (err) {
      setError('Failed to add to cart. Please try again.')
    }
  }

  const handleAddToWishlist = async (product) => {
    try {
      await addToWishlist(product)
    } catch (err) {
      setError('Failed to add to wishlist. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      <PageHero
        title={filter !== 'All' ? `${filter} Collection` : 'All Products'}
        subtitle="Discover curated products with real-time inventory and clean, secure checkout."
        badge="Live catalog"
        tone="blue"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Products' },
          ...(filter !== 'All' ? [{ label: filter }] : [])
        ]}
      />

      <div className="section-wrap py-8">
        {/* Header */}
        <div className="mb-8 surface-card p-5 md:p-6">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Browse Products</h2>
          <p className="mt-2 text-slate-600">
            {products.length} results {filter !== 'All' && `in "${filter}"`} {appliedSearch && `for "${appliedSearch}"`}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
            <button 
              onClick={() => window.location.reload()} 
              className="ml-4 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Controls: Search, Sort, View */}
        <div className="mb-6 surface-card p-4 md:p-6">
          <form onSubmit={handleSearchSubmit}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-20 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white hover:bg-primary-700"
                >
                  Search
                </button>
              </div>

              {/* Filters & Sort */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => { setFilter(e.target.value); setCurrentPage(1) }}
                    className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option>All</option>
                    {categories.slice(1).map(cat => <option key={cat}>{cat}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); setCurrentPage(1) }}
                    className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A-Z</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-2 rounded-md ${view === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    aria-label="Grid view"
                  >
                    <Filter className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-2 rounded-md ${view === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    aria-label="List view"
                  >
                    <span className="text-xs">List</span>
                  </button>
                </div>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="rounded-xl bg-primary-600 p-2 text-white hover:bg-primary-700 md:hidden"
                  aria-label="Open filters"
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Services Banner */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="flex items-center justify-center text-center text-sm text-slate-700 md:text-base">
            <Shield className="h-4 w-4 mr-2" />
            <strong>Free Shipping</strong> on all orders | <strong>Easy Returns</strong> within 30 days | Secure Checkout Guaranteed
          </p>
        </div>

        {/* Products Grid/List */}
        <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {products.map(product => (
            <ProductCard 
              key={product._id} 
              product={product}
              view={view}
              onAddToCart={handleAddToCart} 
              onAddToWishlist={handleAddToWishlist} 
              isInWishlist={wishlist.some(w => w._id === product._id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-16">
            <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters. Or start with our <Link to="/new-arrivals" className="text-primary-600 hover:underline">new arrivals</Link>.</p>
            <Link to="/products" className="btn-primary px-6 py-3">Browse All Products</Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              aria-label="Previous page"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-2 rounded-md border ${
                  currentPage === i + 1
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
                aria-label={`Page ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 md:hidden">
          <div className="mx-4 max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Filters</h3>
              <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-gray-700">
                <ChevronDown className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Categories</h4>
              {categories.slice(1).map(cat => (
                <label key={cat} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">{cat}</span>
                </label>
              ))}
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setCurrentPage(1) }}
                className="w-full rounded-xl border border-slate-300 px-4 py-2"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
              <Button onClick={() => setIsFilterOpen(false)} className="w-full">Apply Filters</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products