'use client'

import { useAuth } from '@/contexts/AuthContext'
import AppLayout from '@/components/layout/AppLayout'
import { useState, useEffect } from 'react'
import supabase from '@/lib/supabase/client'
import { Employee } from '@/types/database'
import { Plus, Search, MoreVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PeoplePage() {
  const { user, userRole, logout } = useAuth()
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    position: '',
    hire_date: ''
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEmployees(data || [])
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert({
          employee_id: `EMP${Date.now()}`,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          department: formData.department,
          position: formData.position,
          hire_date: formData.hire_date,
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error

      setEmployees([data, ...employees])
      setShowAddModal(false)
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        department: '',
        position: '',
        hire_date: ''
      })
      alert('Employee added successfully!')
    } catch (error) {
      console.error('Error adding employee:', error)
      alert('Failed to add employee')
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
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500 w-full"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-start gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4 mt-0.5" />
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
            <tbody className="divide-y divide-white/5">
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
                    <td className="px-6 py-4 text-gray-400">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        employee.status === 'active' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(employee.hire_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl max-w-lg w-full p-6">
            <h2 className="text-xl font-semibold text-white mb-4 text-left">Add Employee</h2>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                  <input 
                    type="text" 
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
                <input 
                  type="text" 
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Position</label>
                <input 
                  type="text" 
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Hire Date</label>
                <input 
                  type="date" 
                  value={formData.hire_date}
                  onChange={(e) => setFormData({...formData, hire_date: e.target.value})}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-white/20 rounded-xl hover:bg-white/10 transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
