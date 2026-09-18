import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import ProductCard from '../components/ProductCard'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import { Button } from '../components/ui/Button'

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart()
  const [view, setView] = useState('grid')
  const [selectedItems, setSelectedItems] = useState(new Set())

  const wishlistProducts = wishlist

  const handleSelect = (id) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  const handleAddSelectedToCart = () => {
    wishlistProducts
      .filter((product) => selectedItems.has(product._id || product.id))
      .forEach((product) => addToCart(product, 1))
    setSelectedItems(new Set())
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-transparent py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="surface-card p-8">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 dark:text-slate-300 mb-8">Start adding items you love.</p>
            <Link to="/products" className="btn-primary px-6 py-3">Start Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Wishlist ({wishlistProducts.length} items)</h1>
          {selectedItems.size > 0 && (
            <Button onClick={handleAddSelectedToCart} className="flex items-center">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add Selected to Cart ({selectedItems.size})
            </Button>
          )}
        </div>

        <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {wishlistProducts.map((product) => (
            <div key={product._id || product.id} className="relative surface-card overflow-hidden group">
              <input
                type="checkbox"
                checked={selectedItems.has(product._id || product.id)}
                onChange={() => handleSelect(product._id || product.id)}
                className="absolute top-2 left-2 z-10 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <ProductCard product={product} view={view} />
              <button 
                onClick={() => removeFromWishlist(product._id || product.id)}
                className="absolute top-2 right-2 p-1 rounded-full bg-white dark:bg-slate-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wishlist