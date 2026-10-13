// API Route: /api/dashboard/stats
// GET request that returns dashboard statistics (total employees, attendance rates, etc.)
// This is the backend API layer that aggregates data for the dashboard

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/dashboard/stats - Fetch dashboard statistics
// Returns aggregated attendance data for the current day
export async function GET(request: NextRequest) {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]

    // Get total number of active employees
    const { count: totalEmployees, error: employeesError } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    if (employeesError) {
      return NextResponse.json(
        { error: 'Failed to fetch employee count', details: employeesError.message },
        { status: 500 }
      )
    }

    // Get all attendance records for today
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('attendance')
      .select('status')
      .eq('date', today)

    if (attendanceError) {
      return NextResponse.json(
        { error: 'Failed to fetch attendance data', details: attendanceError.message },
        { status: 500 }
      )
    }

    // Calculate attendance statistics
    const present = attendanceData?.filter(a => a.status === 'present').length || 0
    const absent = attendanceData?.filter(a => a.status === 'absent').length || 0
    const late = attendanceData?.filter(a => a.status === 'late').length || 0
    const excused = attendanceData?.filter(a => a.status === 'excused').length || 0
    const expected = totalEmployees || 0
    const rate = expected > 0 ? Math.round((present / expected) * 100) : 0

    // Return aggregated statistics
    const stats = {
      total_employees: totalEmployees || 0,
      expected_today: expected,
      present_today: present,
      absent_today: absent,
      late_today: late,
      excused_today: excused,
      attendance_rate: rate
    }

    return NextResponse.json({ data: stats }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
