import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './useAuth' // Import for token and user

const CartContext = createContext(null)
const AUTH_REQUIRED_MESSAGE = 'Please log in to continue.'

const normalizeCartItems = (items = []) => {
  return items.map((item) => {
    const product = item.product || {}
    return {
      _id: item._id,
      productId: product._id || item.productId || item.product,
      name: product.name || item.name,
      image: product.image || item.image,
      description: product.description || item.description,
      category: product.category || item.category,
      countInStock: product.countInStock,
      price: item.price ?? product.price ?? 0,
      quantity: item.quantity,
      subtotal: item.subtotal ?? (item.price ?? product.price ?? 0) * item.quantity
    }
  })
}

const normalizeWishlistItems = (items = []) => {
  return items
    .map((item) => {
      if (typeof item === 'string') return { _id: item }
      const product = item.product || item
      if (!product || !product._id) return null
      return {
        ...product,
        wishlistItemId: item._id || undefined
      }
    })
    .filter(Boolean)
}

const useProvideCart = () => {
  const { user, loading: authLoading } = useAuth()
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Get token from localStorage
  const getToken = () => localStorage.getItem('token')

  // Helper: API call wrapper
  const apiCall = useCallback(async (url, options = {}) => {
    const token = getToken()
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...options
    }

    try {
      const res = await fetch(url, config)
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(payload.msg || `API Error: ${res.status} ${res.statusText}`)
      }
      return payload
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const ensureAuthenticated = useCallback(() => {
    if (!user) {
      const err = new Error(AUTH_REQUIRED_MESSAGE)
      setError(err.message)
      throw err
    }
  }, [user])

  // Initialize and re-sync cart/wishlist when auth state changes.
  useEffect(() => {
    const initCart = async () => {
      if (authLoading) return
      setLoading(true)
      setError('')

      try {
        if (!user) {
          localStorage.removeItem('cart')
          localStorage.removeItem('wishlist')
          setCart([])
          setWishlist([])
          return
        }

        // Fetch from API for authenticated user
        const [cartRes, wishlistRes] = await Promise.all([
          apiCall('/api/cart'), // GET /api/cart
          apiCall('/api/wishlist') // GET /api/wishlist (assume endpoint)
        ])
        setCart(normalizeCartItems(cartRes.items || []))
        setWishlist(normalizeWishlistItems(wishlistRes.items || []))
      } catch (err) {
        console.error('Init error:', err)
        setCart([])
        setWishlist([])
      } finally {
        setLoading(false)
      }
    }

    initCart()
  }, [user, authLoading, apiCall])

  // Add to Cart (API call)
  const addToCart = useCallback(async (product, quantity = 1) => {
    if (!product || loading) return
    setLoading(true)
    setError('')

    try {
      ensureAuthenticated()

      // Authenticated: API call
      const res = await apiCall('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ productId: product._id || product.id, quantity })
      })
      setCart(normalizeCartItems(res.items || []))
    } catch (err) {
      console.error('Add to cart error:', err)
    } finally {
      setLoading(false)
    }
  }, [loading, apiCall, ensureAuthenticated])

  // Remove from Cart (API call)
  const removeFromCart = useCallback(async (productId) => {
    if (loading) return
    setLoading(true)
    setError('')

    try {
      ensureAuthenticated()

      // Find item ID in cart (for API DELETE /api/cart/:itemId)
      const currentCart = await apiCall('/api/cart')
      const normalized = normalizeCartItems(currentCart.items || [])
      const item = normalized.find(i => i.productId === productId || i._id === productId)
      if (!item) return

      await apiCall(`/api/cart/${item._id}`, { method: 'DELETE' })
      setCart(normalized.filter(i => i._id !== item._id))
    } catch (err) {
      console.error('Remove from cart error:', err)
    } finally {
      setLoading(false)
    }
  }, [loading, apiCall, ensureAuthenticated])

  // Update Quantity (API call)
  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }
    if (loading) return
    setLoading(true)
    setError('')

    try {
      ensureAuthenticated()

      // Find item ID
      const currentCart = await apiCall('/api/cart')
      const normalized = normalizeCartItems(currentCart.items || [])
      const item = normalized.find(i => i.productId === productId || i._id === productId)
      if (!item) return

      const res = await apiCall(`/api/cart/${item._id}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      })
      setCart(normalizeCartItems(res.items || []))
    } catch (err) {
      console.error('Update quantity error:', err)
    } finally {
      setLoading(false)
    }
  }, [loading, apiCall, removeFromCart, ensureAuthenticated])

  // Add to Wishlist (API call)
  const addToWishlist = useCallback(async (product) => {
    if (loading) return
    setLoading(true)
    setError('')

    try {
      ensureAuthenticated()

      // Authenticated: API call
      const res = await apiCall('/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({ productId: product._id || product.id })
      })
      setWishlist(normalizeWishlistItems(res.items || []))
    } catch (err) {
      console.error('Add to wishlist error:', err)
    } finally {
      setLoading(false)
    }
  }, [loading, apiCall, ensureAuthenticated])

  // Remove from Wishlist (API call)
  const removeFromWishlist = useCallback(async (productId) => {
    if (loading) return
    setLoading(true)
    setError('')

    try {
      ensureAuthenticated()

      const res = await apiCall(`/api/wishlist/${productId}`, { method: 'DELETE' })
      setWishlist(normalizeWishlistItems(res.items || []))
    } catch (err) {
      console.error('Remove from wishlist error:', err)
    } finally {
      setLoading(false)
    }
  }, [loading, apiCall, ensureAuthenticated])

  // Calculate total (from cart items with real prices)
  const getTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
  }, [cart])

  // Cart count
  const getCartCount = useCallback(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])

  // Clear cart (post-checkout)
  const clearCart = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      if (!user) {
        setCart([])
        localStorage.removeItem('cart')
        return
      }
      await apiCall('/api/cart/clear', { method: 'DELETE' })
      setCart([])
    } catch (err) {
      console.error('Clear cart error:', err)
    } finally {
      setLoading(false)
    }
  }, [user, loading, apiCall])

  return {
    cart, 
    wishlist, 
    addToCart, 
    addToWishlist, 
    removeFromCart, 
    removeFromWishlist, 
    updateQuantity, 
    getTotal, 
    getCartCount,
    clearCart,
    loading,
    error
  }
}

export const CartProvider = ({ children }) => {
  const value = useProvideCart()
  return React.createElement(CartContext.Provider, { value }, children)
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}