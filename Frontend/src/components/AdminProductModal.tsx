import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { createProduct, updateProduct } from '../api/client'
import { toast } from 'sonner'

interface Product {
  id?: number; name: string; description: string; price: number
  category: string; image_url: string; stock: number
}

const empty: Product = { name: '', description: '', price: 0, category: '', image_url: '', stock: 0 }

export default function AdminProductModal({
  product, onClose, onSaved,
}: {
  product: Product | null      // null = create, object = edit
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<Product>(empty)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setForm(product ?? empty)
  }, [product])

  const set = (k: keyof Product, v: string | number) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (form.id) {
        await updateProduct(form.id, form)
        toast.success('Product updated')
      } else {
        await createProduct(form)
        toast.success('Product created')
      }
      onSaved()
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold">{form.id ? 'Edit Product' : 'New Product'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Product Name *</label>
              <input required value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="Product name"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Price (₹) *</label>
              <input required type="number" min="0" step="0.01" value={form.price}
                onChange={e => set('price', parseFloat(e.target.value) || 0)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Stock *</label>
              <input required type="number" min="0" value={form.stock}
                onChange={e => set('stock', parseInt(e.target.value) || 0)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
              <input value={form.category} onChange={e => set('category', e.target.value)}
                placeholder="e.g. Electronics"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Image URL</label>
              <input value={form.image_url} onChange={e => set('image_url', e.target.value)}
                placeholder="https://..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                rows={3} placeholder="Product description"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
            </div>
          </div>

          {form.image_url && (
            <img src={form.image_url} alt="preview" className="w-full h-32 object-cover rounded-lg border" />
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Saving...' : form.id ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
