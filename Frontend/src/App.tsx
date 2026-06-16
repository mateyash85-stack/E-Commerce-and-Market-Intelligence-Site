import { BrowserRouter, Routes, Route } from 'react-router'
import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './store/authContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Auth from './pages/Auth'
import Orders from './pages/Orders'
import Dashboard from './pages/Dashboard'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import NotFound from './pages/NotFound'
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
        <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
        <Route path="/products" element={<Products onAddToCart={handleAddToCart} />} />
        <Route path="/products/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
        <Route path="/cart" element={<Cart onCartChange={refreshCartCount} />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
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
