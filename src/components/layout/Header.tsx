'use client'

import { Bell, LogOut } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount] = useState(3)

  const notifications = [
    { id: 1, title: 'New employee added', message: 'John Doe was added to Engineering', time: '2h ago' },
    { id: 2, title: 'Attendance marked', message: '12 employees marked present today', time: '4h ago' },
    { id: 3, title: 'Report generated', message: 'Monthly attendance report is ready', time: '1d ago' },
  ]

  return (
    <header className="bg-white/5 backdrop-blur-xl border-b border-white/10">
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
                  className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white"
                >
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs flex items-center justify-center text-white font-medium">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden">
                      <div className="p-4 border-b border-white/10">
                        <h3 className="font-semibold text-white">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                            <p className="font-medium text-white text-sm">{notification.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-white/10">
                        <button className="w-full py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors">
                          Mark all as read
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Logout */}
              <button className="p-2 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 hover:from-red-500/30 hover:to-rose-500/30 transition-colors text-white">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
