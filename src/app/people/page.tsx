'use client'

// People Page - Employee management and listing
// Displays all employees with search functionality and add employee modal
// Uses backend API routes for all data operations

import { useAuth } from '@/contexts/AuthContext'
import AppLayout from '@/components/layout/AppLayout'
import { useState, useEffect } from 'react'
import { Employee } from '@/types/database'
import { Plus, Search, Edit, Trash2, MoreVertical } from 'lucide-react'

export default function PeoplePage() {
  const { userRole, logout } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  // Form state for new employee
  const [newEmployee, setNewEmployee] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    position: '',
    hire_date: ''
  })

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees()
  }, [])

  // Fetch employees from API route
  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      if (!response.ok) throw new Error('Failed to fetch employees')

      const { data } = await response.json()
      setEmployees(data || [])
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmployee({
      ...newEmployee,
      [e.target.name]: e.target.value
    })
  }

  // Handle form submission
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)

    try {
      // Generate employee ID if not provided
      const employeeId = newEmployee.employee_id || `EMP${String(employees.length + 1).padStart(3, '0')}`

      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEmployee,
          employee_id: employeeId
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add employee')
      }

      // Refresh employee list
      await fetchEmployees()

      // Close modal and reset form
      setShowAddModal(false)
      setNewEmployee({
        employee_id: '',
        first_name: '',
        last_name: '',
        email: '',
        department: '',
        position: '',
        hire_date: ''
      })
    } catch (error: any) {
      console.error('Error adding employee:', error)
      setFormError(error.message || 'Failed to add employee')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredEmployees = employees.filter(emp =>
    emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AppLayout
        title="People"
        subtitle="Manage employees"
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
      title="People" 
      subtitle="Manage employees"
      userRole={userRole!}
      onLogout={logout}
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full text-white placeholder-gray-400 backdrop-blur-sm"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Employees Table */}
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
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Hire Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No employees found
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">
                          {employee.first_name} {employee.last_name}
                        </div>
                        <div className="text-sm text-gray-400">{employee.email}</div>
                        <div className="text-xs text-gray-500">{employee.employee_id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        employee.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(employee.hire_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Add Employee</h2>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={newEmployee.first_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={newEmployee.last_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={newEmployee.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Position</label>
                <input
                  type="text"
                  name="position"
                  value={newEmployee.position}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Hire Date</label>
                <input
                  type="date"
                  name="hire_date"
                  value={newEmployee.hire_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  required
                />
              </div>
              {formError && (
                <div className="text-red-400 text-sm">{formError}</div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-white"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  disabled={submitting}
                >
                  {submitting ? 'Adding...' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
