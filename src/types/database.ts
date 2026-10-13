// TypeScript type definitions for the AMS database
// These interfaces define the structure of data tables in Supabase
// Using TypeScript ensures type safety throughout the application

// User role types - defines the three permission levels in the system
export type UserRole = 'admin' | 'manager' | 'user'

// Attendance status types - possible states for an employee's daily attendance
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

// User interface - represents the users table in the database
// Users are authenticated via Supabase Auth and have assigned roles
export interface User {
  id: string              // Unique user ID from Supabase Auth
  email: string           // User's email address
  full_name: string       // User's full name
  role: UserRole          // User's role (admin, manager, or user)
  created_at: string      // Timestamp when user was created
  updated_at: string      // Timestamp when user was last updated
}

// Employee interface - represents the employees table in the database
// Contains employee information for attendance tracking
export interface Employee {
  id: string              // Unique database ID
  employee_id: string     // Employee ID number (e.g., EMP001)
  first_name: string      // Employee's first name
  last_name: string       // Employee's last name
  email: string           // Employee's email address
  department: string      // Department the employee belongs to
  position: string        // Job title/position
  hire_date: string       // Date when employee was hired
  status: 'active' | 'inactive'  // Current employment status
  created_at: string      // Timestamp when record was created
  updated_at: string      // Timestamp when record was last updated
}

// Attendance interface - represents the attendance table in the database
// Records daily attendance for each employee
export interface Attendance {
  id: string              // Unique database ID
  employee_id: string     // Foreign key to employees table
  date: string            // Date of attendance record (YYYY-MM-DD)
  status: AttendanceStatus  // Attendance status for that day
  check_in_time: string | null   // Time employee checked in (optional)
  check_out_time: string | null  // Time employee checked out (optional)
  notes: string | null    // Additional notes about attendance (optional)
  marked_by: string       // ID of user who marked this attendance
  created_at: string      // Timestamp when record was created
  updated_at: string      // Timestamp when record was last updated
}

// AttendanceWithEmployee interface - extends Attendance with related data
// Used when joining attendance with employee and user tables
export interface AttendanceWithEmployee extends Attendance {
  employee: Employee      // Related employee data
  marked_by_user: User    // User who marked the attendance
}

// DashboardStats interface - statistics shown on the dashboard
// Aggregated data for the dashboard overview
export interface DashboardStats {
  total_employees: number    // Total number of employees in the system
  expected_today: number     // Number of active employees expected today
  present_today: number     // Number of employees marked present today
  absent_today: number      // Number of employees marked absent today
  late_today: number        // Number of employees marked late today
  attendance_rate: number   // Percentage of attendance rate (present/expected)
}
