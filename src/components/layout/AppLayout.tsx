'use client'

import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface AppLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  userRole: 'admin' | 'manager' | 'user'
  onLogout: () => void
}

export default function AppLayout({ 
  children, 
  title, 
  subtitle, 
  userRole, 
  onLogout 
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-pink-900/20">
      <Sidebar userRole={userRole} />
      <div className="lg:pl-64">
        <Header title={title} subtitle={subtitle} onLogout={onLogout} />
        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
