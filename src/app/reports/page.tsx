'use client'

import { useAuth } from '@/contexts/AuthContext'
import AppLayout from '@/components/layout/AppLayout'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Download, Calendar, Filter, TrendingUp, TrendingDown } from 'lucide-react'

export default function ReportsPage() {
  const { userRole, logout } = useAuth()
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [reportData, setReportData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportData()
  }, [selectedMonth])

  const fetchReportData = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          employees (
            employee_id,
            first_name,
            last_name,
            department
          )
        `)
        .gte('date', `${selectedMonth}-01`)
        .lte('date', `${selectedMonth}-31`)
        .order('date', { ascending: true })

      if (error) throw error
      setReportData(data || [])
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateEmployeeStats = (employeeId: string) => {
    const employeeRecords = reportData.filter(r => r.employees?.id === employeeId)
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
        reportData.reduce((acc, record) => {
          const empId = record.employees?.id
          if (empId && !acc[empId]) {
            acc[empId] = record.employees
          }
          return acc
        }, {} as Record<string, any>)
      ).map(([_, emp]) => {
        const stats = calculateEmployeeStats(emp.id)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    )
  }

  const uniqueEmployees = Object.values(
    reportData.reduce((acc, record) => {
      const empId = record.employees?.id
      if (empId && !acc[empId]) {
        acc[empId] = record.employees
      }
      return acc
    }, {} as Record<string, any>)
  )

  return (
    <AppLayout 
      title="Reports" 
      subtitle="Attendance analytics and exports"
      userRole={userRole!}
      onLogout={logout}
    >
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-500">Avg Attendance</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {uniqueEmployees.length > 0 
              ? Math.round(
                  uniqueEmployees.reduce((sum, emp) => sum + calculateEmployeeStats(emp.id).attendanceRate, 0) / 
                  uniqueEmployees.length
                ) 
              : 0}%
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span className="text-xs text-gray-500">Total Absences</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {uniqueEmployees.reduce((sum, emp) => sum + calculateEmployeeStats(emp.id).absent, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-gray-500">Days Tracked</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {new Set(reportData.map(r => r.date)).size}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Filter className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-gray-500">Employees</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{uniqueEmployees.length}</p>
        </div>
      </div>

      {/* Employee Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Days
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Late
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Excused
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {uniqueEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No attendance data for this period
                  </td>
                </tr>
              ) : (
                uniqueEmployees.map((employee: any) => {
                  const stats = calculateEmployeeStats(employee.id)
                  return (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {employee.first_name} {employee.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{employee.employee_id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-900 font-medium">
                        {stats.totalDays}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {stats.present}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          {stats.absent}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          {stats.late}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {stats.excused}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          stats.attendanceRate >= 90 
                            ? 'bg-green-100 text-green-800' 
                            : stats.attendanceRate >= 70 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
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
