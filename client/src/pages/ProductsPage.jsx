import { useState, useEffect } from 'react'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(process.env.VITE_API_URL + '/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        setProducts([
          {
            id: 1,
            name: 'Tomatoes',
            quantity: 500,
            unit: 'kg',
            status: 'Fresh',
            temperature: '-2°C'
          },
          {
            id: 2,
            name: 'Carrots',
            quantity: 300,
            unit: 'kg',
            status: 'Fresh',
            temperature: '-1°C'
          },
          {
            id: 3,
            name: 'Potatoes',
            quantity: 1000,
            unit: 'kg',
            status: 'Stored',
            temperature: '0°C'
          }
        ])
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products')
      // Set demo data
      setProducts([
        {
          id: 1,
          name: 'Tomatoes',
          quantity: 500,
          unit: 'kg',
          status: 'Fresh',
          temperature: '-2°C'
        },
        {
          id: 2,
          name: 'Carrots',
          quantity: 300,
          unit: 'kg',
          status: 'Fresh',
          temperature: '-1°C'
        },
        {
          id: 3,
          name: 'Potatoes',
          quantity: 1000,
          unit: 'kg',
          status: 'Stored',
          temperature: '0°C'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Products</h1>

        {error && (
          <div className="mb-6 p-4 bg-yellow-900 border border-yellow-600 rounded-lg text-yellow-100">
            {error} (Showing demo data)
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="text-gray-300 mt-4">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 hover:shadow-2xl transition duration-300 transform hover:scale-105 border border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">{product.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    product.status === 'Fresh' 
                      ? 'bg-green-900 text-green-200' 
                      : 'bg-blue-900 text-blue-200'
                  }`}>
                    {product.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Quantity:</span>
                    <span className="text-white font-semibold">{product.quantity} {product.unit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Temperature:</span>
                    <span className="text-blue-400 font-semibold">{product.temperature}</span>
                  </div>
                </div>

                <button className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
