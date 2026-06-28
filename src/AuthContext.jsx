import { createContext, useContext, useState, useEffect } from 'react'
import { api } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verify session on load
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await api.get('/api/auth/me')
        if (res.user) {
          setUser(res.user)
        }
      } catch (err) {
        // User is not logged in, ignore error
      } finally {
        setLoading(false)
      }
    }
    checkSession()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await api.post('/api/auth/login', { email, password })
      setUser(res.user)
      return res.user
    } finally {
      setLoading(false)
    }
  }

  const register = async (data) => {
    setLoading(true)
    try {
      const res = await api.post('/api/auth/register', data)
      setUser(res.user)
      return res.user
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.post('/api/auth/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
    }
  }

  const updateUserState = (updatedUser) => {
    setUser(updatedUser)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser: updateUserState
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
