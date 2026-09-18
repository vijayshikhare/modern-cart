import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search as SearchIcon, Calendar, User, ChevronRight } from 'lucide-react'
import PageHero from '../components/layout/PageHero'
import SmartImage from '../components/ui/SmartImage'
import { apiUrl } from '../utils/api'

const Blog = () => {
  const [search, setSearch] = useState('')
  const [view, setView] = useState('grid')
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchBlogProducts = async () => {
      try {
        const res = await fetch(apiUrl('/api/products?limit=12&sort=relevance'))
        if (!res.ok) return
        const data = await res.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Blog products fetch error:', error)
      }
    }

    fetchBlogProducts()
  }, [])

  const posts = useMemo(() => {
    if (!products.length) {
      return [
        { id: 1, title: 'Top Sustainable Fashion Trends for 2025', excerpt: 'Explore eco-friendly materials and ethical brands shaping the future.', date: 'Jan 10, 2026', author: 'ProShop Editorial', image: 'https://picsum.photos/seed/blog-fallback-1/400/200' },
        { id: 2, title: 'How Blockchain is Revolutionizing E-Commerce', excerpt: 'Secure and transparent shopping: The tech behind the next wave.', date: 'Jan 5, 2026', author: 'ProShop Editorial', image: 'https://picsum.photos/seed/blog-fallback-2/400/200' },
        { id: 3, title: 'Best Smart Home Gadgets Under $100', excerpt: 'Voice search and AR integration for modern living.', date: 'Dec 30, 2025', author: 'ProShop Editorial', image: 'https://picsum.photos/seed/blog-fallback-3/400/200' },
      ]
    }

    return products.slice(0, 6).map((product, index) => ({
      id: product._id || index,
      title: `${product.name}: Buying Guide & Highlights`,
      excerpt: product.description || 'Discover features, value, and why this product is trending right now.',
      date: new Date(product.createdAt || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      author: 'ProShop Editorial',
      image: product.image || `https://picsum.photos/seed/blog-${index + 1}/400/200`
    }))
  }, [products])

  const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-transparent">
      <PageHero
        title="Insights & Inspiration"
        subtitle="Stay ahead with our latest stories on sustainable living, tech, and smarter shopping."
        tone="slate"
        badge="Editorial"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Blog' }
        ]}
      />

      <div className="section-wrap py-8">
        <div className="mb-8">
          <h2 className="section-title text-gray-900 mb-2">Latest Posts</h2>
          <p className="text-xl text-gray-600">{filteredPosts.length} articles {search && `matching "${search}"`}</p>
        </div>

        {/* Search */}
        <div className="mb-6 surface-card p-4 md:p-6">
          <div className="relative max-w-md mx-auto">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Posts Grid */}
        <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredPosts.map((post) => (
            <div key={post.id} className="surface-card overflow-hidden transition-all duration-300 hover:shadow-xl">
              <SmartImage seed={`blog-post-${post.id}`} src={post.image} alt={post.title} className="h-48 w-full object-cover" />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <User className="h-3 w-3 mr-1" />
                  <span>{post.author}</span>
                </div>
                <Link to="/blog">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">{post.title}</h3>
                </Link>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <Link to="/blog" className="flex items-center text-primary-600 hover:underline text-sm">
                  Read More <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Posts Found</h3>
            <p className="text-gray-600 mb-6">Try a different search or check back later.</p>
            <Link to="/blog" className="btn-primary px-6 py-3">Browse All</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog