import { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router'
import { useAuth } from '../store/authContext'
import { getStats, getSales, getTopProducts, getCategoryBreakdown, getOrderStatusBreakdown } from '../api/client'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { DollarSign, ShoppingBag, Users, Package, ChevronRight } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white border rounded-xl p-5 flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}><Icon size={22} className="text-white" /></div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [sales, setSales] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [orderStatus, setOrderStatus] = useState<any[]>([])

  useEffect(() => {
    if (!user || user.role !== 'admin') return
    Promise.all([getStats(), getSales(), getTopProducts(), getCategoryBreakdown(), getOrderStatusBreakdown()])
      .then(([s, sl, tp, cat, os]) => {
        setStats(s.data); setSales(sl.data); setTopProducts(tp.data); setCategories(cat.data); setOrderStatus(os.data)
      })
  }, [user])

  if (!user) return <Navigate to="/auth" />
  if (user.role !== 'admin') return <Navigate to="/" />
  if (!stats) return <LoadingSpinner text="Loading dashboard..." />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Market Intelligence Dashboard</h1>
      <div className="flex gap-3 mb-8">
        <Link to="/admin/products"
          className="flex items-center gap-1 text-sm text-indigo-600 hover:underline">
          Manage Products <ChevronRight size={14} />
        </Link>
        <Link to="/admin/orders"
          className="flex items-center gap-1 text-sm text-indigo-600 hover:underline">
          Manage Orders <ChevronRight size={14} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${stats.total_revenue.toLocaleString()}`} color="bg-indigo-500" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats.total_orders} color="bg-purple-500" />
        <StatCard icon={Users} label="Customers" value={stats.total_customers} color="bg-pink-500" />
        <StatCard icon={Package} label="Products" value={stats.total_products} color="bg-amber-500" />
      </div>

      {/* Sales Over Time */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Revenue (Last 30 days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={sales}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Top Products by Units Sold</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProducts} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
              <Tooltip />
              <Bar dataKey="sold" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categories} dataKey="revenue" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Order Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={orderStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
                {orderStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
