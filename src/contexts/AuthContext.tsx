'use client'

// Authentication Context - Manages user authentication state across the application
// This context provides login/logout functionality and user role information
// Uses Supabase Auth for authentication and stores user role from the database

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { UserRole } from '@/types/database'

// Interface defining the shape of the auth context
interface AuthContextType {
  user: any                      // Current authenticated user object
  userRole: UserRole | null      // User's role (admin, manager, or user)
  loading: boolean               // Loading state for auth operations
  login: (email: string, password: string) => Promise<void>  // Login function
  logout: () => Promise<void>    // Logout function
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider component - Wraps the app to provide auth context to all children
export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize Supabase browser client with SSR support
  // This client properly handles cookie management for session persistence
  const [supabase] = useState(() =>
    createBrowserClient(
      'https://vdoqwihhpdconsijmjxh.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkb3F3aWhocGRjb25zaWptanhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4NTkyMjgsImV4cCI6MjEwNzQzNTIyOH0.ih4TURRsbR2NWi6rkrAsCRIEQFOUsIWfiCUrt4B4iQM',
      {
        auth: {
          persistSession: true,      // Keep session in browser storage
          autoRefreshToken: true,     // Automatically refresh expired tokens
          detectSessionInUrl: false,  // Don't parse session from URL (prevents issues)
        }
      }
    )
  )

  // State management for authentication
  const [user, setUser] = useState<any>(null)              // Current user
  const [userRole, setUserRole] = useState<UserRole | null>(null)  // User's role
  const [loading, setLoading] = useState(true)            // Loading state

  // Effect hook - Runs on component mount to check for existing session
  useEffect(() => {
    // Check if user has an active session in browser
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserRole(session.user.id)  // Fetch user's role from database
      }
      setLoading(false)
    })

    // Subscribe to auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserRole(session.user.id)  // Fetch role when auth state changes
      } else {
        setUserRole(null)  // Clear role when logged out
      }
      setLoading(false)
    })

    // Cleanup - unsubscribe from auth state changes when component unmounts
    return () => subscription.unsubscribe()
  }, [supabase])

  // Fetch user's role from the database
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

  // Login function - Authenticates user with email and password
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  // Logout function - Signs out the current user
  const logout = async () => {
    await supabase.auth.signOut()
  }

  // Provide auth context to all child components
  return (
    <AuthContext.Provider value={{ user, userRole, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
// Provides easy access to auth state and functions in any component
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
