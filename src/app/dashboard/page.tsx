'use client'

import { useAuth } from '@/contexts/AuthContext'
import AppLayout from '@/components/layout/AppLayout'
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock,
  TrendingUp,
  Calendar
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DashboardStats } from '@/types/database'

export default function DashboardPage() {
  const { userRole, logout } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    total_employees: 0,
    expected_today: 0,
    present_today: 0,
    absent_today: 0,
    late_today: 0,
    attendance_rate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]

      // Get total employees
      const { count: totalEmployees } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      // Get today's attendance
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('status')
        .eq('date', today)

      const present = attendanceData?.filter(a => a.status === 'present').length || 0
      const absent = attendanceData?.filter(a => a.status === 'absent').length || 0
      const late = attendanceData?.filter(a => a.status === 'late').length || 0
      const expected = totalEmployees || 0
      const rate = expected > 0 ? Math.round((present / expected) * 100) : 0

      setStats({
        total_employees: totalEmployees || 0,
        expected_today: expected,
        present_today: present,
        absent_today: absent,
        late_today: late,
        attendance_rate: rate
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.total_employees,
      icon: Users,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      title: 'Expected Today',
      value: stats.expected_today,
      icon: Calendar,
      color: 'bg-purple-500',
      change: 'Active employees'
    },
    {
      title: 'Present Today',
      value: stats.present_today,
      icon: UserCheck,
      color: 'bg-green-500',
      change: `${stats.attendance_rate}% attendance rate`
    },
    {
      title: 'Absent Today',
      value: stats.absent_today,
      icon: UserX,
      color: 'bg-red-500',
      change: `Unmarked: ${stats.expected_today - stats.present_today - stats.absent_today - stats.late_today}`
    },
    {
      title: 'Late Today',
      value: stats.late_today,
      icon: Clock,
      color: 'bg-yellow-500',
      change: 'Needs attention'
    },
    {
      title: 'Attendance Rate',
      value: `${stats.attendance_rate}%`,
      icon: TrendingUp,
      color: 'bg-teal-500',
      change: 'Last 30 days'
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-500">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Add Employee</span>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Mark Attendance</span>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <span className="font-medium">View Reports</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Attendance marked for {i === 1 ? 'John Doe' : i === 2 ? 'Jane Smith' : 'Mike Johnson'}</p>
                <p className="text-sm text-gray-500">Marked as present at {i === 1 ? '9:00 AM' : i === 2 ? '9:15 AM' : '8:45 AM'}</p>
              </div>
              <span className="text-sm text-gray-400">{i}h ago</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
