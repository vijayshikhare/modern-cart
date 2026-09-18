import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Star, Heart, Eye, BadgeCheck, Loader2 } from 'lucide-react'
import { Button } from './ui/Button'
import SmartImage from './ui/SmartImage'
import { cn } from '../utils/cn'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState } from 'react'

const ProductCard = ({ product, isDeal = false, view = 'grid' }) => {
  const { addToCart, addToWishlist, removeFromWishlist, wishlist, cart } = useCart()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isInCart, setIsInCart] = useState(false) // Track if already in cart
  const navigate = useNavigate()
  const location = useLocation()

  // Check if product is in wishlist or cart (use _id for API data, id for mock)
  const productId = product._id || product.id
  const isWishlisted = wishlist.some(item => (item._id || item.id) === productId)
  const isInCartItem = cart.some(item => (item._id || item.id) === productId)
  const isNew = product.isNew || false // From data
  const rating = product.rating || 4.5 // From data

  // Update in-cart state on mount
  useEffect(() => {
    setIsInCart(isInCartItem)
  }, [isInCartItem])

  const handleAddToCart = async () => {
    if (isLoading) return

    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`)
      return
    }

    setIsLoading(true)
    try {
      // Call hook to add (assumes hook handles async API if needed)
      await addToCart(product, 1)
      setIsInCart(true)
      // Optional: Show toast/success message here
    } catch (error) {
      console.error('Add to cart error:', error)
      // Optional: Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToWishlist = async () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`)
      return
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(productId)
      } else {
        await addToWishlist(product)
      }
    } catch (error) {
      console.error('Wishlist error:', error)
    }
  }

  const handleQuickView = () => {
    navigate(`/products/${productId}`)
  }

  const imageUrl = product.image

  if (view === 'list') {
    return (
      <div className="surface-card overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl flex">
        <Link to={`/products/${productId}`} className="flex-shrink-0">
          <SmartImage
            seed={productId || product.name}
            src={imageUrl}
            alt={product.name}
            className="w-32 h-full object-cover hover:brightness-90 transition-all"
          />
        </Link>
        <div className="p-6 flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <Link to={`/products/${productId}`}>
                <h3 className="font-semibold text-base text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">{product.name}</h3>
              </Link>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
            </div>
            {isNew && <BadgeCheck className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />}
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold text-primary-600">${product.price}</span>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-gray-500">({rating})</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleAddToCart} 
              className="flex-1" 
              disabled={isLoading || isInCart}
              variant={isInCart ? "outline" : "default"}
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : isInCart ? 'In Cart' : 'Add to Cart'}
            </Button>
            <button 
              onClick={handleAddToWishlist}
              className={cn(
                'p-2 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center',
                isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-red-500'
              )}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={cn('h-4 w-4 transition-colors', isWishlisted && 'fill-red-500')} />
            </button>
            <button 
              onClick={handleQuickView}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all text-gray-500 hover:text-gray-700"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>
        {isDeal && <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">Deal</span>}
      </div>
    )
  }

  return (
    <div className={cn(
      'surface-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-fade-in group relative',
      isDeal && 'ring-2 ring-red-500 ring-offset-2'
    )}>
      {isDeal && <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs animate-pulse z-10">Deal!</span>}
      {isNew && <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs z-10">New</span>}
      <Link to={`/products/${productId}`}>
        <div className="relative overflow-hidden">
          <SmartImage
            seed={productId || product.name}
            src={imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:brightness-90 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>
      <div className="p-4">
        <div className="mb-3">
          <Link to={`/products/${productId}`}>
            <h3 className="text-base font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 mb-1">{product.name}</h3>
          </Link>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-primary-600">${product.price}</span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-xs text-gray-500">({rating})</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleAddToCart} 
            className="flex-1" 
            disabled={isLoading || isInCart}
            variant={isInCart ? "outline" : "default"}
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : isInCart ? 'In Cart' : 'Add to Cart'}
          </Button>
          <button 
            onClick={handleAddToWishlist}
            className={cn(
              'p-2 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center w-8 h-8',
              isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-red-500'
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={cn('h-4 w-4 transition-colors', isWishlisted && 'fill-red-500')} />
          </button>
          <button 
            onClick={handleQuickView}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center"
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard