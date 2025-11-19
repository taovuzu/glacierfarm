import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './context/ProtectedRoute'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import OrdersPage from './pages/OrdersPage'
import StorageUnitsPage from './pages/StorageUnitsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute pageName="Dashboard">
                  <Navbar />
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                      path="/products"
                      element={
                        <ProtectedRoute pageName="Products & Inventory">
                          <ProductsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute pageName="Orders Management">
                          <OrdersPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/storage-units"
                      element={
                        <ProtectedRoute pageName="Storage Units">
                          <StorageUnitsPage />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
