import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { Package, Heart, User, Edit, Award, ShoppingBag, CreditCard, Settings, LogOut, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import Input from '../components/ui/Input' // Added missing import

const Dashboard = () => {
  const { user, logout } = useAuth()
  const { wishlist } = useCart()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' })

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token')
      fetch('/api/orders', { 
        headers: { Authorization: `Bearer ${token}` } 
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch orders')
          return res.json()
        })
        .then(setOrders)
        .catch(err => {
          console.error('Orders fetch error:', err)
          setError('Failed to load orders. Please try again.')
        })
        .finally(() => setLoading(false))
    }
  }, [user])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    if (profileData.name.trim() === '' || profileData.email.trim() === '') {
      setError('Name and email are required')
      return
    }
    const token = localStorage.getItem('token')
    setProfileLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(profileData)
      })
      if (res.ok) {
        const data = await res.json()
        setProfileData({
          name: data.user?.name || profileData.name,
          email: data.user?.email || profileData.email
        })
        setSuccess('Profile updated successfully!')
        setEditMode(false)
        // Optionally refresh user from auth context if needed
      } else {
        throw new Error('Update failed')
      }
    } catch (err) {
      setError('Update failed. Please try again.')
      console.error('Profile update error:', err)
    } finally {
      setProfileLoading(false)
    }
  }

  const toggleEditMode = () => {
    setEditMode(!editMode)
    setError('')
    setSuccess('')
    if (!editMode) {
      setProfileData({ name: user?.name || '', email: user?.email || '' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-slate-300 mb-4">Please log in to view your dashboard.</p>
          <Link to="/login" className="btn-primary px-6 py-2">Go to Login</Link>
        </div>
      </div>
    )
  }

  const wishlistCount = wishlist.length

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="mb-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
            Welcome Back, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-slate-300 text-lg">Manage your account, track orders, and discover personalized recommendations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 surface-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <User className="h-5 w-5 mr-2 text-primary-600" />
                Your Profile
              </h2>
              <Button 
                type="button" 
                onClick={toggleEditMode} 
                variant={editMode ? "outline" : "default"}
                size="sm"
                className={`px-4 py-1 ${editMode ? 'text-slate-600 dark:text-slate-300' : 'text-primary-600'}`}
                disabled={profileLoading}
              >
                <Edit className="h-4 w-4 mr-1" />
                {editMode ? 'Cancel' : 'Edit'}
              </Button>
            </div>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <Input 
                placeholder="Full Name" 
                value={profileData.name} 
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!editMode || profileLoading}
                className="bg-gray-50 focus:bg-white"
              />
              <Input 
                type="email" 
                placeholder="Email Address" 
                value={profileData.email} 
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!editMode || profileLoading}
                className="bg-gray-50 focus:bg-white"
              />
              {editMode && (
                <Button 
                  type="submit" 
                  disabled={profileLoading || !profileData.name.trim() || !profileData.email.trim()} 
                  className="w-full btn-primary shadow-md hover:shadow-lg transition-all"
                >
                  {profileLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              )}
            </form>
            {error && (
              <div className="mt-4 flex items-center text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 flex items-center text-green-600 text-sm p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                {success}
              </div>
            )}
          </div>

          {/* Stats Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/orders" className="group">
              <div className="surface-card p-6 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                <Package className="h-12 w-12 text-primary-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{orders.length}</h3>
                <p className="text-gray-600 dark:text-slate-300 mb-2">Total Orders</p>
                <span className="text-primary-600 text-sm font-medium">View Orders →</span>
              </div>
            </Link>
            <Link to="/wishlist" className="group">
              <div className="surface-card p-6 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{wishlistCount}</h3>
                <p className="text-gray-600 dark:text-slate-300 mb-2">Wishlist Items</p>
                <span className="text-red-500 text-sm font-medium">View Wishlist →</span>
              </div>
            </Link>
            <div className="surface-card p-6 text-center">
              <Award className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 mb-1">VIP</h3>
              <p className="text-gray-600 dark:text-slate-300 mb-2">Member Level</p>
              <span className="text-yellow-500 text-sm font-medium">Upgrade →</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/products" className="group">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-slate-700" />
              <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-slate-100">Continue Shopping</h3>
              <p className="text-slate-600 dark:text-slate-300">Browse new arrivals and deals</p>
            </div>
          </Link>
          <Link to="/orders" className="group">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <CreditCard className="mx-auto mb-3 h-12 w-12 text-slate-700" />
              <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-slate-100">Track Orders</h3>
              <p className="text-slate-600 dark:text-slate-300">View status and history</p>
            </div>
          </Link>
          <Link to="/services" className="group">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <Settings className="mx-auto mb-3 h-12 w-12 text-slate-700" />
              <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-slate-100">Account Settings</h3>
              <p className="text-slate-600 dark:text-slate-300">Manage preferences and support</p>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="surface-card overflow-hidden">
          <div className="border-b bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/70">
            <h3 className="text-xl font-bold flex items-center">
              <Package className="h-5 w-5 mr-2 text-primary-600" />
              Recent Orders
            </h3>
          </div>
          {orders.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {orders.slice(0, 5).map(order => (
                <Link 
                  key={order._id} 
                  to="/orders"
                  className="p-6 hover:bg-gray-50 block transition-colors duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-slate-100">Order #{order._id.slice(-6)}</p>
                      <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">Total: ${order.totalPrice?.toFixed(2) || '0.00'}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'short', day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.isDelivered 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.isDelivered ? 'Delivered' : 'Pending'}
                    </span>
                  </div>
                </Link>
              ))}
              <div className="p-6 text-center">
                <Link to="/orders" className="text-primary-600 hover:underline font-medium">View All Orders →</Link>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500 dark:text-slate-300">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
              <p className="mb-4">Start shopping to see your order history here!</p>
              <Link to="/products" className="btn-primary inline-flex items-center px-6 py-3">
                Start Shopping
              </Link>
            </div>
          )}
        </div>

        {/* Logout Section */}
        <div className="text-center mt-8 pt-8 border-t border-gray-200 dark:border-slate-700">
          <Button 
            onClick={logout} 
            variant="outline" 
            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 px-8 py-3 font-medium"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard