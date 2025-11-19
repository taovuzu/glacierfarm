import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    productsStored: 0,
    activeOrders: 0,
    storageUnits: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
    setLoading(false)

    // Simulate fetching dashboard data
    setStats({
      productsStored: 12450,
      activeOrders: 8,
      storageUnits: 3,
      totalRevenue: 125000
    })
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 border-b border-blue-700 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.farmName}</h1>
              <p className="text-blue-200 text-sm">{user?.location || 'Farm Location'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-white font-semibold">{user?.email}</p>
                <p className="text-blue-200 text-sm">{user?.phoneNumber || 'Phone'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.farmName?.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-400">Here's what's happening with your cold storage today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="📦"
            title="Products Stored"
            value={stats.productsStored}
            unit="kg"
            color="from-green-900 to-green-800"
          />
          <StatCard
            icon="🚚"
            title="Active Orders"
            value={stats.activeOrders}
            unit="orders"
            color="from-blue-900 to-blue-800"
          />
          <StatCard
            icon="❄️"
            title="Storage Units"
            value={stats.storageUnits}
            unit="units"
            color="from-cyan-900 to-cyan-800"
          />
          <StatCard
            icon="💰"
            title="Total Revenue"
            value={`₹${(stats.totalRevenue / 1000).toFixed(0)}k`}
            unit="this month"
            color="from-yellow-900 to-yellow-800"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/products"
                className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-center"
              >
                Add New Product
              </Link>
              <Link
                to="/orders"
                className="block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition text-center"
              >
                Create Order
              </Link>
              <Link
                to="/storage-units"
                className="block px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition text-center"
              >
                Manage Storage
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <ActivityItem icon="✅" text="Order #1234 Completed" time="2 hours ago" />
              <ActivityItem icon="📦" text="Product: Tomatoes added" time="5 hours ago" />
              <ActivityItem icon="❄️" text="Storage Unit A refilled" time="1 day ago" />
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left text-gray-300 font-semibold pb-3">Order ID</th>
                  <th className="text-left text-gray-300 font-semibold pb-3">Product</th>
                  <th className="text-left text-gray-300 font-semibold pb-3">Quantity</th>
                  <th className="text-left text-gray-300 font-semibold pb-3">Status</th>
                  <th className="text-left text-gray-300 font-semibold pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                <OrderRow id="ORD001" product="Tomatoes" qty="500 kg" status="Completed" date="Nov 15" />
                <OrderRow id="ORD002" product="Carrots" qty="300 kg" status="In Transit" date="Nov 16" />
                <OrderRow id="ORD003" product="Potatoes" qty="1000 kg" status="Pending" date="Nov 17" />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, unit, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-lg p-6 text-white shadow-lg border border-gray-700`}>
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-gray-200 text-sm font-medium mb-2">{title}</h3>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <p className="text-gray-300 text-xs">{unit}</p>
    </div>
  )
}

function ActivityItem({ icon, text, time }) {
  return (
    <div className="flex items-start space-x-3">
      <span className="text-xl">{icon}</span>
      <div className="flex-1">
        <p className="text-white font-semibold">{text}</p>
        <p className="text-gray-400 text-xs">{time}</p>
      </div>
    </div>
  )
}

function OrderRow({ id, product, qty, status, date }) {
  const statusColor = {
    'Completed': 'bg-green-900 text-green-200',
    'In Transit': 'bg-blue-900 text-blue-200',
    'Pending': 'bg-yellow-900 text-yellow-200'
  }
  
  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700 transition">
      <td className="py-3 text-white">{id}</td>
      <td className="py-3 text-white">{product}</td>
      <td className="py-3 text-gray-300">{qty}</td>
      <td className="py-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor[status]}`}>
          {status}
        </span>
      </td>
      <td className="py-3 text-gray-300">{date}</td>
    </tr>
  )
}
