import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth'
    }
    return Promise.reject(err)
  }
)

// Auth
export const register = (data: { name: string; email: string; password: string }) =>
  api.post('/api/auth/register', data)

export const login = (email: string, password: string) => {
  const form = new FormData()
  form.append('username', email)
  form.append('password', password)
  return api.post('/api/auth/login', form)
}

export const getMe = () => api.get('/api/auth/me')

// Products
export const getProducts = (params?: { category?: string; search?: string; skip?: number; limit?: number }) =>
  api.get('/api/products', { params })

export const getProduct = (id: number) => api.get(`/api/products/${id}`)

export const getCategories = () => api.get('/api/products/categories')

// Cart
export const getCart = () => api.get('/api/cart')

export const addToCart = (product_id: number, quantity = 1) =>
  api.post('/api/cart', { product_id, quantity })

export const updateCartItem = (item_id: number, quantity: number) =>
  api.put(`/api/cart/${item_id}`, { quantity })

export const removeCartItem = (item_id: number) => api.delete(`/api/cart/${item_id}`)

export const clearCart = () => api.delete('/api/cart')

// Orders
export const checkout = (data: {
  full_name: string; phone: string; address_line1: string; address_line2?: string
  city: string; state: string; pincode: string; payment_method: string
}) => api.post('/api/orders', data)

export const getOrders = () => api.get('/api/orders')

// Admin – Products CRUD
export const createProduct = (data: {
  name: string; description?: string; price: number
  category?: string; image_url?: string; stock: number
}) => api.post('/api/products', data)

export const updateProduct = (id: number, data: Partial<{
  name: string; description: string; price: number
  category: string; image_url: string; stock: number
}>) => api.put(`/api/products/${id}`, data)

export const deleteProduct = (id: number) => api.delete(`/api/products/${id}`)

// Admin – Orders
export const getAllOrders = () => api.get('/api/orders/admin/all')

export const updateOrderStatus = (order_id: number, status: string) =>
  api.put(`/api/orders/admin/${order_id}/status`, { status })

// Analytics (admin)
export const getStats = () => api.get('/api/analytics/stats')

export const getSales = (days = 30) => api.get('/api/analytics/sales', { params: { days } })

export const getTopProducts = () => api.get('/api/analytics/top-products')

export const getCategoryBreakdown = () => api.get('/api/analytics/categories')

export const getOrderStatusBreakdown = () => api.get('/api/analytics/order-status')

export default api
