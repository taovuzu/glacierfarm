import { Link } from 'react-router-dom'

export default function HomePage() {
  const features = [
    {
      icon: '❄️',
      title: 'Cold Storage',
      description: 'Portable cold storage solutions for farmers'
    },
    {
      icon: '🚚',
      title: 'Easy Transport',
      description: 'Easy to transport and deploy anywhere'
    },
    {
      icon: '📊',
      title: 'Real-time Tracking',
      description: 'Monitor temperature and inventory in real-time'
    },
    {
      icon: '💰',
      title: 'Cost-Effective',
      description: 'Affordable solutions for all farm sizes'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Portable Cold Storage
            <span className="block text-blue-400">for Farmers</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Keep your produce fresh with our innovative cold storage solutions. 
            Designed for modern farmers who demand quality and reliability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition duration-200 transform hover:scale-105"
            >
              Explore Products
            </Link>
            <Link
              to="/orders"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition duration-200 transform hover:scale-105"
            >
              View Orders
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-slate-800 bg-opacity-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Why Choose GlacierFarm?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg hover:shadow-2xl transition duration-300 transform hover:scale-105"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-blue-900 rounded-lg">
              <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
              <p className="text-gray-300">Active Farmers</p>
            </div>
            <div className="p-8 bg-blue-900 rounded-lg">
              <div className="text-4xl font-bold text-blue-400 mb-2">1000+</div>
              <p className="text-gray-300">Products Stored</p>
            </div>
            <div className="p-8 bg-blue-900 rounded-lg">
              <div className="text-4xl font-bold text-blue-400 mb-2">99.9%</div>
              <p className="text-gray-300">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Farm?</h2>
          <p className="text-xl text-blue-100 mb-8">Join hundreds of farmers already benefiting from GlacierFarm</p>
          <Link
            to="/storage-units"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition duration-200"
          >
            View Storage Units
          </Link>
        </div>
      </section>
    </div>
  )
}
