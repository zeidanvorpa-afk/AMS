'use client'

// Sidebar Component - Navigation sidebar with role-based menu items
// Displays navigation links based on user's role (admin, manager, or user)
// Responsive design with mobile hamburger menu and desktop fixed sidebar

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BarChart3,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

// Props interface for the Sidebar component
interface SidebarProps {
  userRole: 'admin' | 'manager' | 'user'  // User's role for filtering navigation
  onLogout: () => void                     // Logout function
}

export default function Sidebar({ userRole, onLogout }: SidebarProps) {
  const pathname = usePathname()  // Get current route path for active state
  const [isOpen, setIsOpen] = useState(false)  // Mobile menu open/close state

  // Navigation menu items with role-based access control
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'user'] },
    { name: 'People', href: '/people', icon: Users, roles: ['admin', 'manager'] },
    { name: 'Attendance', href: '/attendance', icon: ClipboardCheck, roles: ['admin', 'manager'] },
    { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['admin', 'manager', 'user'] },
  ]

  // Filter navigation items based on user's role
  const filteredNavigation = navigation.filter(item => item.roles.includes(userRole))

  return (
    <>
      {/* Mobile menu button - hamburger icon that toggles sidebar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile - dark backdrop when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on desktop, slide-in on mobile */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900/80 backdrop-blur-xl text-white
          transform transition-transform duration-300 ease-in-out z-30 border-r border-white/10
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo section with AMS branding */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold tracking-tight">AMS</span>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-400 rounded-full shadow-lg" />
                <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 bg-pink-400 rounded-full shadow-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">AMS</h1>
                <p className="text-xs text-slate-400">Attendance Management System</p>
              </div>
            </div>
          </div>

          {/* Navigation menu - filtered by user role */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href  // Check if this is the active route
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}  // Close mobile menu on navigation
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-slate-800 text-white'      // Active state styling
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'  // Inactive state
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User info section at bottom of sidebar */}
          <div className="p-4 border-t border-white/10">
            <div>
              <p className="text-sm font-medium capitalize text-white">{userRole}</p>
              <p className="text-xs text-gray-400">Logged in</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
