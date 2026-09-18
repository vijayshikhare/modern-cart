import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, Loader2, ArrowRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import PageHero from '../components/layout/PageHero'
import Input from '../components/ui/Input'
import { apiUrl } from '../utils/api'

const searchablePages = [
  { title: 'Products', description: 'Browse all products and categories.', path: '/products', type: 'Page' },
  { title: 'Deals', description: 'Find discounted and limited-time offers.', path: '/deals', type: 'Page' },
  { title: 'New Arrivals', description: 'Discover the newest products in store.', path: '/new-arrivals', type: 'Page' },
  { title: 'Blog', description: 'Read shopping guides and trend insights.', path: '/blog', type: 'Page' },
  { title: 'Services', description: 'Explore support and delivery services.', path: '/services', type: 'Page' },
  { title: 'Contact', description: 'Get in touch with our support team.', path: '/contact', type: 'Page' },
  { title: 'Sustainability', description: 'See our sustainability commitments.', path: '/sustainability', type: 'Page' },
  { title: 'Cart', description: 'Review your cart and proceed to checkout.', path: '/cart', type: 'Page' },
  { title: 'Wishlist', description: 'View your saved products.', path: '/wishlist', type: 'Page' },
  { title: 'Orders', description: 'Track and manage your orders.', path: '/orders', type: 'Page' }
]

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  useEffect(() => {
    const currentQuery = (searchParams.get('q') || '').trim()

    if (!currentQuery) {
      setProducts([])
      setError('')
      return
    }

    const fetchProducts = async () => {
      setLoading(true)
      setError('')

      try {
        const params = new URLSearchParams({
          search: currentQuery,
          page: '1',
          limit: '8',
          sort: 'relevance',
          _t: String(Date.now())
        })

        const res = await fetch(apiUrl(`/api/products?${params}`), {
          cache: 'no-cache',
          headers: { 'Cache-Control': 'no-cache' }
        })

        if (!res.ok) {
          throw new Error('Failed to search products')
        }

        const data = await res.json()
        setProducts(data.products || [])
      } catch (err) {
        setError(err.message || 'Search failed. Please try again.')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams])

  const pageResults = useMemo(() => {
    const currentQuery = (searchParams.get('q') || '').trim().toLowerCase()
    if (!currentQuery) return []

    return searchablePages.filter((page) => {
      const haystack = `${page.title} ${page.description}`.toLowerCase()
      return haystack.includes(currentQuery)
    })
  }, [searchParams])

  const onSubmit = (e) => {
    e.preventDefault()
    const cleanQuery = query.trim()

    if (!cleanQuery) {
      setSearchParams({})
      return
    }

    setSearchParams({ q: cleanQuery })
  }

  const hasQuery = Boolean((searchParams.get('q') || '').trim())

  return (
    <div className="min-h-screen bg-transparent">
      <PageHero
        title="Search"
        subtitle="Search across products and key sections in one place."
        badge="Universal search"
        tone="slate"
      />

      <div className="section-wrap py-8">
        <form onSubmit={onSubmit} className="surface-card mb-6 p-4 md:p-5">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search everything..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4"
            />
          </div>
        </form>

        {!hasQuery && (
          <div className="surface-card p-6 text-sm text-slate-600">
            Start typing to search products, deals, blog, services, and more.
          </div>
        )}

        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        {loading && (
          <div className="surface-card flex items-center justify-center gap-3 p-8 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
            Searching...
          </div>
        )}

        {hasQuery && !loading && (
          <div className="space-y-8">
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Product Results</h2>
                <Link to={`/products?search=${encodeURIComponent(searchParams.get('q') || '')}`} className="text-sm font-medium text-primary-600 hover:underline">
                  View all in products
                </Link>
              </div>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product._id || product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="surface-card p-5 text-sm text-slate-600">No products matched your search.</div>
              )}
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-900">Site Results</h2>
              {pageResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {pageResults.map((page) => (
                    <Link key={page.path} to={page.path} className="surface-card group p-5 transition hover:-translate-y-0.5 hover:shadow-xl">
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary-700">{page.type}</div>
                      <h3 className="text-lg font-semibold text-slate-900">{page.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{page.description}</p>
                      <div className="mt-3 inline-flex items-center text-sm font-medium text-primary-600">
                        Open <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="surface-card p-5 text-sm text-slate-600">No site pages matched your search.</div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults
