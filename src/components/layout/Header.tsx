'use client'

import { Bell, LogOut } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
  onLogout?: () => void
}

export default function Header({ title, subtitle, onLogout }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount] = useState(3) // Sample notification count

  return (
    <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10">
      <div className="lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <Bell className="w-5 h-5 text-gray-300" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl z-[9999]">
                    <div className="p-4 border-b border-white/10">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    </div>
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

              {/* Logout Button */}
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
