import { ShoppingCart, Star, Eye } from 'lucide-react'
import { Link } from 'react-router'
import { formatINR } from '../utils/currency'

interface Product {
  id: number; name: string; price: number; image_url: string
  category: string; rating: number; reviews_count: number; stock: number
}

export default function ProductCard({ product: p, onAddToCart }: { product: Product; onAddToCart: (id: number) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col group">
      <div className="relative overflow-hidden">
        <Link to={`/products/${p.id}`}>
          <img
            src={p.image_url || 'https://placehold.co/400x300?text=No+Image'}
            alt={p.name}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {p.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-red-500 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        {p.stock > 0 && p.stock <= 5 && (
          <span className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">
            Only {p.stock} left
          </span>
        )}
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {p.category}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/products/${p.id}`}
          className="font-semibold text-gray-800 hover:text-indigo-600 transition line-clamp-2 leading-snug flex-1 mb-2">
          {p.name}
        </Link>

        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={12}
                className={i <= Math.round(p.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
            ))}
          </div>
          <span className="text-xs text-gray-400">{p.rating} ({p.reviews_count})</span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-gray-900">{formatINR(p.price)}</span>
          <div className="flex items-center gap-1.5">
            <Link to={`/products/${p.id}`}
              className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:text-indigo-600 hover:border-indigo-300 transition"
              title="View details">
              <Eye size={15} />
            </Link>
            <button
              onClick={() => onAddToCart(p.id)}
              disabled={p.stock === 0}
              className="flex items-center gap-1.5 bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
            >
              <ShoppingCart size={14} /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
