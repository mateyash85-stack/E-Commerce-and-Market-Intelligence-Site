import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { getCart, updateCartItem, removeCartItem, checkout } from '../api/client'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useAuth } from '../store/authContext'
import { toast } from 'sonner'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Cart({ onCartChange }: { onCartChange: () => void }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
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
      fetchCart()
      onCartChange()
    } catch {
      toast.error('Failed to update item')
    }
  }

  const remove = async (item_id: number) => {
    try {
      await removeCartItem(item_id)
      fetchCart()
      onCartChange()
    } catch {
      toast.error('Failed to remove item')
    }
  }

  const handleCheckout = async () => {
    if (!user) return navigate('/auth')
    setCheckingOut(true)
    try {
      await checkout()
      toast.success('Order placed successfully!')
      fetchCart()
      onCartChange()
      navigate('/orders')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Checkout failed')
    } finally {
      setCheckingOut(false)
    }
  }

  if (!user) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <ShoppingBag size={48} className="mx-auto mb-4 text-gray-200" />
      <p className="text-gray-500 mb-4">Please login to view your cart</p>
      <Link to="/auth" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 inline-block">Login</Link>
    </div>
  )

  if (loading) return <LoadingSpinner text="Loading cart..." />

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
          <p className="mb-2">Your cart is empty</p>
          <Link to="/products" className="text-indigo-600 hover:underline text-sm">Browse products</Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-4 bg-white border rounded-xl p-4 shadow-sm">
                <Link to={`/products/${item.product_id}`}>
                  <img
                    src={item.product.image_url || 'https://placehold.co/80'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg hover:opacity-90 transition"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.product_id}`}
                    className="font-semibold hover:text-indigo-600 transition block truncate">
                    {item.product.name}
                  </Link>
                  <p className="text-indigo-600 font-bold mt-0.5">${item.product.price.toFixed(2)}</p>
                  {item.product.stock < 5 && item.product.stock > 0 && (
                    <p className="text-xs text-amber-500 mt-0.5">Only {item.product.stock} left!</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => update(item.id, item.quantity - 1)}
                    className="p-1.5 rounded border hover:bg-gray-100 transition"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-7 text-center font-medium text-sm">{item.quantity}</span>
                  <button
                    onClick={() => update(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="p-1.5 rounded border hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <span className="w-20 text-right font-semibold text-gray-800">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => remove(item.id)}
                  className="text-gray-300 hover:text-red-500 ml-1 transition"
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="space-y-2 mb-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-3 mb-5">
              <span>Total</span>
              <span className="text-indigo-600">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-semibold transition"
            >
              {checkingOut ? 'Placing order...' : 'Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
