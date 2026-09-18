// src/pages/Login.jsx - Fixed: Replaced problematic Button with proper Link
import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { apiUrl } from '../utils/api'

const Login = () => {
  const { login, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard'
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const validateForm = () => {
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (!formData.password.trim()) {
      setError('Password is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setFormLoading(true)
    
    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        })
      })
      const data = await res.json()
      
      if (res.ok) {
        login(data)
        setSuccess('Welcome back! Redirecting...')
        setTimeout(() => {
          navigate(redirectPath, { replace: true })
        }, 1500)
      } else {
        setError(data.msg || 'Invalid email or password. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
      console.error('Login error:', err)
    } finally {
      setFormLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your orders, wishlist, and personalized shopping experience.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-200" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input 
              type="email" 
              icon={<Mail className="h-4 w-4 text-gray-400" />}
              placeholder="Email Address" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              required 
              disabled={formLoading}
              autoComplete="email"
            />
            
            <Input 
              type={showPassword ? "text" : "password"} 
              icon={
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={formLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              }
              placeholder="Password" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange} 
              required 
              disabled={formLoading}
              autoComplete="current-password"
              className="pr-10"
            />
          </div>

          {error && (
            <div role="alert" className="flex items-center text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div role="alert" className="flex items-center text-green-600 text-sm p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Link 
              to="/contact"
              className="text-primary-600 hover:text-primary-700 text-sm hover:underline"
              disabled={formLoading}
            >
              Forgot Password?
            </Link>
            <Button type="submit" disabled={formLoading} className="btn-primary shadow-lg hover:shadow-xl transition-all">
              {formLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing You In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            New to ProShop?{' '}
            <Link to={`/register?redirect=${encodeURIComponent(redirectPath)}`} className="font-medium text-primary-600 hover:text-primary-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login