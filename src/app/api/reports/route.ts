// API Route: /api/reports
// GET request that returns attendance data for reports
// This is the backend API layer that aggregates data for the reports page

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Create a Supabase client with service role key for admin operations
// Uses environment variable to avoid hardcoding secrets
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || 'https://vdoqwihhpdconsijmjxh.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// GET /api/reports - Fetch attendance data for reports
// Query params: ?month=YYYY-MM (optional) - filter by month
// Query params: ?year=YYYY (optional) - filter by year
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')  // Format: YYYY-MM
    const year = searchParams.get('year')      // Format: YYYY

    // Build Supabase query using admin client to bypass RLS
    let query = supabaseAdmin
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

    // Add month filter if provided
    if (month) {
      query = query.like('date', `${month}%`)
    }

    // Add year filter if provided
    if (year) {
      query = query.like('date', `${year}%`)
    }

    // Order by date (newest first)
    query = query.order('date', { ascending: false })

    // Execute query
    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch report data', details: error.message },
        { status: 500 }
      )
    }

    // Calculate summary statistics
    const totalRecords = data?.length || 0
    const presentCount = data?.filter(a => a.status === 'present').length || 0
    const absentCount = data?.filter(a => a.status === 'absent').length || 0
    const lateCount = data?.filter(a => a.status === 'late').length || 0
    const excusedCount = data?.filter(a => a.status === 'excused').length || 0

    // Get unique employees in the dataset
    const uniqueEmployees = new Set(data?.map(a => a.employee_id))
    const employeeCount = uniqueEmployees.size

    // Calculate average attendance rate
    const averageRate = totalRecords > 0
      ? Math.round((presentCount / totalRecords) * 100)
      : 0

    // Get unique dates tracked
    const uniqueDates = new Set(data?.map(a => a.date))
    const daysTracked = uniqueDates.size

    // Return report data with summary statistics
    const reportData = {
      summary: {
        average_attendance_rate: averageRate,
        total_absences: absentCount,
        days_tracked: daysTracked,
        employee_count: employeeCount,
        total_records: totalRecords
      },
      records: data
    }

    return NextResponse.json({ data: reportData }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
