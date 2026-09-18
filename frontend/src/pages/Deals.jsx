import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import PageHero from '../components/layout/PageHero'
import { Clock, BadgeCheck, Sparkles, ChevronDown, Search as SearchIcon, Filter } from 'lucide-react' // Added Filter
import Input from '../components/ui/Input'
import { Button } from '../components/ui/Button'

const Deals = () => {
  const [sort, setSort] = useState('discount') // Mock sort
  const [view, setView] = useState('grid')
  const [search, setSearch] = useState('') // Added for search
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchDealsProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=24&sort=relevance')
        if (!res.ok) return
        const data = await res.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Deals fetch error:', error)
      }
    }

    fetchDealsProducts()
  }, [])

  const deals = useMemo(() => {
    return products.slice(0, 12).map((p, index) => ({
      ...p,
      discount: p.discount || ((index % 5) + 1) * 8
    }))
  }, [products])

  const filteredDeals = deals.filter(deal => 
    search === '' || deal.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    switch (sort) {
      case 'discount': return b.discount - a.discount // Highest discount first
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'name': return a.name.localeCompare(b.name)
      default: return 0
    }
  })

  return (
    <div className="min-h-screen bg-transparent">
      <PageHero
        title="Up to 70% Off Deals"
        subtitle="Limited-time pricing on top picks. Grab these steals before they're gone."
        badge="Flash Sale"
        tone="orange"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Deals' }
        ]}
      />

      <div className="section-wrap py-8">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center text-slate-700 shadow-sm">
          <div className="inline-flex items-center gap-2 text-sm font-semibold">
            <Clock className="h-4 w-4" />
            Time Left: 02:47:23
          </div>
        </div>

        <div className="mb-8">
          <h2 className="section-title text-gray-900 mb-2">Hot Deals</h2>
          <p className="text-xl text-gray-600">{filteredDeals.length} deals available</p>
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
                placeholder="Search deals..."
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
                  <option value="discount">Highest Discount</option>
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

        {/* Deals Grid */}
        <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredDeals.map((product) => (
            <ProductCard key={product.id} product={product} isDeal={true} view={view} />
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h3 className="mb-4 text-2xl font-bold text-slate-900">Don't Miss Out!</h3>
          <p className="text-gray-600 mb-6">Sign up for alerts on new deals and get 10% off your next purchase.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input placeholder="Enter email" className="flex-1" />
            <Button className="btn-primary">Get Alerts</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Deals