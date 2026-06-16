import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { getProducts, getCategories } from '../api/client'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Search, SlidersHorizontal, X } from 'lucide-react'

export default function Products({ onAddToCart }: { onAddToCart: (id: number) => void }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [loading, setLoading] = useState(true)

  const fetchProducts = (s = search, c = category) => {
    setLoading(true)
    getProducts({ search: s || undefined, category: c || undefined, limit: 100 })
      .then(r => setProducts(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { getCategories().then(r => setCategories(r.data)) }, [])

  useEffect(() => {
    const c = searchParams.get('category') || ''
    setCategory(c)
    fetchProducts(search, c)
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchParams(prev => {
      if (search) prev.set('search', search); else prev.delete('search')
      return prev
    })
    fetchProducts()
  }

  const handleCategory = (c: string) => {
    setCategory(c)
    setSearchParams(prev => {
      if (c) prev.set('category', c); else prev.delete('category')
      return prev
    })
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setSearchParams({})
    fetchProducts('', '')
  }

  const hasFilters = search || category

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        {hasFilters && (
          <button onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition">
            <X size={14} /> Clear filters
          </button>
        )}
      </div>

      {/* Search + filters */}
      <div className="bg-white border rounded-2xl p-4 mb-8 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
          </div>
          <button type="submit"
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
            <Search size={15} /> Search
          </button>
        </form>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-400 mr-1">
            <SlidersHorizontal size={12} /> Filter:
          </div>
          <button
            onClick={() => handleCategory('')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition border ${
              !category ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => handleCategory(c)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition border ${
                category === c ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner text="Loading products..." />
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="text-indigo-600 text-sm font-medium hover:underline">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  )
}
