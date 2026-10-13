export type UserRole = 'admin' | 'manager' | 'user'

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Employee {
  id: string
  employee_id: string
  first_name: string
  last_name: string
  email: string
  department: string
  position: string
  hire_date: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  employee_id: string
  date: string
  status: AttendanceStatus
  check_in_time: string | null
  check_out_time: string | null
  notes: string | null
  marked_by: string
  created_at: string
  updated_at: string
}

export interface AttendanceWithEmployee extends Attendance {
  employee: Employee
  marked_by_user: User
}

export interface DashboardStats {
  total_employees: number
  expected_today: number
  present_today: number
  absent_today: number
  late_today: number
  attendance_rate: number
}
