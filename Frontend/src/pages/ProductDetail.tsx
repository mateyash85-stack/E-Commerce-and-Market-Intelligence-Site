import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { getProduct } from '../api/client'
import { ShoppingCart, Star, ArrowLeft, Package, Shield, Truck } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatINR } from '../utils/currency'

export default function ProductDetail({ onAddToCart }: { onAddToCart: (id: number) => void }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    setLoading(true)
    getProduct(Number(id))
      .then(r => setProduct(r.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner text="Loading product..." />
  if (!product) return null

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) onAddToCart(product.id)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-indigo-600 transition">Products</Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden bg-gray-50 border">
            <img
              src={product.image_url || 'https://placehold.co/600x400'}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white text-red-500 font-bold px-4 py-2 rounded-full">Out of Stock</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              {product.category}
            </span>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="bg-amber-50 text-amber-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                Only {product.stock} left!
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={16}
                  className={i <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.rating} · {product.reviews_count} reviews</span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

          <div className="text-4xl font-black text-gray-900 mb-2">{formatINR(product.price)}</div>
          <p className="text-sm text-gray-400 mb-6 flex items-center gap-1.5">
            <Package size={14} />
            {product.stock > 0
              ? <span className="text-green-600 font-medium">{product.stock} in stock</span>
              : <span className="text-red-500 font-medium">Out of stock</span>}
          </p>

          {/* Qty + Add */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 text-lg font-medium transition"
                >−</button>
                <span className="px-4 py-2.5 font-semibold text-gray-900 min-w-[3rem] text-center border-x">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 text-lg font-medium transition"
                >+</button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-semibold transition shadow-sm shadow-indigo-200"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          )}

          {product.stock === 0 && (
            <button disabled className="flex items-center justify-center gap-2 bg-gray-100 text-gray-400 px-6 py-3 rounded-xl font-semibold cursor-not-allowed mb-6">
              <ShoppingCart size={18} /> Out of Stock
            </button>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹499' },
              { icon: Shield, title: 'Secure Checkout', desc: '100% safe & secure' },
            ].map(b => (
              <div key={b.title} className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-3">
                <b.icon size={16} className="text-indigo-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-700">{b.title}</p>
                  <p className="text-xs text-gray-400">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 transition mt-8"
      >
        <ArrowLeft size={15} /> Back to products
      </button>
    </div>
  )
}
