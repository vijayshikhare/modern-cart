import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import Input from '../components/ui/Input'
import SmartImage from '../components/ui/SmartImage'
import { Button } from '../components/ui/Button' // Fixed: Named import
import { Trash2, Star, CreditCard, Truck, Shield, Clock, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useState } from 'react'

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotal } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)

  const handlePromoApply = () => {
    // Mock promo logic
    if (promoCode === 'SAVE10') {
      setPromoApplied(true)
      setPromoDiscount(10)
    } else {
      alert('Invalid promo code')
    }
  }

  const subtotal = parseFloat(getTotal()) || 0
  const totalWithDiscount = subtotal - promoDiscount

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-transparent py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="surface-card p-8">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 dark:text-slate-300 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <div className="space-y-3">
              <Link to="/products" className="w-full block btn-primary py-3 text-lg">Continue Shopping</Link>
              <Link to="/wishlist" className="w-full block rounded-md border border-slate-300 bg-slate-100 py-3 text-lg font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">View Wishlist</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">Shopping Cart</h1>
        <p className="text-xl text-gray-600 dark:text-slate-300 mb-8">{cart.length} items in your cart</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map(item => {
              const itemSubtotal = (item.price * item.quantity).toFixed(2)
              return (
                <div key={item._id || item.productId} className="surface-card overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                  <div className="p-6 flex items-center">
                    <Link to={`/products/${item.productId}`} className="flex-shrink-0">
                      <SmartImage seed={item.productId || item.name} src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg hover:scale-105 transition-transform" />
                    </Link>
                    <div className="flex-1 ml-4">
                      <Link to={`/products/${item.productId}`}>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-slate-100 hover:text-primary-600 transition-colors">{item.name}</h3>
                      </Link>
                      <p className="text-gray-600 dark:text-slate-300 text-sm mb-1">Category: {item.category}</p>
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-500">4.5</span>
                        </div>
                      </div>
                      <p className="text-gray-900 dark:text-slate-100 font-semibold">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-4 ml-auto">
                      <div className="flex items-center border border-gray-300 dark:border-slate-700 rounded-md p-1">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4 text-gray-500" />
                        </button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                          className="w-12 text-center border-0 bg-transparent focus:ring-0"
                          min="1"
                        />
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded"
                        >
                          <Plus className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                      <Button 
                        onClick={() => removeFromCart(item.productId)} 
                        variant="ghost" 
                        className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 border-t dark:bg-slate-900/70 dark:border-slate-700">
                    <span className="text-sm text-gray-600 dark:text-slate-300">Subtotal: </span>
                    <span className="font-bold text-gray-900 dark:text-slate-100">${itemSubtotal}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="surface-card p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Promo Discount</span>
                    <span>-${promoDiscount}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${totalWithDiscount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              {!promoApplied ? (
                <div className="space-y-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="pr-10"
                  />
                  <Button onClick={handlePromoApply} className="w-full text-sm" size="sm">
                    Apply Promo
                  </Button>
                </div>
              ) : (
                <div className="bg-green-50 p-3 rounded-md text-sm text-green-700">
                  Promo "{promoCode}" applied! -${promoDiscount} off
                </div>
              )}

              <Link to="/checkout" className="w-full btn-primary py-3 mb-4 text-lg text-center block">Proceed to Checkout</Link>

              {/* Guarantees */}
              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex items-center">
                  <Truck className="h-3 w-3 mr-2" />
                  Free shipping on orders over $50
                </div>
                <div className="flex items-center">
                  <Shield className="h-3 w-3 mr-2" />
                  Secure payment guaranteed
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-2" />
                  30-day returns
                </div>
              </div>
            </div>

            {/* Upsell */}
            <div className="surface-card p-6">
              <h3 className="text-lg font-bold mb-4">Frequently Bought Together</h3>
              <div className="space-y-2">
                {cart.slice(0, 2).map((rec) => (
                  <Link key={rec.productId} to={`/products/${rec.productId}`} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <SmartImage seed={rec.productId || rec.name} src={rec.image} alt={rec.name} className="w-10 h-10 object-cover rounded" />
                    <div>
                      <p className="text-sm font-medium">{rec.name}</p>
                      <p className="text-xs text-gray-500">${rec.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart