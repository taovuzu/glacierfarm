import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function ProtectedRoute({ children, pageName = 'This page' }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(window.location.pathname)}&page=${encodeURIComponent(pageName)}`} replace />
  }

  return children
}
