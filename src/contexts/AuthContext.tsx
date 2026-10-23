'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import supabase from '@/lib/supabase/client'
import { UserRole } from '@/types/database'

interface AuthContextType {
  user: any
  userRole: UserRole | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    // Check active session on mount only
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchUserRole(session.user.id)
        }
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (data) {
      setUserRole(data.role as UserRole)
    }
  }

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    
    // Get the session after login
    const { data: { session } } = await supabase.auth.getSession()
    
    // Manually update user state after successful login
    setUser(session?.user ?? null)
    if (session?.user) {
      await fetchUserRole(session.user.id)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUserRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, userRole, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
