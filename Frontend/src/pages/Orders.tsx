import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getOrders } from '../api/client'
import { useAuth } from '../store/authContext'
import { Package, ArrowRight, ShoppingBag } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatINR, toINR } from '../utils/currency'

const statusConfig: Record<string, { color: string; dot: string; label: string }> = {
  pending:   { color: 'bg-amber-50 text-amber-700 border-amber-200',  dot: 'bg-amber-400',  label: 'Pending'   },
  shipped:   { color: 'bg-blue-50 text-blue-700 border-blue-200',     dot: 'bg-blue-500',   label: 'Shipped'   },
  delivered: { color: 'bg-green-50 text-green-700 border-green-200',  dot: 'bg-green-500',  label: 'Delivered' },
  cancelled: { color: 'bg-red-50 text-red-700 border-red-200',        dot: 'bg-red-400',    label: 'Cancelled' },
}

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      getOrders().then(r => setOrders(r.data)).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user])

  if (!user) return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5">
        <Package size={36} className="text-indigo-300" />
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Track your orders</h2>
      <p className="text-gray-500 mb-6">Sign in to view your order history</p>
      <Link to="/auth" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-semibold transition">
        Sign In <ArrowRight size={16} />
      </Link>
    </div>
  )

  if (loading) return <LoadingSpinner text="Loading orders..." />

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link to="/products" className="text-sm text-indigo-600 hover:underline font-medium">
          Shop More
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-200" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-400 mb-8">Start shopping to see your orders here</p>
          <Link to="/products"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 font-semibold transition">
            Browse Products <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const sc = statusConfig[order.status] || { color: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400', label: order.status }
            return (
              <div key={order.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <Package size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Order #{order.id}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold border ${sc.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {sc.label}
                  </span>
                </div>

                {/* Items */}
                <div className="px-5 py-4">
                  <div className="space-y-2.5">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {item.quantity}
                          </span>
                          <span className="text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-gray-600 font-medium">₹{(toINR(item.price) * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
              <div className="flex items-center border-t border-gray-50 mt-4 pt-4">
                  <div className="flex-1 text-sm text-gray-500">
                    <p className="font-medium text-gray-700 mb-0.5">
                      {order.full_name && `${order.full_name} · `}
                      {order.city && `${order.city}`}
                      {order.payment_method && (
                        <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize">
                          {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method.toUpperCase()}
                        </span>
                      )}
                    </p>
                    {order.payment_status && (
                      <span className={`text-xs font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-amber-500'}`}>
                        Payment: {order.payment_status}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="font-bold text-gray-900 text-lg">₹{toINR(order.total).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
