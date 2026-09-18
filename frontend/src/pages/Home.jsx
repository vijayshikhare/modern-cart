import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { products as fallbackProducts, categories, testimonials, partners } from '../data/products'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Truck, Shield, Clock, Quote, Star, Play, Users, Award, Newspaper, Mail, HelpCircle } from 'lucide-react'
import SmartImage from '../components/ui/SmartImage'

const Home = () => {
  const [heroIndex, setHeroIndex] = useState(0)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [brandIndex, setBrandIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=16&sort=relevance')
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        }
      } catch (error) {
        console.error('Home products fetch error:', error)
      }
    }

    fetchHomeProducts()
  }, [])

  const displayProducts = products.length > 0 ? products : fallbackProducts

  // Enhanced hero slides with 2025 trends: more immersive, video placeholders
  const heroSlides = [
    { 
      img: 'https://picsum.photos/seed/hero-main/1400/600', 
      title: 'Big Sale! Up to 70% Off Everything', 
      subtitle: 'Limited time offer on top brands. Shop sustainable and save big in 2025.', 
      video: false 
    },
    { 
      img: 'https://picsum.photos/seed/new-arrivals-hero/1200/500', 
      title: 'New Arrivals: Eco-Friendly Essentials', 
      subtitle: 'Discover trending sustainable fashion with blockchain-verified origins.', 
      video: true 
    },
    { 
      img: 'https://picsum.photos/seed/tech-gadgets-hero/1200/500', 
      title: 'Tech Revolution: Smart Home 2025', 
      subtitle: 'Voice-activated devices and AR previews. Experience the future now.', 
      video: false 
    },
  ]

  // Mock trending products (expand for scale)
  const trendingProducts = displayProducts.slice(1, 4)
  const newArrivals = displayProducts.slice(4, 7)

  // Auto-advance hero
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      })
    })
    const sections = document.querySelectorAll('section')
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const nextHero = () => setHeroIndex((prev) => (prev + 1) % heroSlides.length)
  const prevHero = () => setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  const nextTestimonial = () => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
  const nextBrand = () => setBrandIndex((prev) => (prev + 1) % partners.length)

  // Mock blog posts for scale
  const blogPosts = [
    { id: 1, title: 'Top Sustainable Fashion Trends for 2025', excerpt: 'Explore eco-friendly materials...', img: 'https://picsum.photos/seed/blog-1/400/200' },
    { id: 2, title: 'How Blockchain is Revolutionizing E-Commerce', excerpt: 'Secure and transparent shopping...', img: 'https://picsum.photos/seed/blog-2/400/200' },
    { id: 3, title: 'Best Smart Home Gadgets Under $100', excerpt: 'Voice search and AR integration...', img: 'https://picsum.photos/seed/blog-3/400/200' },
  ]

  // Mock FAQ
  const faqs = [
    { q: 'What is your return policy?', a: '30-day free returns with easy process.' },
    { q: 'Do you offer international shipping?', a: 'Yes, worldwide with tracked delivery.' },
    { q: 'How secure are payments?', a: 'Fully encrypted with BNPL options.' },
  ]

  // Dedupe categories to avoid duplicate keys
  const uniqueCategories = [...categories, { name: 'Books', icon: '📚', color: 'bg-purple-100' }].filter((cat, index, self) =>
    index === self.findIndex(c => c.name === cat.name)
  )

  return (
    <div className="bg-transparent">
      {/* Enhanced Hero: Full-width, immersive with video placeholder */}
      <section className="relative w-full overflow-hidden rounded-b-3xl border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
        <div className="relative section-wrap">
          <SmartImage
            seed={`home-hero-${heroIndex}`}
            src={heroSlides[heroIndex].img} 
            alt="Hero" 
            className="w-full h-64 sm:h-80 md:h-[500px] object-cover opacity-70 transition-opacity duration-1000" 
          />
          {heroSlides[heroIndex].video && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="h-12 w-12 sm:h-16 sm:w-16 text-white opacity-80" />
              <span className="absolute text-white text-xs sm:text-sm uppercase tracking-wider">Watch Video</span>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/15 via-white/35 to-white/80 dark:from-slate-950/20 dark:via-slate-950/35 dark:to-slate-950/80">
            <div className="mx-auto max-w-4xl px-4 text-center text-slate-900 dark:text-slate-100">
              <h1 className="mb-6 animate-fade-in text-2xl font-bold sm:text-4xl md:text-6xl">{heroSlides[heroIndex].title}</h1>
              <p className="mb-8 text-lg leading-relaxed text-slate-700 dark:text-slate-200 sm:text-xl md:text-2xl">{heroSlides[heroIndex].subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products" className="btn-primary px-6 py-3 sm:px-10 sm:py-4 text-base sm:text-xl inline-flex items-center">Shop Now <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" /></Link>
                <Link to="/services" className="rounded-md border-2 border-slate-900 px-6 py-3 text-sm text-slate-900 transition-all duration-300 hover:bg-slate-900 hover:text-white dark:border-slate-200 dark:text-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900 sm:px-10 sm:py-4 sm:text-base">Learn More</Link>
              </div>
            </div>
          </div>
          <button 
            onClick={prevHero} 
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-slate-900 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-white sm:left-4 sm:p-3"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button 
            onClick={nextHero} 
            aria-label="Next slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-slate-900 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-white sm:right-4 sm:p-3"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
            {heroSlides.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setHeroIndex(i)} 
                aria-label={`Go to slide ${i + 1}`}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${i === heroIndex ? 'bg-white scale-110' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="section-wrap py-8 sm:py-12 lg:py-16">
        {/* Enhanced Categories: More items, images for scale */}
        <section className={`mb-12 sm:mb-16 ${isVisible ? 'animate-fade-in' : ''}`}>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">Shop by Category</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-300">Explore our curated collections for every need</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
            {uniqueCategories.map((cat, index) => (
              <Link 
                key={index} // Use index for unique key (stable list)
                to={`/products?category=${encodeURIComponent(cat.name)}`} 
                className={`group relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:scale-105 transition-all duration-500 shadow-md ${cat.color} hover:shadow-xl hover:${cat.color.replace('100', '50')}`}
                aria-label={`Shop ${cat.name}`}
              >
                <div className="text-3xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base group-hover:text-primary-600 transition-colors">{cat.name}</h3>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </section>

        {/* Top Brands: New carousel section for scale */}
        <section className={`mb-12 sm:mb-16 ${isVisible ? 'animate-fade-in' : ''}`}>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Top Brands We Love</h2>
          <div className="relative overflow-hidden px-4">
            <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${brandIndex * 25}%)` }}>
              {partners.concat(partners).map((partner, i) => (
                <div key={i} className="flex-shrink-0 w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/8 px-2 sm:px-4">
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="w-full h-12 sm:h-16 object-contain opacity-70 hover:opacity-100 transition-opacity mx-auto py-4" 
                  />
                </div>
              ))}
            </div>
            <button 
              onClick={nextBrand} 
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-1 sm:p-2 rounded-full hidden md:block"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </section>

        {/* Flash Deals: Enhanced with countdown placeholder */}
        <section className={`mb-12 sm:mb-16 ${isVisible ? 'animate-fade-in' : ''}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Flash Deals - Ending Soon</h2>
            <div className="flex space-x-1 bg-red-100 px-3 py-2 rounded-full">
              <span className="text-red-600 font-mono text-sm">02:47:23</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {displayProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id || product.id} product={product} isDeal={true} />
            ))}
          </div>
        </section>

        {/* New Arrivals: New section */}
        <section className={`mb-12 sm:mb-16 ${isVisible ? 'animate-fade-in' : ''}`}>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">New Arrivals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-6 sm:mt-8">
            <Link to="/new-arrivals" className="btn-primary px-6 py-3 sm:px-8">View All New Arrivals</Link>
          </div>
        </section>

        {/* Services: Enhanced with icons and more */}
        <section className={`mb-12 sm:mb-16 surface-card py-8 sm:py-16 ${isVisible ? 'animate-fade-in' : ''}`}>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Why Shop With Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="text-center p-4 sm:p-6 surface-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <Truck className="h-12 w-12 sm:h-16 sm:w-16 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg sm:text-xl mb-2">Free Shipping</h3>
              <p className="text-gray-600 text-sm sm:text-base">On orders over $50. Worldwide delivery.</p>
            </div>
            <div className="text-center p-4 sm:p-6 surface-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg sm:text-xl mb-2">Secure Payments</h3>
              <p className="text-gray-600 text-sm sm:text-base">Blockchain-secured & BNPL options.</p>
            </div>
            <div className="text-center p-4 sm:p-6 surface-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <Clock className="h-12 w-12 sm:h-16 sm:w-16 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg sm:text-xl mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm sm:text-base">Voice-assisted chat & expert help.</p>
            </div>
            <div className="text-center p-4 sm:p-6 surface-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <Award className="h-12 w-12 sm:h-16 sm:w-16 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg sm:text-xl mb-2">Satisfaction Guaranteed</h3>
              <p className="text-gray-600 text-sm sm:text-base">30-day returns, no questions asked.</p>
            </div>
          </div>
        </section>

        {/* Trending Now: New carousel-like section */}
        <section className={`mb-12 sm:mb-16 ${isVisible ? 'animate-fade-in' : ''}`}>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Trending Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Testimonials: Multi-item grid for scale */}
        <section className={`mb-12 sm:mb-16 py-8 sm:py-16 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900/40 dark:to-slate-950/20 ${isVisible ? 'animate-fade-in' : ''}`}>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="surface-card p-4 sm:p-8 relative">
                <Quote className="absolute -top-2 sm:-top-4 left-1/2 transform -translate-x-1/2 h-6 w-6 sm:h-8 sm:w-8 text-gray-300" />
                <p className="text-base sm:text-lg italic mb-6 text-gray-700 dark:text-slate-300">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="flex mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 sm:h-5 sm:w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <div>
                    <span className="font-semibold block text-sm sm:text-base">- {testimonial.author}</span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Verified Buyer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={nextTestimonial} 
            className="mx-auto mt-6 sm:mt-8 block btn-primary px-6 py-3 rounded-full text-sm sm:text-base"
          >
            Read More Stories <ChevronRight className="inline h-4 w-4 sm:h-5 sm:w-5 ml-1" />
          </button>
        </section>

        {/* Best Sellers: Enhanced */}
        <section className={`mb-12 sm:mb-16 ${isVisible ? 'animate-fade-in' : ''}`}>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Best Sellers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {displayProducts.slice(3).map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Sustainability Story: New mission-driven section */}
        <section className={`mb-12 sm:mb-16 surface-card py-8 sm:py-16 ${isVisible ? 'animate-fade-in' : ''}`}>
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Committed to a Sustainable Future</h2>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-slate-300 mb-8">In 2025, we're leading with eco-conscious practices. Every purchase plants a tree and supports fair trade.</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-6 sm:space-y-0 sm:space-x-8 mb-8 sm:mb-12 flex-wrap">
              <div className="text-center">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mx-auto mb-2" />
                <p className="font-bold text-xl sm:text-2xl">1M+</p>
                <p className="text-gray-600 dark:text-slate-300 text-sm sm:text-base">Happy Customers</p>
              </div>
              <div className="text-center">
                <Award className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mx-auto mb-2" />
                <p className="font-bold text-xl sm:text-2xl">5-Star</p>
                <p className="text-gray-600 dark:text-slate-300 text-sm sm:text-base">Rated</p>
              </div>
              <div className="text-center">
                <Truck className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mx-auto mb-2" />
                <p className="font-bold text-xl sm:text-2xl">Zero Waste</p>
                <p className="text-gray-600 dark:text-slate-300 text-sm sm:text-base">Packaging</p>
              </div>
            </div>
            <Link to="/sustainability" className="btn-primary px-6 py-3 sm:px-8">Our Impact</Link>
          </div>
        </section>

        {/* Featured Blog: New content section for engagement */}
        <section className={`mb-12 sm:mb-16 ${isVisible ? 'animate-fade-in' : ''}`}>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Latest Insights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogPosts.map((post) => (
              <div key={post.id} className="surface-card overflow-hidden transition-all duration-300 hover:shadow-xl">
                <SmartImage seed={`blog-${post.id}`} src={post.img} alt={post.title} className="w-full h-32 sm:h-48 object-cover" />
                <div className="p-4 sm:p-6">
                  <h3 className="font-semibold text-base sm:text-xl mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 dark:text-slate-300 mb-4 text-sm line-clamp-2">{post.excerpt}</p>
                  <Link to="/blog" className="flex items-center text-primary-600 hover:underline text-sm sm:text-base">
                    Read More <Newspaper className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter: Embedded for conversion */}
        <section className={`mb-12 sm:mb-16 surface-card py-8 sm:py-12 ${isVisible ? 'animate-fade-in' : ''}`}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Stay in the Loop</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-300 mb-8">Subscribe for exclusive deals, trends, and 10% off your first order.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 max-w-md px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              />
              <button className="btn-primary px-6 py-3 sm:px-8 sm:py-4 rounded-full flex items-center text-sm sm:text-base">
                Subscribe <Mail className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* FAQ: New accordion for UX */}
        <section className={`mb-12 sm:mb-16 ${isVisible ? 'animate-fade-in' : ''}`}>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="surface-card overflow-hidden">
                <button className="w-full text-left p-4 sm:p-6 font-semibold flex justify-between items-center text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  {faq.q} <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </button>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-gray-600 text-sm hidden">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partners: Enhanced */}
        <section className={`py-8 sm:py-16 bg-gray-800 text-white rounded-2xl ${isVisible ? 'animate-fade-in' : ''}`}>
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-8 sm:mb-12">Our Trusted Partners</h2>
          <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
            {partners.map((partner, i) => (
              <span
                key={i}
                className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white/90"
              >
                {partner.name}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home