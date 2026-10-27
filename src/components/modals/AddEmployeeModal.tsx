'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Employee } from '@/types/database'

interface AddEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (employee: Omit<Employee, 'id' | 'created_at'>) => void
}

export default function AddEmployeeModal({ isOpen, onClose, onAdd }: AddEmployeeModalProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    position: '',
    hire_date: ''
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      employee_id: `EMP${Date.now()}`,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      department: formData.department,
      position: formData.position,
      hire_date: formData.hire_date,
      status: 'active'
    })
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      department: '',
      position: '',
      hire_date: ''
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999999] p-4">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-white mb-4 text-left">Add Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
              <input
                id="last_name"
                type="text"
                name="last_name"
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
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
            <input
              id="department"
              type="text"
              name="department"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Position</label>
            <input
              id="position"
              type="text"
              name="position"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Hire Date</label>
            <input
              id="hire_date"
              type="date"
              name="hire_date"
              value={formData.hire_date}
              onChange={(e) => setFormData({...formData, hire_date: e.target.value})}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
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
  )
}
