'use client'

// Attendance Page - Mark daily attendance for employees
// Allows selecting a date and marking attendance status for each employee
// Uses backend API routes for all data operations

import { useAuth } from '@/contexts/AuthContext'
import AppLayout from '@/components/layout/AppLayout'
import { useState, useEffect } from 'react'
import { Employee, AttendanceStatus } from '@/types/database'
import { Calendar, Check, X, Clock, FileText, Save } from 'lucide-react'

export default function AttendancePage() {
  const { user, userRole, logout } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch employees and attendance when date changes
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date().toISOString().split('T')[0])
    } else {
      fetchEmployees()
      fetchAttendance()
    }
  }, [selectedDate])

  // Fetch employees from API route
  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees?status=active')
      if (!response.ok) throw new Error('Failed to fetch employees')

      const { data } = await response.json()
      setEmployees(data || [])
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch attendance records for selected date from API route
  const fetchAttendance = async () => {
    try {
      const response = await fetch(`/api/attendance?date=${selectedDate}`)
      if (!response.ok) throw new Error('Failed to fetch attendance')

      const { data } = await response.json()

      const attendanceMap: Record<string, AttendanceStatus> = {}
      data?.forEach((record: any) => {
        attendanceMap[record.employee_id] = record.status
      })
      setAttendanceData(attendanceMap)
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
  }

  // Update attendance status for a specific employee (local state only)
  const handleStatusChange = (employeeId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({
      ...prev,
      [employeeId]: status
    }))
  }

  // Save all attendance records to the database via bulk API route
  const handleSave = async () => {
    setSaving(true)
    try {
      if (!user) throw new Error('Not authenticated')

      // Prepare attendance records for bulk upsert
      // attendanceData keys are employee UUIDs (from employee.id)
      const records = Object.entries(attendanceData).map(([employeeUUID, status]) => ({
        employee_id: employeeUUID,  // Use UUID from employees table
        date: selectedDate,
        status,
        marked_by: user.id,  // This should be the user UUID from auth
        check_in_time: status === 'present' || status === 'late' ? '09:00' : null,
        check_out_time: null,
        notes: null
      }))

      // Use bulk API endpoint for efficient upsert
      const response = await fetch('/api/attendance/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Attendance save error:', errorData)
        throw new Error(errorData.error || 'Failed to save attendance')
      }

      alert('Attendance saved successfully!')
    } catch (error) {
      console.error('Error saving attendance:', error)
      alert('Failed to save attendance')
    } finally {
      setSaving(false)
    }
  }

  const statusOptions: { value: AttendanceStatus; label: string; icon: any; color: string; gradient: string }[] = [
    { value: 'present', label: 'Present', icon: Check, color: 'bg-green-500', gradient: 'from-green-500 to-green-600' },
    { value: 'absent', label: 'Absent', icon: X, color: 'bg-red-500', gradient: 'from-red-500 to-red-600' },
    { value: 'late', label: 'Late', icon: Clock, color: 'bg-yellow-500', gradient: 'from-yellow-500 to-yellow-600' },
    { value: 'excused', label: 'Excused', icon: FileText, color: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600' }
  ]

  const getStatusSummary = () => {
    const summary = { present: 0, absent: 0, late: 0, excused: 0, unmarked: 0 }
    employees.forEach(emp => {
      const status = attendanceData[emp.id]
      if (status) {
        summary[status]++
      } else {
        summary.unmarked++
      }
    })
    return summary
  }

  const summary = getStatusSummary()

  if (loading) {
    return (
      <AppLayout
        title="Attendance"
        subtitle="Mark daily attendance"
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
      title="Attendance" 
      subtitle="Mark daily attendance"
      userRole={userRole!}
      onLogout={logout}
    >
      {/* Date Selection */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {statusOptions.map((option) => (
          <div key={option.value} className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${option.gradient} flex items-center justify-center mb-2 shadow-lg`}>
              <option.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{summary[option.value]}</p>
            <p className="text-sm text-gray-400">{option.label}</p>
          </div>
        ))}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center mb-2 shadow-lg">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <p className="text-2xl font-bold text-white">{summary.unmarked}</p>
          <p className="text-sm text-gray-400">Unmarked</p>
        </div>
      </div>

      {/* Attendance List */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">
                          {employee.first_name} {employee.last_name}
                        </div>
                        <div className="text-sm text-gray-400">{employee.employee_id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {statusOptions.map((option) => {
                          const isSelected = attendanceData[employee.id] === option.value
                          return (
                            <button
                              key={option.value}
                              onClick={() => handleStatusChange(employee.id, option.value)}
                              className={`
                                px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                                ${isSelected
                                  ? `bg-gradient-to-r ${option.gradient} text-white shadow-lg`
                                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                                }
                              `}
                            >
                              {option.label}
                            </button>
                          )
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}
