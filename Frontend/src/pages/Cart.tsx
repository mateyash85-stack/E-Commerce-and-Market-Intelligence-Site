import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { getCart, updateCartItem, removeCartItem } from '../api/client'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { useAuth } from '../store/authContext'
import { toast } from 'sonner'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatINR, toINR } from '../utils/currency'

export default function Cart({ onCartChange }: { onCartChange: () => void }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  const fetchCart = () => {
    if (!user) { setLoading(false); return }
    getCart()
      .then(r => setItems(r.data))
      .catch(() => toast.error('Failed to load cart'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCart() }, [user])

  const update = async (item_id: number, qty: number) => {
    try {
      await updateCartItem(item_id, qty)
      fetchCart(); onCartChange()
    } catch { toast.error('Failed to update item') }
  }

  const remove = async (item_id: number) => {
    try {
      await removeCartItem(item_id)
      fetchCart(); onCartChange()
    } catch { toast.error('Failed to remove item') }
  }

  const handleCheckout = () => {
    if (!user) return navigate('/auth')
    navigate('/checkout')
  }

  if (!user) return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5">
        <ShoppingBag size={36} className="text-indigo-300" />
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart awaits</h2>
      <p className="text-gray-500 mb-6">Sign in to view and manage your cart</p>
      <Link to="/auth" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-semibold transition">
        Sign In <ArrowRight size={16} />
      </Link>
    </div>
  )

  if (loading) return <LoadingSpinner text="Loading cart..." />

  const subtotal = items.reduce((s, i) => s + toINR(i.product.price) * i.quantity, 0)
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Shopping Cart
          {items.length > 0 && <span className="ml-2 text-lg font-normal text-gray-400">({totalItems} items)</span>}
        </h1>
        {items.length > 0 && (
          <Link to="/products" className="text-sm text-indigo-600 hover:underline font-medium">
            Continue Shopping
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-200" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Looks like you haven't added anything yet</p>
          <Link to="/products"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 font-semibold transition">
            Browse Products <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                <Link to={`/products/${item.product_id}`} className="flex-shrink-0">
                  <img
                    src={item.product.image_url || 'https://placehold.co/80'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl hover:opacity-90 transition"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.product_id}`}
                    className="font-semibold text-gray-800 hover:text-indigo-600 transition block truncate text-sm">
                    {item.product.name}
                  </Link>
                  <p className="text-indigo-600 font-bold mt-0.5">{formatINR(item.product.price)}</p>
                  {item.product.stock <= 5 && item.product.stock > 0 && (
                    <p className="text-xs text-amber-500 mt-0.5">⚠️ Only {item.product.stock} left</p>
                  )}
                </div>
                <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
                  <button onClick={() => update(item.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition text-gray-600">
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => update(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600">
                    <Plus size={12} />
                  </button>
                </div>
                <span className="font-bold text-gray-900 w-20 text-right text-sm">
                  ₹{(toINR(item.product.price) * item.quantity).toLocaleString('en-IN')}
                </span>
                <button onClick={() => remove(item.id)}
                  className="text-gray-200 hover:text-red-400 transition p-1 rounded-lg hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-bold text-gray-900 text-lg mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={subtotal >= 499 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                    {subtotal >= 499 ? 'Free' : '₹49'}
                  </span>
                </div>
                {subtotal < 499 && (
                  <div className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                    Add ₹{(499 - subtotal).toLocaleString('en-IN')} more for free shipping
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span className="text-indigo-600">₹{(subtotal + (subtotal >= 499 ? 0 : 49)).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-xl hover:bg-indigo-700 font-semibold transition shadow-sm shadow-indigo-200"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
                <Tag size={12} /> Secure checkout
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
