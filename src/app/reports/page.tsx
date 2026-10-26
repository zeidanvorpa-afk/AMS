'use client'

import { useAuth } from '@/contexts/AuthContext'
import AppLayout from '@/components/layout/AppLayout'
import { useState, useEffect } from 'react'
import { Download, Calendar, Filter, TrendingUp, TrendingDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ReportsPage() {
  const { user, userRole, logout } = useAuth()
  const router = useRouter()
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [reportData, setReportData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const fetchReportData = async () => {
    try {
      const response = await fetch(`/api/reports?month=${selectedMonth}`)
      if (!response.ok) throw new Error('Failed to fetch report data')

      const data = await response.json()
      setReportData(data || [])
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedMonth) {
      fetchReportData()
    }
  }, [selectedMonth])

  const calculateEmployeeStats = (employeeId: string) => {
    const employeeRecords = reportData.filter(r => r.employees?.employee_id === employeeId)
    const totalDays = employeeRecords.length
    const present = employeeRecords.filter(r => r.status === 'present').length
    const absent = employeeRecords.filter(r => r.status === 'absent').length
    const late = employeeRecords.filter(r => r.status === 'late').length
    const excused = employeeRecords.filter(r => r.status === 'excused').length
    const attendanceRate = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0

    return { totalDays, present, absent, late, excused, attendanceRate }
  }

  const exportReport = () => {
    const csv = [
      ['Employee ID', 'Name', 'Department', 'Total Days', 'Present', 'Absent', 'Late', 'Excused', 'Attendance Rate'],
      ...Object.entries(
        reportData.reduce((acc: Record<string, any>, record: any) => {
          const empId = record.employees?.employee_id
          if (empId && !acc[empId]) {
            acc[empId] = record.employees
          }
          return acc
        }, {} as Record<string, any>)
      ).map(([_, emp]: [string, any]): any[] => {
        const stats = calculateEmployeeStats(emp.employee_id)
        return [
          emp.employee_id,
          `${emp.first_name} ${emp.last_name}`,
          emp.department,
          stats.totalDays,
          stats.present,
          stats.absent,
          stats.late,
          stats.excused,
          `${stats.attendanceRate}%`
        ]
      })
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance-report-${selectedMonth}.csv`
    a.click()
  }

  if (loading) {
    return (
      <AppLayout 
        title="Reports" 
        subtitle="Attendance analytics and exports"
        userRole={userRole!}
        onLogout={logout}
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </AppLayout>
    )
  }

  const uniqueEmployees = Object.values(
    reportData.reduce((acc: Record<string, any>, record: any) => {
      const empId = record.employees?.employee_id
      if (empId && !acc[empId]) {
        acc[empId] = record.employees
      }
      return acc
    }, {} as Record<string, any>)
  ) as any[]

  return (
    <AppLayout 
      title="Reports" 
      subtitle="Attendance analytics and exports"
      userRole={userRole!}
      onLogout={logout}
    >
      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-purple-400 mt-1" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />
          </div>
          <button
            onClick={exportReport}
            className="flex items-start gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
          >
            <Download className="w-4 h-4 mt-0.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-left">
          <div className="flex items-start justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-xs text-gray-400">Avg Attendance</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {uniqueEmployees.length > 0
              ? Math.round(
                  uniqueEmployees.reduce((sum: number, emp: any) => sum + calculateEmployeeStats(emp.id).attendanceRate, 0) /
                  uniqueEmployees.length
                )
              : 0}%
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-left">
          <div className="flex items-start justify-between mb-2">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <span className="text-xs text-gray-400">Total Absences</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {uniqueEmployees.reduce((sum: number, emp: any) => sum + calculateEmployeeStats(emp.id).absent, 0)}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-left">
          <div className="flex items-start justify-between mb-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-gray-400">Days Tracked</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {new Set(reportData.map(r => r.date)).size}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-left">
          <div className="flex items-start justify-between mb-2">
            <Filter className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-gray-400">Employees</span>
          </div>
          <p className="text-2xl font-bold text-white">{uniqueEmployees.length}</p>
        </div>
      </div>

      {/* Employee Attendance Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total Days
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Present
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Absent
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Late
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Excused
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {uniqueEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    No attendance data for this period
                  </td>
                </tr>
              ) : (
                uniqueEmployees.map((employee: any) => {
                  const stats = calculateEmployeeStats(employee.employee_id)
                  return (
                    <tr key={employee.employee_id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">
                            {employee.first_name} {employee.last_name}
                          </div>
                          <div className="text-sm text-gray-400">{employee.employee_id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 text-center text-white font-medium">
                        {stats.totalDays}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                          {stats.present}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                          {stats.absent}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                          {stats.late}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {stats.excused}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                          stats.attendanceRate >= 90 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : stats.attendanceRate >= 70 
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {stats.attendanceRate}%
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}
