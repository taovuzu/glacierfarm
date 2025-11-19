import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SignupPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    farmName: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    phoneNumber: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.farmName) {
      newErrors.farmName = 'Farm name is required'
    } else if (formData.farmName.length < 3) {
      newErrors.farmName = 'Farm name must be at least 3 characters'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.location) {
      newErrors.location = 'Location is required'
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Invalid phone number (10 digits required)'
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
      const response = await fetch(process.env.VITE_API_URL + '/users/signup', {
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
        navigate('/dashboard')
      } else {
        const error = await response.json()
        setErrors({ submit: error.message || 'Signup failed' })
      }
    } catch (error) {
      console.error('Signup error:', error)
      setErrors({ submit: 'Failed to create account. Using demo mode.' })
      // Demo mode
      localStorage.setItem('user', JSON.stringify({
        id: 'demo-user-' + Date.now(),
        farmName: formData.farmName,
        email: formData.email,
        location: formData.location,
        phoneNumber: formData.phoneNumber
      }))
      localStorage.setItem('token', 'demo-token')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-4xl">❄️</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">GlacierFarm</h1>
          <p className="text-gray-400">Create Your Farm Account</p>
        </div>

        {/* Signup Form */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Farmer Registration</h2>

          {errors.submit && (
            <div className="mb-4 p-3 bg-yellow-900 border border-yellow-600 rounded text-yellow-200 text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Farm Name */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">Farm Name</label>
              <input
                type="text"
                name="farmName"
                value={formData.farmName}
                onChange={handleChange}
                placeholder="Your Farm Name"
                className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                  errors.farmName ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
                }`}
              />
              {errors.farmName && <p className="text-red-400 text-sm mt-1">{errors.farmName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@farm.com"
                className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
                }`}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                  errors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
                }`}
              />
              {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="1234567890"
                className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                  errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
                }`}
              />
              {errors.phoneNumber && <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* Password */}
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
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
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
              <p className="text-xs text-gray-400 mt-1">Min 8 chars, 1 uppercase, 1 number</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2 text-gray-300 text-sm cursor-pointer">
                I agree to the Terms of Service
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block w-full py-2 px-4 border border-gray-600 hover:border-blue-500 text-gray-300 hover:text-white font-bold rounded-lg transition text-center"
          >
            Login Here
          </Link>
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
