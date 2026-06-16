import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getProduct } from '../api/client'
import { ShoppingCart, Star, ArrowLeft } from 'lucide-react'

export default function ProductDetail({ onAddToCart }: { onAddToCart: (id: number) => void }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    getProduct(Number(id)).then(r => setProduct(r.data)).catch(() => navigate('/products'))
  }, [id])

  if (!product) return <div className="text-center py-20 text-gray-400">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 mb-6">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="grid md:grid-cols-2 gap-8">
        <img src={product.image_url || 'https://placehold.co/600x400'} alt={product.name} className="w-full rounded-xl object-cover" />
        <div>
          <span className="text-sm text-indigo-500 font-medium uppercase">{product.category}</span>
          <h1 className="text-3xl font-bold mt-1 mb-3">{product.name}</h1>
          <div className="flex items-center gap-2 text-yellow-400 mb-4">
            <Star size={16} fill="currentColor" />
            <span className="text-gray-600 text-sm">{product.rating} · {product.reviews_count} reviews</span>
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="text-3xl font-bold text-gray-900 mb-4">${product.price.toFixed(2)}</div>
          <p className="text-sm text-gray-500 mb-6">{product.stock > 0 ? `${product.stock} in stock` : <span className="text-red-500">Out of stock</span>}</p>
          <button
            onClick={() => onAddToCart(product.id)}
            disabled={product.stock === 0}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={18} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
