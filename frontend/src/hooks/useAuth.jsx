import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Function to fetch and validate user from token
  const fetchUser = async (token) => {
    try {
      const res = await fetch('/api/auth/profile', { // Fixed: Match backend route /api/auth/profile
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        return data.user // Assuming response has { user: {...} }
      }
      throw new Error('Invalid token')
    } catch (err) {
      console.error('Auth fetch error:', err)
      return null
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        const userData = await fetchUser(token)
        if (userData) {
          setUser(userData)
        } else {
          // Invalid/expired token - clean up
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = (userData) => {
    if (userData.token) {
      localStorage.setItem('token', userData.token)
    }
    if (userData.user) {
      setUser(userData.user)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('cart')
    localStorage.removeItem('wishlist')
    setUser(null)
  }

  const value = { user, login, logout, loading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}