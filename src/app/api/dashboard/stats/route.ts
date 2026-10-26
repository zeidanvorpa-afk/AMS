import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET - Dashboard statistics
export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]

    // Get total active employees
    const { count: totalEmployees } = await supabaseAdmin
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get today's attendance
    const { data: attendanceData } = await supabaseAdmin
      .from('attendance')
      .select('status')
      .eq('date', today)

    const present = attendanceData?.filter(a => a.status === 'present').length || 0
    const absent = attendanceData?.filter(a => a.status === 'absent').length || 0
    const late = attendanceData?.filter(a => a.status === 'late').length || 0
    const expected = totalEmployees || 0
    const rate = expected > 0 ? Math.round((present / expected) * 100) : 0

    const stats = {
      total_employees: totalEmployees || 0,
      expected_today: expected,
      present_today: present,
      absent_today: absent,
      late_today: late,
      attendance_rate: rate
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}
