import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getProducts } from '../api/client'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Home({ onAddToCart }: { onAddToCart: (id: number) => void }) {
  const [featured, setFeatured] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts({ limit: 4 })
      .then(r => setFeatured(r.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Smart. Sell Smarter.</h1>
        <p className="text-indigo-100 text-lg mb-8">Discover products with real-time market intelligence</p>
        <Link to="/products" className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full hover:bg-indigo-50 transition">
          Browse Products
        </Link>
      </div>

      {/* Featured */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
          </div>
        )}
        <div className="text-center mt-8">
          <Link to="/products" className="text-indigo-600 font-medium hover:underline">View all products →</Link>
        </div>
      </div>
    </div>
  )
}
