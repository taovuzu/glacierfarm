import { useState, useEffect } from 'react'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(process.env.VITE_API_URL + '/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        setOrders([
          {
            id: 1,
            product: 'Tomatoes',
            quantity: 100,
            status: 'Completed',
            date: '2024-01-15',
            total: '₹5,000'
          },
          {
            id: 2,
            product: 'Carrots',
            quantity: 50,
            status: 'Pending',
            date: '2024-01-16',
            total: '₹1,500'
          },
          {
            id: 3,
            product: 'Potatoes',
            quantity: 200,
            status: 'Shipped',
            date: '2024-01-17',
            total: '₹4,000'
          }
        ])
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Failed to load orders')
      setOrders([
        {
          id: 1,
          product: 'Tomatoes',
          quantity: 100,
          status: 'Completed',
          date: '2024-01-15',
          total: '₹5,000'
        },
        {
          id: 2,
          product: 'Carrots',
          quantity: 50,
          status: 'Pending',
          date: '2024-01-16',
          total: '₹1,500'
        },
        {
          id: 3,
          product: 'Potatoes',
          quantity: 200,
          status: 'Shipped',
          date: '2024-01-17',
          total: '₹4,000'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-900 text-green-200'
      case 'Pending':
        return 'bg-yellow-900 text-yellow-200'
      case 'Shipped':
        return 'bg-blue-900 text-blue-200'
      default:
        return 'bg-gray-700 text-gray-200'
    }
  }

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Orders</h1>

        {error && (
          <div className="mb-6 p-4 bg-yellow-900 border border-yellow-600 rounded-lg text-yellow-100">
            {error} (Showing demo data)
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="text-gray-300 mt-4">Loading orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="inline-block w-full">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800 border-b border-gray-700">
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Product</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Quantity</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-800 transition">
                      <td className="px-6 py-4 text-white"># {order.id}</td>
                      <td className="px-6 py-4 text-white">{order.product}</td>
                      <td className="px-6 py-4 text-gray-300">{order.quantity} kg</td>
                      <td className="px-6 py-4 text-gray-300">{order.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-blue-400 font-bold">{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
