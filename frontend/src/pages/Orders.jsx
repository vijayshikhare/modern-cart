// src/pages/Orders.jsx - User's Order History Page
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Package, Clock, CheckCircle, XCircle, ShoppingCart, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { apiUrl } from '../utils/api'

const Orders = () => {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return
      const token = localStorage.getItem('token')
      setLoading(true)
      setError('')
      try {
        const res = await fetch(apiUrl('/api/orders'), {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setOrders(Array.isArray(data) ? data : [])
        } else {
          setError('Failed to fetch orders. Please try again.')
        }
      } catch (err) {
        setError('Network error. Please check your connection.')
        console.error('Orders fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-200'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-900/70">
          <div className="flex items-center space-x-3">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </Link>
            <div className="flex items-center">
              <Package className="h-6 w-6 text-primary-600 mr-2" />
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Your Orders</h1>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300">Total Orders: {orders.length}</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center text-red-600 text-sm p-4 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => window.location.reload()} 
              className="ml-auto text-red-600 hover:text-red-700"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        )}

        {/* Orders List */}
        {!loading && orders.length > 0 ? (
          <div className="surface-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-900/70">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900/60 dark:divide-slate-700">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                        {order.orderItems?.length || 0} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                        ${order.totalPrice?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.isDelivered ? 'delivered' : 'pending')}`}>
                          {order.isDelivered ? 'Delivered' : order.isCancelled ? 'Cancelled' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <span className="text-gray-500 flex items-center justify-end dark:text-slate-300">
                          {order.status || (order.isDelivered ? 'Delivered' : 'Pending')}
                          <ShoppingCart className="h-4 w-4 ml-1" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center dark:bg-slate-900/70 dark:border-slate-700">
              <Link 
                to="/products" 
                className="inline-flex items-center px-6 py-3 btn-primary font-medium"
              >
                Continue Shopping
                <ShoppingCart className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        ) : !loading && (
          <div className="surface-card py-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-slate-100">No Orders Yet</h3>
            <p className="mb-6 text-gray-600 dark:text-slate-300">Your order history is empty. Start shopping to see your purchases here!</p>
            <Link 
              to="/products" 
              className="inline-flex items-center px-6 py-3 btn-primary font-medium"
            >
              Start Shopping
              <ShoppingCart className="h-4 w-4 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders