import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { ShoppingCart, BarChart2, LogOut, User, Package, ChevronDown, ShoppingBag, Menu, X } from 'lucide-react'
import { useAuth } from '../store/authContext'

export default function Navbar({ cartCount = 0 }: { cartCount?: number }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [adminOpen, setAdminOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAdminOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const handleLogout = () => { logout(); navigate('/') }

  const isActive = (path: string) =>
    location.pathname === path ? 'text-indigo-600 font-semibold' : 'text-gray-600'

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <ShoppingBag size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold text-indigo-600">ShopIQ</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/products"
            className={`text-sm px-3 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition ${isActive('/products')}`}>
            Products
          </Link>

          {user?.role === 'admin' && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setAdminOpen(v => !v)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-50 transition"
              >
                <BarChart2 size={15} />
                Admin
                <ChevronDown size={13} className={`transition-transform duration-200 ${adminOpen ? 'rotate-180' : ''}`} />
              </button>
              {adminOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white border rounded-xl shadow-xl py-1.5 z-50">
                  <p className="px-4 py-1.5 text-xs text-gray-400 font-medium uppercase tracking-wide">Admin Panel</p>
                  <Link to="/admin" onClick={() => setAdminOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                    <BarChart2 size={15} /> Dashboard
                  </Link>
                  <Link to="/admin/products" onClick={() => setAdminOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                    <Package size={15} /> Products
                  </Link>
                  <Link to="/admin/orders" onClick={() => setAdminOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                    <ShoppingBag size={15} /> Orders
                  </Link>
                  <Link to="/admin/users" onClick={() => setAdminOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                    <User size={15} /> Users
                  </Link>
                </div>
              )}
            </div>
          )}

          {user ? (
            <>
              <Link to="/orders"
                className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition ${isActive('/orders')}`}>
                <User size={15} />
                <span className="max-w-[100px] truncate">{user.name}</span>
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition">
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <Link to="/auth"
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium">
              Sign In
            </Link>
          )}

          <Link to="/cart" className="relative p-2 rounded-lg hover:bg-indigo-50 transition ml-1">
            <ShoppingCart size={20} className={`transition ${location.pathname === '/cart' ? 'text-indigo-600' : 'text-gray-600'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-bold">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link to="/cart" className="relative p-2 rounded-lg hover:bg-indigo-50 transition">
            <ShoppingCart size={20} className="text-gray-600" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-bold">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMobileOpen(v => !v)} className="p-2 rounded-lg hover:bg-gray-100 transition">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-1">
          <Link to="/products" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
            Products
          </Link>
          {user?.role === 'admin' && (
            <>
              <Link to="/admin" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                <BarChart2 size={15} /> Dashboard
              </Link>
              <Link to="/admin/products" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                <Package size={15} /> Manage Products
              </Link>
              <Link to="/admin/orders" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                <ShoppingBag size={15} /> Manage Orders
              </Link>
              <Link to="/admin/users" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                <User size={15} /> Manage Users
              </Link>
            </>
          )}
          {user ? (
            <>
              <Link to="/orders" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                <User size={15} /> My Orders
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 w-full text-left">
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="flex items-center justify-center bg-indigo-600 text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
