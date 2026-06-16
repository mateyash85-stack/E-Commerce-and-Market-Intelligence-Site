import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getMe } from '../api/client'

interface User { id: number; name: string; email: string; role: string }
interface AuthCtx { user: User | null; token: string | null; setAuth: (token: string, user: User) => void; logout: () => void }

const AuthContext = createContext<AuthCtx>({} as AuthCtx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (token) {
      getMe().then(r => setUser(r.data)).catch(() => logout())
    }
  }, [token])

  const setAuth = (t: string, u: User) => {
    localStorage.setItem('token', t)
    setToken(t)
    setUser(u)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, token, setAuth, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
