import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition">
              <span className="text-blue-600 font-bold text-xl">❄️</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:inline">GlacierFarm</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1 items-center">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/orders">Orders</NavLink>
            <NavLink to="/storage-units">Storage Units</NavLink>

            {/* Auth Buttons */}
            <div className="ml-4 border-l border-blue-400 pl-4 flex items-center space-x-2">
              {user ? (
                <>
                  <span className="text-white text-sm">{user.farmName}</span>
                  <Link
                    to="/dashboard"
                    className="px-3 py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 text-white hover:bg-blue-700 font-medium rounded-lg transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
          >
            <svg
              className={`h-6 w-6 transition ${isOpen ? 'rotate-90' : ''}`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
            <MobileNavLink to="/products" onClick={() => setIsOpen(false)}>Products</MobileNavLink>
            <MobileNavLink to="/orders" onClick={() => setIsOpen(false)}>Orders</MobileNavLink>
            <MobileNavLink to="/storage-units" onClick={() => setIsOpen(false)}>Storage Units</MobileNavLink>

            <div className="border-t border-blue-600 pt-2 mt-2">
              {user ? (
                <>
                  <div className="px-3 py-2 text-white text-sm font-semibold mb-2">{user.farmName}</div>
                  <MobileNavLink to="/dashboard" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </MobileNavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-white hover:bg-blue-600 font-medium rounded-lg transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink to="/login" onClick={() => setIsOpen(false)}>Login</MobileNavLink>
                  <MobileNavLink to="/signup" onClick={() => setIsOpen(false)}>Sign Up</MobileNavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-200"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition duration-200"
    >
      {children}
    </Link>
  )
}
