'use client'

import { LogOut } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  onLogout?: () => void
}

export default function Header({ title, subtitle, onLogout }: HeaderProps) {
  return (
    <header className="bg-white/5 backdrop-blur-xl border-b border-white/10">
      <div className="lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="text-left flex-1">
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-4 ml-4">
              {/* Logout */}
              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 hover:from-red-500/30 hover:to-rose-500/30 transition-colors text-white"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
