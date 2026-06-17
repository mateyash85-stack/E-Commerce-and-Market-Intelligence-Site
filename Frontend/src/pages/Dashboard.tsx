import { useEffect, useState } from 'react'
import { useAuth } from '../store/authContext'
import { getStats, getSales, getTopProducts, getCategoryBreakdown, getOrderStatusBreakdown } from '../api/client'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatINR } from '../utils/currency'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

function StatCard({ icon: Icon, label, value, color, sub }: any) {
  return (
    <div className="bg-white border rounded-xl p-5 flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}><Icon size={22} className="text-white" /></div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [sales, setSales] = useState<any[]>([])
  const [salesDays, setSalesDays] = useState(30)
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [orderStatus, setOrderStatus] = useState<any[]>([])

  useEffect(() => {
    if (!user || user.role !== 'admin') return
    Promise.all([getStats(), getSales(salesDays), getTopProducts(), getCategoryBreakdown(), getOrderStatusBreakdown()])
      .then(([s, sl, tp, cat, os]) => {
        setStats(s.data); setSales(sl.data); setTopProducts(tp.data); setCategories(cat.data); setOrderStatus(os.data)
      })
  }, [user, salesDays])

  if (!stats) return <LoadingSpinner text="Loading dashboard..." />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Market intelligence at a glance</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="Total Revenue" value={formatINR(stats.total_revenue)} color="bg-indigo-500" sub="excl. cancelled" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats.total_orders} color="bg-purple-500" />
        <StatCard icon={Users} label="Customers" value={stats.total_customers} color="bg-pink-500" />
        <StatCard icon={Package} label="Products" value={stats.total_products} color="bg-amber-500" />
      </div>

      {/* Sales Over Time */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">Revenue Over Time</h2>
            <select
              value={salesDays}
              onChange={e => setSalesDays(Number(e.target.value))}
              className="text-xs border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
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
