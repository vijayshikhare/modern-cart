import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import ProductCard from '../components/ProductCard'
import SmartImage from '../components/ui/SmartImage'
import { Button } from '../components/ui/Button' // Fixed: Named import
import { ArrowLeft, Heart, Star, ChevronLeft, ChevronRight, Truck, Shield, Clock } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { apiUrl } from '../utils/api'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [imageIndex, setImageIndex] = useState(0)
  const [buyNowLoading, setBuyNowLoading] = useState(false)
  const [buyNowError, setBuyNowError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const [productRes, relatedRes] = await Promise.all([
          fetch(apiUrl(`/api/products/${id}`)),
          fetch(apiUrl('/api/products?limit=8'))
        ])

        if (productRes.ok) {
          const productData = await productRes.json()
          setProduct(productData)
        } else {
          setProduct(null)
        }

        if (relatedRes.ok) {
          const relatedData = await relatedRes.json()
          setRelatedProducts((relatedData.products || []).filter((p) => p._id !== id).slice(0, 4))
        }
      } catch (error) {
        console.error('Failed to load product details:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const isWishlisted = useMemo(() => {
    return wishlist.some((item) => (item._id || item.id) === (product?._id || id))
  }, [wishlist, product, id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link to="/products" className="btn-primary px-6 py-3">Back to Products</Link>
        </div>
      </div>
    )
  }

  const productImages = [
    product.image,
    `https://picsum.photos/seed/${encodeURIComponent(product._id || product.name || 'product-gallery')}/900/900`
  ].filter(Boolean)
  const mockReviews = [
    { id: 1, author: 'John D.', rating: 5, text: 'Amazing product! Highly recommend.' },
    { id: 2, author: 'Jane S.', rating: 4, text: 'Great quality, fast delivery.' },
  ]
  const handleAddToCart = async () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`)
      return
    }

    try {
      await addToCart(product, quantity)
    } catch (error) {
      console.error('Add to cart error:', error)
    }
  }

  const handleBuyNow = async () => {
    setBuyNowError('')

    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent('/checkout')}`)
      return
    }

    try {
      setBuyNowLoading(true)
      await addToCart(product, quantity)
      navigate('/checkout')
    } catch (error) {
      setBuyNowError('Unable to continue to checkout. Please try again.')
      console.error('Buy now error:', error)
    } finally {
      setBuyNowLoading(false)
    }
  }

  const handleWishlistToggle = () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`)
      return
    }

    const productId = product?._id || product?.id
    if (!productId) return

    if (isWishlisted) {
      removeFromWishlist(productId)
    } else {
      addToWishlist(product)
    }
  }

  const nextImage = () => setImageIndex((prev) => (prev + 1) % productImages.length)
  const prevImage = () => setImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)

  const averageRating = 4.5 // Mock

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-xl overflow-hidden shadow-lg">
              <SmartImage
                seed={`${product._id || product.name}-main`}
                src={productImages[imageIndex]}
                alt={product.name}
                className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
              />
              {productImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={nextImage} 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {productImages.map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setImageIndex(i)}
                        className={`w-3 h-3 rounded-full ${i === imageIndex ? 'bg-primary-600' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="flex space-x-2">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`rounded border-2 ${i === imageIndex ? 'border-primary-500' : 'border-gray-200'}`}
                    onClick={() => setImageIndex(i)}
                  >
                    <SmartImage
                      seed={`${product._id || product.name}-thumb-${i}`}
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="h-20 w-20 rounded object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">({mockReviews.length} reviews)</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-6">${product.price}</div>
            </div>

            {/* Availability & Quantity */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 mb-3">In Stock • Ships in 1-2 days</p>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button onClick={handleAddToCart} className="w-full btn-primary py-3 text-lg">
                Add to Cart • ${(product.price * quantity).toFixed(2)}
              </Button>
              <div className="flex space-x-3">
                <Button
                  className="flex-1 py-3 border border-gray-300 hover:bg-gray-50"
                  variant="outline"
                  onClick={handleBuyNow}
                  disabled={buyNowLoading}
                >
                  {buyNowLoading ? 'Processing...' : 'Buy Now'}
                </Button>
                <button 
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-lg hover:bg-gray-100 transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-500'}`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                </button>
              </div>
              {buyNowError && <p className="text-sm text-red-600">{buyNowError}</p>}
            </div>

            {/* Guarantees */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-1" />
                Free Shipping
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                Secure Payment
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                30-Day Returns
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-1">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="font-medium text-gray-500">Category</dt>
                    <dd className="text-gray-900">{product.category}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Material</dt>
                    <dd className="text-gray-900">Premium Synthetic</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Weight</dt>
                    <dd className="text-gray-900">0.5 kg</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Dimensions</dt>
                    <dd className="text-gray-900">10 x 5 x 3 cm</dd>
                  </div>
                </dl>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                <div className="space-y-4 mb-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-900">{review.author}</span>
                      </div>
                      <p className="text-sm text-gray-600">{review.text}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full py-3">Write a Review</Button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <ProductCard key={related._id || related.id} product={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetail