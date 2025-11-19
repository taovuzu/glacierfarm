import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const redirectPage = searchParams.get('page') || 'Your Account'
  const redirectPath = searchParams.get('redirect') || '/dashboard'

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(process.env.VITE_API_URL + '/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        navigate(redirectPath)
      } else {
        setErrors({ submit: 'Invalid email or password' })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ submit: 'Failed to login. Using demo mode.' })
      // Demo mode - allow login with any credentials
      localStorage.setItem('user', JSON.stringify({
        id: 'demo-user',
        email: formData.email,
        farmName: 'Demo Farm'
      }))
      localStorage.setItem('token', 'demo-token')
      navigate(redirectPath)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-4xl">❄️</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">GlacierFarm</h1>
          <p className="text-gray-400">Farm Cold Storage Solutions</p>
        </div>

        {/* Access Required Alert */}
        {redirectPage && redirectPage !== 'Your Account' && (
          <div className="mb-6 p-4 bg-blue-900 border border-blue-600 rounded-lg">
            <p className="text-blue-200 text-sm">
              <strong className="block mb-1">📋 Access Required</strong>
              You need to login to view <strong>{redirectPage}</strong> and manage your farm data.
            </p>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-2">Farmer Login</h2>
          <p className="text-gray-400 text-sm mb-6">Login to access your farm data and dashboard</p>

          {errors.submit && (
            <div className="mb-4 p-3 bg-yellow-900 border border-yellow-600 rounded text-yellow-200 text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@farm.com"
                className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-600 focus:ring-blue-500'
                }`}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-gray-300 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login to Access Your Data'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">New farmer?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            to="/signup"
            className="block w-full py-2 px-4 border border-gray-600 hover:border-blue-500 text-gray-300 hover:text-white font-bold rounded-lg transition text-center"
          >
            Create Account
          </Link>
        </div>

        {/* Demo Login Info */}
        <div className="mt-6 p-4 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg">
          <p className="text-sm text-blue-300">
            <strong>Demo:</strong> Use any email and password (min 6 chars) to test
          </p>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-white text-sm transition">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
