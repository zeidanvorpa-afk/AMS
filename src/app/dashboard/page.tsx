'use client'

// Dashboard Page - Main overview page showing attendance statistics
// Displays key metrics, quick actions, and navigation to other features
// Fetches real-time data from the backend API routes

import { useAuth } from '@/contexts/AuthContext'
import AppLayout from '@/components/layout/AppLayout'
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  Plus,
  ClipboardCheck,
  BarChart3
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { DashboardStats } from '@/types/database'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { userRole, logout } = useAuth()  // Get auth state and logout function
  const router = useRouter()  // Next.js router for navigation

  // State for dashboard statistics
  const [stats, setStats] = useState<DashboardStats>({
    total_employees: 0,
    expected_today: 0,
    present_today: 0,
    absent_today: 0,
    late_today: 0,
    attendance_rate: 0
  })
  const [loading, setLoading] = useState(true)  // Loading state for data fetch

  // Fetch dashboard statistics on component mount
  useEffect(() => {
    console.log('Dashboard: useEffect called, userRole:', userRole)
    fetchDashboardStats()
  }, [])

  // Fetch attendance statistics from the API route (backend layer)
  const fetchDashboardStats = async () => {
    try {
      // Call the API route instead of Supabase directly
      // This follows the proper architecture: Frontend -> API Route -> Database
      const response = await fetch('/api/dashboard/stats')

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }

      const { data } = await response.json()

      // Update state with statistics from API
      setStats({
        total_employees: data.total_employees,
        expected_today: data.expected_today,
        present_today: data.present_today,
        absent_today: data.absent_today,
        late_today: data.late_today,
        attendance_rate: data.attendance_rate
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Define statistics cards configuration
  // Each card displays a different metric with icon, color, and trend indicator
  const statCards = [
    {
      title: 'Total Employees',
      value: stats.total_employees,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      trend: '+2',
      trendUp: true
    },
    {
      title: 'Expected Today',
      value: stats.expected_today,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      trend: null,
      trendUp: null
    },
    {
      title: 'Present Today',
      value: stats.present_today,
      icon: UserCheck,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Absent Today',
      value: stats.absent_today,
      icon: UserX,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      trend: '-3%',
      trendUp: false
    },
    {
      title: 'Late Today',
      value: stats.late_today,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      trend: '-1',
      trendUp: true
    },
    {
      title: 'Attendance Rate',
      value: `${stats.attendance_rate}%`,
      icon: TrendingUp,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/20',
      trend: '+2%',
      trendUp: true
    }
  ]

  // Show loading spinner while fetching data
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

  // Main dashboard content
  return (
    <AppLayout
      title="Dashboard"
      subtitle="Overview of attendance metrics"
      userRole={userRole!}
      onLogout={logout}
    >
      {/* Statistics grid - displays all key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 border ${stat.borderColor} hover:bg-white/10 transition-all duration-300 group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              {/* Trend indicator (optional) */}
              {stat.trend && (
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trendUp ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.trendUp ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.trend}</span>
                </div>
              )}
            </div>
            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            <p className="text-sm text-gray-400 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Quick actions section - provides shortcuts to common tasks */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/people')}
            className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-500/50 transition-all duration-300 group"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg group-hover:shadow-xl transition-shadow">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="font-medium text-white block">Add Employee</span>
              <span className="text-xs text-gray-400">Manage staff</span>
            </div>
          </button>
          <button
            onClick={() => router.push('/attendance')}
            className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-500/50 transition-all duration-300 group"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg group-hover:shadow-xl transition-shadow">
              <ClipboardCheck className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="font-medium text-white block">Mark Attendance</span>
              <span className="text-xs text-gray-400">Daily tracking</span>
            </div>
          </button>
          <button
            onClick={() => router.push('/reports')}
            className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-500/50 transition-all duration-300 group"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg group-hover:shadow-xl transition-shadow">
              <BarChart3 className="w-5 h-5 text-white" />
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
