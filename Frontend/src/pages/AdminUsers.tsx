import { useEffect, useState } from 'react'
import { getAllUsers, updateUserRole, deleteUser } from '../api/client'
import { useAuth } from '../store/authContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { Users, Trash2, ShieldCheck, UserCircle, Search } from 'lucide-react'
import { toast } from 'sonner'
import { formatINR } from '../utils/currency'

interface UserRow {
  id: number
  name: string
  email: string
  role: string
  created_at: string
  order_count: number
  total_spent: number
}

const roleBadge: Record<string, string> = {
  admin: 'bg-indigo-100 text-indigo-700',
  customer: 'bg-gray-100 text-gray-600',
}

export default function AdminUsers() {
  const { user: me } = useAuth()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [processingId, setProcessingId] = useState<number | null>(null)

  const fetchUsers = () => {
    setLoading(true)
    getAllUsers()
      .then(r => setUsers(r.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const handleRoleToggle = async (u: UserRow) => {
    const newRole = u.role === 'admin' ? 'customer' : 'admin'
    if (!confirm(`Change ${u.name}'s role to "${newRole}"?`)) return
    setProcessingId(u.id)
    try {
      await updateUserRole(u.id, newRole)
      toast.success(`${u.name} is now a ${newRole}`)
      fetchUsers()
    } catch {
      toast.error('Failed to update role')
    } finally {
      setProcessingId(null)
    }
  }

  const handleDelete = async (u: UserRow) => {
    if (u.id === me?.id) { toast.error("You can't delete yourself"); return }
    if (!confirm(`Delete user "${u.name}" (${u.email})? This will also delete their orders.`)) return
    setProcessingId(u.id)
    try {
      await deleteUser(u.id)
      toast.success(`User ${u.name} deleted`)
      fetchUsers()
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to delete user')
    } finally {
      setProcessingId(null)
    }
  }

  const filtered = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter ? u.role === roleFilter : true
    return matchesSearch && matchesRole
  })

  const adminCount = users.filter(u => u.role === 'admin').length
  const customerCount = users.filter(u => u.role === 'customer').length

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            {users.length} total users · {adminCount} admin{adminCount !== 1 ? 's' : ''} · {customerCount} customer{customerCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(['', 'admin', 'customer'] as const).map(role => (
          <button
            key={role}
            onClick={() => setRoleFilter(roleFilter === role ? '' : role)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
              roleFilter === role
                ? role === 'admin'
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                  : role === 'customer'
                  ? 'bg-gray-100 text-gray-700 border-gray-300'
                  : 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {role === '' ? `All (${users.length})` : `${role.charAt(0).toUpperCase() + role.slice(1)} (${role === 'admin' ? adminCount : customerCount})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {loading ? (
        <LoadingSpinner text="Loading users..." />
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">User</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Orders</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Total Spent</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Joined</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <Users size={36} className="mx-auto mb-2 opacity-30" />
                    No users found
                  </td>
                </tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {u.name}
                          {u.id === me?.id && (
                            <span className="ml-1.5 text-[10px] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded-full">You</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${roleBadge[u.role] || 'bg-gray-100 text-gray-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{u.order_count}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">
                    {u.total_spent > 0 ? formatINR(u.total_spent) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(u.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        disabled={processingId === u.id}
                        onClick={() => handleRoleToggle(u)}
                        title={u.role === 'admin' ? 'Revoke admin' : 'Make admin'}
                        className={`p-1.5 rounded-lg transition disabled:opacity-50 ${
                          u.role === 'admin'
                            ? 'text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50'
                            : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                        }`}
                      >
                        {u.role === 'admin' ? <ShieldCheck size={15} /> : <UserCircle size={15} />}
                      </button>
                      <button
                        disabled={processingId === u.id || u.id === me?.id}
                        onClick={() => handleDelete(u)}
                        title="Delete user"
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30"
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
    </div>
  )
}
