import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Thermometer, Activity, ShoppingCart, ShieldCheck, Zap, Globe } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/50 z-10" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"
          />
          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-emerald-400/10 rounded-full blur-xl"
              style={{
                width: (i * 37) % 300 + 50,
                height: (i * 23) % 300 + 50,
                left: `${(i * 17) % 100}%`,
                top: `${(i * 29) % 100}%`,
              }}
              animate={{
                y: [0, (i * 7) % 100 - 50],
                x: [0, (i * 11) % 100 - 50],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: (i * 3) % 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-semibold mb-6 backdrop-blur-sm">
              Enterprise Grade Cold Chain
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
              <span className="block text-white">Preserve Quality.</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Maximize Yield.
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-300 mb-10 leading-relaxed">
              The world's most advanced cold storage network. Solar-powered, AI-driven, and connected to a global marketplace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-colors"
                >
                  Start Free Trial <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/marketplace">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-lg backdrop-blur-sm hover:border-white/30 transition-colors"
                >
                  View Marketplace
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-30 -mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={<Globe className="w-8 h-8 text-sky-400" />} value="50+" label="Countries Served" delay={0.2} />
          <StatCard icon={<Zap className="w-8 h-8 text-yellow-400" />} value="100%" label="Solar Powered" delay={0.4} />
          <StatCard icon={<ShieldCheck className="w-8 h-8 text-emerald-400" />} value="0%" label="Food Waste" delay={0.6} />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-32 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-white mb-4"
            >
              Why GlacierFarm?
            </motion.h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              We combine cutting-edge hardware with intelligent software to give you complete control over your post-harvest supply chain.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Thermometer className="w-10 h-10 text-sky-500" />}
              title="Precision Cooling"
              description="Maintain exact temperatures for different crops with our AI-driven climate control system."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Activity className="w-10 h-10 text-purple-500" />}
              title="Real-time IoT Monitoring"
              description="Track humidity, temperature, and power levels from anywhere in the world via our dashboard."
              delay={0.4}
            />
            <FeatureCard 
              icon={<ShoppingCart className="w-10 h-10 text-emerald-500" />}
              title="Direct-to-Buyer Market"
              description="Bypass middlemen. List your fresh produce instantly on our integrated marketplace."
              delay={0.6}
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-600 to-indigo-600 shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative p-12 md:p-20 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to revolutionize your farm?</h2>
              <p className="text-sky-100 text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of modern farmers who are reducing waste and increasing profits with GlacierFarm.
              </p>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-white text-sky-600 rounded-xl font-bold text-lg shadow-xl hover:bg-sky-50 transition-colors"
                >
                  Start Your Free Trial
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl text-center"
  >
    <div className="flex justify-center mb-4 bg-white/10 w-16 h-16 rounded-full items-center mx-auto">
      {icon}
    </div>
    <div className="text-4xl font-bold text-white mb-1">{value}</div>
    <div className="text-sky-200 font-medium">{label}</div>
  </motion.div>
);

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -10 }}
    className="bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-700 hover:shadow-emerald-500/20 hover:border-emerald-500/30 transition-all duration-300"
  >
    <div className="bg-slate-900 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border border-slate-700">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-lg">{description}</p>
  </motion.div>
);

export default HomePage;
