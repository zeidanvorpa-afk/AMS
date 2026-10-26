'use client'

import { useAuth } from '@/contexts/AuthContext'
import AppLayout from '@/components/layout/AppLayout'
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { DashboardStats } from '@/types/database'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, userRole, logout } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])
  const [stats, setStats] = useState<DashboardStats>({
    total_employees: 0,
    expected_today: 0,
    present_today: 0,
    absent_today: 0,
    late_today: 0,
    attendance_rate: 0
  })
  const [loading, setLoading] = useState(true)

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.total_employees,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      trend: '+2',
      trendUp: true,
      label: 'this month'
    },
    {
      title: 'Expected Today',
      value: stats.expected_today,
      icon: Calendar,
      gradient: 'from-purple-500 to-pink-500',
      trend: '+5',
      trendUp: true,
      label: 'from yesterday'
    },
    {
      title: 'Present Today',
      value: stats.present_today,
      icon: UserCheck,
      gradient: 'from-green-500 to-emerald-500',
      trend: '+12%',
      trendUp: true,
      label: 'vs last week'
    },
    {
      title: 'Absent Today',
      value: stats.absent_today,
      icon: UserX,
      gradient: 'from-red-500 to-rose-500',
      trend: '-3',
      trendUp: true,
      label: 'from yesterday'
    },
    {
      title: 'Late Today',
      value: stats.late_today,
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-500',
      trend: '+2',
      trendUp: false,
      label: 'needs attention'
    },
    {
      title: 'Attendance Rate',
      value: `${stats.attendance_rate}%`,
      icon: TrendingUp,
      gradient: 'from-teal-500 to-cyan-500',
      trend: '+5%',
      trendUp: true,
      label: 'last 30 days'
    }
  ]

  if (loading) {
    return (
      <AppLayout 
        title="Dashboard" 
        subtitle="Overview of attendance metrics"
        userRole={userRole!}
        onLogout={logout}
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout
      title="Dashboard"
      subtitle="Overview of attendance metrics"
      userRole={userRole!}
      onLogout={logout}
    >
      {/* Version marker - v3-api-routes-2026-10-26 */}
      <div className="text-xs text-gray-600 mb-2">v3-api-routes-2026-10-26</div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                {stat.trendUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{stat.trend}</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white text-left">{stat.value}</h3>
            <p className="text-sm text-gray-400 mt-1 text-left">{stat.title}</p>
            <p className="text-xs text-gray-500 mt-1 text-left">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 text-left">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/people')}
            className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all group"
          >
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="font-medium text-white block">Add Employee</span>
              <span className="text-xs text-gray-400">Manage staff</span>
            </div>
          </button>
          <button
            onClick={() => router.push('/attendance')}
            className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all group"
          >
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="font-medium text-white block">Mark Attendance</span>
              <span className="text-xs text-gray-400">Daily tracking</span>
            </div>
          </button>
          <button
            onClick={() => router.push('/reports')}
            className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/30 hover:from-teal-500/30 hover:to-emerald-500/30 transition-all group"
          >
            <div className="p-3 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="font-medium text-white block">View Reports</span>
              <span className="text-xs text-gray-400">Analytics</span>
            </div>
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
