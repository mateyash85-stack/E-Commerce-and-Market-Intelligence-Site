import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getProducts } from '../api/client'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { ShoppingBag, TrendingUp, Shield, Truck, Star, ArrowRight } from 'lucide-react'

const CATEGORIES = [
  { name: 'Electronics', emoji: '💻', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
  { name: 'Sports', emoji: '⚽', color: 'bg-green-50 text-green-600 hover:bg-green-100' },
  { name: 'Fashion', emoji: '👗', color: 'bg-pink-50 text-pink-600 hover:bg-pink-100' },
  { name: 'Home', emoji: '🏠', color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
]

const FEATURES = [
  { icon: Truck, title: 'Free Shipping', desc: 'On all orders above ₹499' },
  { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions' },
  { icon: TrendingUp, title: 'Market Intelligence', desc: 'Real-time price tracking' },
  { icon: Star, title: 'Top Rated', desc: 'Curated quality products' },
]

export default function Home({ onAddToCart }: { onAddToCart: (id: number) => void }) {
  const [featured, setFeatured] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts({ limit: 8 })
      .then(r => setFeatured(r.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <TrendingUp size={14} /> Market Intelligence Shopping
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight">
            Shop Smart.<br />
            <span className="text-indigo-200">Sell Smarter.</span>
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Discover products with real-time market data, price intelligence, and curated recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/products"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-8 py-3.5 rounded-full hover:bg-indigo-50 transition shadow-lg shadow-indigo-900/20">
              <ShoppingBag size={18} /> Browse Products
            </Link>
            <Link to="/auth"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/20 transition backdrop-blur-sm">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-14 pt-10 border-t border-white/20">
            {[['500+', 'Products'], ['10K+', 'Customers'], ['4.8★', 'Rating'], ['99%', 'Satisfaction']].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-2xl font-black text-white">{v}</p>
                <p className="text-indigo-200 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category shortcuts */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-3 justify-center">
          {CATEGORIES.map(c => (
            <Link
              key={c.name}
              to={`/products?category=${c.name}`}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition border ${c.color} border-transparent`}
            >
              <span>{c.emoji}</span> {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <f.icon size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{f.title}</p>
                  <p className="text-gray-400 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 text-sm mt-1">Hand-picked top sellers</p>
          </div>
          <Link to="/products"
            className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">
            View all <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 mx-4 mb-14 rounded-2xl overflow-hidden">
        <div className="max-w-4xl mx-auto px-8 py-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to shop smarter?</h2>
          <p className="text-indigo-100 mb-6">Join thousands of customers saving with our market intelligence platform.</p>
          <Link to="/auth"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-7 py-3 rounded-full hover:bg-indigo-50 transition">
            Create Free Account <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <ShoppingBag size={14} className="text-white" />
              </div>
              <span className="font-bold text-indigo-600">ShopIQ</span>
            </div>
            <p className="text-xs text-gray-400">© 2025 ShopIQ. E-Commerce & Market Intelligence Platform.</p>
            <div className="flex gap-4 text-xs text-gray-400">
              <Link to="/products" className="hover:text-indigo-600 transition">Products</Link>
              <Link to="/auth" className="hover:text-indigo-600 transition">Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
