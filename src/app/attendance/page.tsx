'use client'

import { useAuth } from '@/contexts/AuthContext'
import AppLayout from '@/components/layout/AppLayout'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Employee, AttendanceStatus } from '@/types/database'
import { Calendar, Check, X, Clock, FileText, Save } from 'lucide-react'

export default function AttendancePage() {
  const { userRole, logout } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date().toISOString().split('T')[0])
    } else {
      fetchEmployees()
      fetchAttendance()
    }
  }, [selectedDate])

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'active')
        .order('last_name', { ascending: true })

      if (error) throw error
      setEmployees(data || [])
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('employee_id, status')
        .eq('date', selectedDate)

      if (error) throw error

      const attendanceMap: Record<string, AttendanceStatus> = {}
      data?.forEach(record => {
        attendanceMap[record.employee_id] = record.status
      })
      setAttendanceData(attendanceMap)
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
  }

  const handleStatusChange = (employeeId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({
      ...prev,
      [employeeId]: status
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error('Not authenticated')

      for (const [employeeId, status] of Object.entries(attendanceData)) {
        await supabase
          .from('attendance')
          .upsert({
            employee_id: employeeId,
            date: selectedDate,
            status,
            marked_by: user.id,
            check_in_time: status === 'present' || status === 'late' ? '09:00' : null,
            check_out_time: null,
            notes: null
          }, {
            onConflict: 'employee_id,date'
          })
      }

      alert('Attendance saved successfully!')
    } catch (error) {
      console.error('Error saving attendance:', error)
      alert('Failed to save attendance')
    } finally {
      setSaving(false)
    }
  }

  const statusOptions: { value: AttendanceStatus; label: string; icon: any; color: string }[] = [
    { value: 'present', label: 'Present', icon: Check, color: 'bg-green-500' },
    { value: 'absent', label: 'Absent', icon: X, color: 'bg-red-500' },
    { value: 'late', label: 'Late', icon: Clock, color: 'bg-yellow-500' },
    { value: 'excused', label: 'Excused', icon: FileText, color: 'bg-blue-500' }
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {statusOptions.map((option) => (
          <div key={option.value} className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className={`w-8 h-8 rounded-lg ${option.color} flex items-center justify-center mb-2`}>
              <option.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{summary[option.value]}</p>
            <p className="text-sm text-gray-600">{option.label}</p>
          </div>
        ))}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="w-8 h-8 rounded-lg bg-gray-400 flex items-center justify-center mb-2">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{summary.unmarked}</p>
          <p className="text-sm text-gray-600">Unmarked</p>
        </div>
      </div>

      {/* Attendance List */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
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
                                  ? `${option.color} text-white` 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
