import { ShoppingCart, Star } from 'lucide-react'
import { Link } from 'react-router'

interface Product {
  id: number; name: string; price: number; image_url: string
  category: string; rating: number; reviews_count: number; stock: number
}

export default function ProductCard({ product: p, onAddToCart }: { product: Product; onAddToCart: (id: number) => void }) {
  return (
    <div className="bg-white rounded-xl border hover:shadow-md transition overflow-hidden flex flex-col">
      <Link to={`/products/${p.id}`}>
        <img src={p.image_url || 'https://placehold.co/400x300?text=No+Image'} alt={p.name} className="w-full h-48 object-cover" />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-indigo-500 font-medium uppercase mb-1">{p.category}</span>
        <Link to={`/products/${p.id}`} className="font-semibold text-gray-800 hover:text-indigo-600 line-clamp-2 flex-1">{p.name}</Link>
        <div className="flex items-center gap-1 mt-1 text-yellow-400 text-sm">
          <Star size={13} fill="currentColor" /> <span className="text-gray-500">{p.rating} ({p.reviews_count})</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">₹{p.price.toFixed(2)}</span>
          <button
            onClick={() => onAddToCart(p.id)}
            disabled={p.stock === 0}
            className="flex items-center gap-1 bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={14} /> Add
          </button>
        </div>
        {p.stock === 0 && <span className="text-xs text-red-500 mt-1">Out of stock</span>}
      </div>
    </div>
  )
}
