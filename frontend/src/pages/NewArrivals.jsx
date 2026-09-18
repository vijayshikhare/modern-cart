import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import PageHero from '../components/layout/PageHero'
import { Filter, Search as SearchIcon, ChevronDown, BadgeCheck, Sparkles, ArrowRight } from 'lucide-react' // Added ArrowRight

const NewArrivals = () => {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [sort, setSort] = useState('newest') // Default to newest
  const [view, setView] = useState('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await fetch('/api/products?limit=36&sort=relevance')
        if (!res.ok) return
        const data = await res.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('New arrivals fetch error:', error)
      }
    }

    fetchNewArrivals()
  }, [])

  const newProducts = products
    .filter((product) => product.isNewArrival || product.createdAt)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 16)
    .map((product) => ({ ...product, isNew: true }))

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (search) params.set('search', search)
    else params.delete('search')
    // Update URL without full navigation
  }, [search])

  const filteredProducts = newProducts.filter(p => 
    (search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => {
    switch (sort) {
      case 'newest': return 0 // Already sorted
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'name': return a.name.localeCompare(b.name)
      default: return 0
    }
  })

  const itemsPerPage = 8
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-transparent">
      <PageHero
        title="Fresh Finds Just In"
        subtitle="Discover the latest drops across fashion, gadgets, and lifestyle essentials."
        badge="New Arrivals"
        tone="violet"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'New Arrivals' }
        ]}
      />

      <div className="section-wrap py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/80 px-6 py-6 text-center shadow-card backdrop-blur md:flex-row md:justify-between md:text-left">
          <h2 className="section-title text-gray-900 mb-2">New Arrivals</h2>
          <p className="text-base text-gray-600 md:text-lg">
            {filteredProducts.length} fresh picks {search && `for "${search}"`}
          </p>
          <Link to="/products" className="btn-secondary inline-flex items-center">
            Shop Full Catalog <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {/* Controls */}
        <div className="mb-6 surface-card p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search new arrivals..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Sort & View */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-md ${view === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Filter className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded-md ${view === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <span className="text-xs">List</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {paginatedProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} isNew={product.isNew} view={view} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No New Arrivals Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or check back soon!</p>
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
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewArrivals