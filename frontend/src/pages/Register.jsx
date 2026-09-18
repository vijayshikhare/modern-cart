// src/pages/Register.jsx - Fixed: No changes needed here, but ensuring consistency
import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { apiUrl } from '../utils/api'

const Register = () => {
  const { login, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard'
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Full name is required')
      return false
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setFormLoading(true)
    
    try {
      const res = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })
      const data = await res.json()
      
      if (res.ok) {
        login(data)
        setSuccess('Account created successfully! Welcome to ProShop.')
        setTimeout(() => {
          navigate(redirectPath, { replace: true })
        }, 1500)
      } else {
        setError(data.msg || 'Registration failed. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
      console.error('Registration error:', err)
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
          <h2 className="text-3xl font-bold text-gray-900">Join ProShop Today</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to unlock personalized recommendations, order tracking, and exclusive deals.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-200" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input 
              icon={<User className="h-4 w-4 text-gray-400" />}
              placeholder="Full Name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              required 
              disabled={formLoading}
              autoComplete="name"
            />
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
              placeholder="Password (min 6 characters)" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange} 
              required 
              disabled={formLoading}
              autoComplete="new-password"
              minLength={6}
              className="pr-10"
            />
            <Input 
              type={showConfirmPassword ? "text" : "password"} 
              icon={
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={formLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              }
              placeholder="Confirm Password" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleInputChange} 
              required 
              disabled={formLoading}
              autoComplete="new-password"
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

          <Button type="submit" disabled={formLoading} className="w-full btn-primary shadow-lg hover:shadow-xl transition-all">
            {formLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Your Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
          </p>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to={`/login?redirect=${encodeURIComponent(redirectPath)}`} className="font-medium text-primary-600 hover:text-primary-700">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register