import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../store/authContext'
import { getProducts, deleteProduct } from '../api/client'
import AdminProductModal from '../components/AdminProductModal'
import LoadingSpinner from '../components/LoadingSpinner'
import { Plus, Pencil, Trash2, Package } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminProducts() {
  const { user } = useAuth()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalProduct, setModalProduct] = useState<any | null | undefined>(undefined)
  // undefined = closed, null = new product, object = edit product

  if (!user) return <Navigate to="/auth" />
  if (user.role !== 'admin') return <Navigate to="/" />

  const fetchProducts = () => {
    setLoading(true)
    getProducts({ limit: 100 })
      .then(r => setProducts(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await deleteProduct(id)
      toast.success('Product deleted')
      fetchProducts()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products total</p>
        </div>
        <button
          onClick={() => setModalProduct(null)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium text-sm"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? <LoadingSpinner text="Loading products..." /> : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Price</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Stock</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Rating</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <Package size={36} className="mx-auto mb-2 opacity-30" />
                    No products yet
                  </td>
                </tr>
              ) : products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image_url || 'https://placehold.co/48?text=?'}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover border"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                      {p.category || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-medium ${p.stock === 0 ? 'text-red-500' : p.stock < 10 ? 'text-amber-500' : 'text-green-600'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    ⭐ {p.rating} <span className="text-gray-400">({p.reviews_count})</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setModalProduct(p)}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalProduct !== undefined && (
        <AdminProductModal
          product={modalProduct}
          onClose={() => setModalProduct(undefined)}
          onSaved={fetchProducts}
        />
      )}
    </div>
  )
}
