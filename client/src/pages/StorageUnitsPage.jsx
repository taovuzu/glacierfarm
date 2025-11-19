import { useState, useEffect } from 'react'

export default function StorageUnitsPage() {
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStorageUnits()
  }, [])

  const fetchStorageUnits = async () => {
    try {
      setLoading(true)
      const response = await fetch(process.env.VITE_API_URL + '/storage-units')
      if (response.ok) {
        const data = await response.json()
        setUnits(data)
      } else {
        setUnits([
          {
            id: 1,
            name: 'Storage Unit A',
            capacity: '1000 kg',
            used: '750 kg',
            temperature: '-2°C',
            status: 'Active'
          },
          {
            id: 2,
            name: 'Storage Unit B',
            capacity: '500 kg',
            used: '200 kg',
            temperature: '-1°C',
            status: 'Active'
          },
          {
            id: 3,
            name: 'Storage Unit C',
            capacity: '1500 kg',
            used: '1500 kg',
            temperature: '0°C',
            status: 'Full'
          }
        ])
      }
    } catch (err) {
      console.error('Error fetching storage units:', err)
      setError('Failed to load storage units')
      setUnits([
        {
          id: 1,
          name: 'Storage Unit A',
          capacity: '1000 kg',
          used: '750 kg',
          temperature: '-2°C',
          status: 'Active'
        },
        {
          id: 2,
          name: 'Storage Unit B',
          capacity: '500 kg',
          used: '200 kg',
          temperature: '-1°C',
          status: 'Active'
        },
        {
          id: 3,
          name: 'Storage Unit C',
          capacity: '1500 kg',
          used: '1500 kg',
          temperature: '0°C',
          status: 'Full'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Storage Units</h1>

        {error && (
          <div className="mb-6 p-4 bg-yellow-900 border border-yellow-600 rounded-lg text-yellow-100">
            {error} (Showing demo data)
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="text-gray-300 mt-4">Loading storage units...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((unit) => {
              const used = parseInt(unit.used)
              const total = parseInt(unit.capacity)
              const percentage = (used / total) * 100

              return (
                <div
                  key={unit.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 hover:shadow-2xl transition duration-300 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">{unit.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      unit.status === 'Active'
                        ? 'bg-green-900 text-green-200'
                        : 'bg-red-900 text-red-200'
                    }`}>
                      {unit.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Capacity</span>
                        <span className="text-white font-semibold">{unit.capacity}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {unit.used} / {unit.capacity}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-700 rounded p-3">
                        <div className="text-gray-400 text-sm">Temperature</div>
                        <div className="text-blue-400 font-bold text-lg">{unit.temperature}</div>
                      </div>
                      <div className="bg-gray-700 rounded p-3">
                        <div className="text-gray-400 text-sm">Usage</div>
                        <div className="text-blue-400 font-bold text-lg">{Math.round(percentage)}%</div>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200">
                    Manage Unit
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
