'use client'

// Header Component - Top navigation bar with title, notifications, and logout
// Displays page title, notification bell with dropdown, and logout button
// Responsive design that accounts for the sidebar on desktop

import { Bell, LogOut } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

// Props interface for the Header component
interface HeaderProps {
  title: string              // Page title displayed in header
  subtitle?: string          // Optional subtitle for additional context
  onLogout?: () => void      // Optional logout function
}

export default function Header({ title, subtitle, onLogout }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)  // Notification dropdown state
  const [notificationCount] = useState(3)  // Sample notification count (hardcoded for demo)
  const notificationRef = useRef<HTMLDivElement>(null)  // Reference to notification dropdown

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  return (
    <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 relative z-40">
      <div className="lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Title section */}
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
              )}
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-4">
              {/* Notifications bell with dropdown */}
              <div className="relative z-50">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <Bell className="w-5 h-5 text-gray-300" />
                  {/* Notification badge showing count */}
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Notification dropdown - shows when bell is clicked */}
                {showNotifications && (
                  <div
                    ref={notificationRef}
                    className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl z-[99999]"
                  >
                    <div className="p-4 border-b border-white/10">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    </div>
                    {/* Sample notification items */}
                    <div className="max-h-64 overflow-y-auto">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                          <p className="text-sm text-white">Attendance marked for Employee {i}</p>
                          <p className="text-xs text-gray-400 mt-1">{i} hour ago</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-white/10">
                      <button className="w-full text-sm text-purple-400 hover:text-purple-300 transition-colors">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout button - only shown if onLogout prop is provided */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
