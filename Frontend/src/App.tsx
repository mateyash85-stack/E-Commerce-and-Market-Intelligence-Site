import { BrowserRouter, Routes, Route } from 'react-router'
import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './store/authContext'
import Navbar from './components/Navbar'
import AdminLayout from './components/AdminLayout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Auth from './pages/Auth'
import Orders from './pages/Orders'
import Dashboard from './pages/Dashboard'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import AdminUsers from './pages/AdminUsers'
import AdminSettings from './pages/AdminSettings'
import NotFound from './pages/NotFound'
import Checkout from './pages/Checkout'
import { addToCart, getCart } from './api/client'
import { toast } from 'sonner'

function AppInner() {
  const { user } = useAuth()
  const [cartCount, setCartCount] = useState(0)

  const refreshCartCount = () => {
    if (user) {
      getCart()
        .then(r => setCartCount(r.data.reduce((s: number, i: any) => s + i.quantity, 0)))
        .catch(() => {/* ignore silent errors */})
    } else {
      setCartCount(0)
    }
  }

  useEffect(() => { refreshCartCount() }, [user])

  const handleAddToCart = async (product_id: number) => {
    if (!user) { toast.error('Please login to add items to cart'); return }
    try {
      await addToCart(product_id)
      toast.success('Added to cart!')
      refreshCartCount()
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to add to cart')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cartCount} />
      <Routes>
        {/* Public & customer routes */}
        <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
        <Route path="/products" element={<Products onAddToCart={handleAddToCart} />} />
        <Route path="/products/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
        <Route path="/cart" element={<Cart onCartChange={refreshCartCount} />} />
        <Route path="/checkout" element={<Checkout onCartChange={refreshCartCount} />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/orders" element={<Orders />} />

        {/* Admin routes — wrapped in AdminLayout */}
        <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

        {/* Legacy /dashboard redirect — keep working */}
        <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  )
}
