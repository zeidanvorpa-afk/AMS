'use client'

// AppLayout Component - Main layout wrapper for all pages
// Provides consistent layout structure with sidebar, header, and main content area
// Handles responsive design and role-based navigation

import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

// Props interface for the AppLayout component
interface AppLayoutProps {
  children: ReactNode                      // Page content to render
  title: string                            // Page title displayed in header
  subtitle?: string                        // Optional subtitle for additional context
  userRole: 'admin' | 'manager' | 'user'   // User's role for navigation filtering
  onLogout: () => void                     // Logout function passed to sidebar and header
}

// Main layout component
export default function AppLayout({
  children,
  title,
  subtitle,
  userRole,
  onLogout
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Fixed sidebar on the left side */}
      <Sidebar userRole={userRole} onLogout={onLogout} />

      {/* Main content area with left padding to account for sidebar on desktop */}
      <div className="lg:pl-64">
        {/* Header section with title and controls */}
        <Header title={title} subtitle={subtitle} onLogout={onLogout} />

        {/* Main content area with responsive padding */}
        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
