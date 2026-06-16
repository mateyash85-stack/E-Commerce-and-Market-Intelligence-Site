import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { ShoppingCart, BarChart2, LogOut, User, Package, ChevronDown, ShoppingBag } from 'lucide-react'
import { useAuth } from '../store/authContext'

export default function Navbar({ cartCount = 0 }: { cartCount?: number }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [adminOpen, setAdminOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAdminOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-indigo-600">ShopIQ</Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 sm:gap-3">
          <Link to="/products"
            className="text-sm text-gray-600 hover:text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50 transition">
            Products
          </Link>

          {/* Admin dropdown */}
          {user?.role === 'admin' && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setAdminOpen(v => !v)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50 transition"
              >
                <BarChart2 size={16} />
                <span className="hidden sm:inline">Admin</span>
                <ChevronDown size={14} className={`transition-transform ${adminOpen ? 'rotate-180' : ''}`} />
              </button>

              {adminOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border rounded-xl shadow-lg py-1 z-50">
                  <Link to="/dashboard" onClick={() => setAdminOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                    <BarChart2 size={15} /> Analytics
                  </Link>
                  <Link to="/admin/products" onClick={() => setAdminOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                    <Package size={15} /> Products
                  </Link>
                  <Link to="/admin/orders" onClick={() => setAdminOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                    <ShoppingBag size={15} /> Orders
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Authenticated user */}
          {user ? (
            <>
              <Link to="/orders"
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50 transition">
                <User size={16} />
                <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
              </Link>
              <button onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 p-1.5 rounded hover:bg-red-50 transition"
                title="Logout">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link to="/auth"
              className="text-sm text-gray-600 hover:text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50 transition">
              Login
            </Link>
          )}

          {/* Cart icon */}
          <Link to="/cart" className="relative p-1.5 rounded hover:bg-indigo-50 transition">
            <ShoppingCart size={22} className="text-gray-700 hover:text-indigo-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-0.5 font-medium">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}
