import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getOrders } from '../api/client'
import { useAuth } from '../store/authContext'
import { Package } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      getOrders()
        .then(r => setOrders(r.data))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user])

  if (!user) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="text-gray-500 mb-4">Please login to view your orders</p>
      <Link to="/auth" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Login</Link>
    </div>
  )

  if (loading) return <LoadingSpinner text="Loading orders..." />

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package size={48} className="mx-auto mb-4 opacity-30" />
          <p>No orders yet</p>
          <Link to="/products" className="text-indigo-600 mt-2 inline-block hover:underline">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white border rounded-xl p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-700">Order #{order.id}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
              </div>
              <div className="text-sm text-gray-500 mb-3">{new Date(order.created_at).toLocaleDateString()}</div>
              <div className="space-y-1 text-sm">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-gray-600">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                <span>Total</span><span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
