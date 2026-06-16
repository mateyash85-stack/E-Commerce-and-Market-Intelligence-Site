import { useState } from 'react'
import { useNavigate } from 'react-router'
import { login, register } from '../api/client'
import { useAuth } from '../store/authContext'
import { toast } from 'sonner'

export default function Auth() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = tab === 'login'
        ? await login(form.email, form.password)
        : await register(form)
      setAuth(res.data.access_token, res.data.user)
      toast.success(tab === 'login' ? 'Welcome back!' : 'Account created!')
      navigate(res.data.user.role === 'admin' ? '/dashboard' : '/')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white border rounded-2xl shadow-sm w-full max-w-md p-8">
        <div className="flex mb-6 border rounded-lg overflow-hidden">
          {(['login', 'register'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-sm font-medium capitalize transition ${tab === t ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {t}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full Name"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          )}
          <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="Email"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          <input required type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Password"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-semibold">
            {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        {tab === 'login' && (
          <p className="text-xs text-gray-400 text-center mt-4">Admin: admin@shop.com / admin123</p>
        )}
      </div>
    </div>
  )
}
