'use client'

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

interface SidebarProps {
  userRole: 'admin' | 'manager' | 'user'
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'user'] },
    { name: 'People', href: '/people', icon: Users, roles: ['admin', 'manager'] },
    { name: 'Attendance', href: '/attendance', icon: ClipboardCheck, roles: ['admin', 'manager'] },
    { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['admin', 'manager', 'user'] },
  ]

  const filteredNavigation = navigation.filter(item => item.roles.includes(userRole))

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900/95 backdrop-blur-xl text-white
          transform transition-transform duration-300 ease-in-out z-50
          border-r border-white/10
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AMS</h1>
            <p className="text-sm text-gray-400 mt-1">Attendance Management System</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : ''}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-sm font-medium capitalize text-white">{userRole}</p>
              <p className="text-xs text-gray-400">Logged in</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
