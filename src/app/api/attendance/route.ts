// API Route: /api/attendance
// Handles GET (list attendance records), POST (create attendance), and PUT (update attendance) requests
// This is the backend API layer that sits between the frontend and Supabase database

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Create a Supabase client with service role key for admin operations
// Uses environment variable to avoid hardcoding secrets
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || 'https://vdoqwihhpdconsijmjxh.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// GET /api/attendance - Fetch attendance records
// Query params: ?date=YYYY-MM-DD (optional) - filter by date
// Query params: ?employee_id=XXX (optional) - filter by employee
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const employeeId = searchParams.get('employee_id')

    // Build Supabase query
    let query = supabase.from('attendance').select('*')

    // Add date filter if provided
    if (date) {
      query = query.eq('date', date)
    }

    // Add employee filter if provided
    if (employeeId) {
      query = query.eq('employee_id', employeeId)
    }

    // Order by date (newest first)
    query = query.order('date', { ascending: false })

    // Execute query
    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch attendance records', details: error.message },
        { status: 500 }
      )
    }

    // Return attendance data
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

// POST /api/attendance - Create a new attendance record
// Request body: attendance object with required fields
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['employee_id', 'date', 'status', 'marked_by']
    const missingFields = requiredFields.filter(field => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', missing: missingFields },
        { status: 400 }
      )
    }

    // Insert new attendance record into database using admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('attendance')
      .insert({
        employee_id: body.employee_id,
        date: body.date,
        status: body.status,
        check_in_time: body.check_in_time || null,
        check_out_time: body.check_out_time || null,
        notes: body.notes || null,
        marked_by: body.marked_by,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create attendance record', details: error.message },
        { status: 500 }
      )
    }

    // Return created attendance data
    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

// PUT /api/attendance - Update an existing attendance record
// Request body: attendance object with updated fields (must include id)
export async function PUT(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      )
    }

    // Update attendance record in database using admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('attendance')
      .update({
        status: body.status,
        check_in_time: body.check_in_time,
        check_out_time: body.check_out_time,
        notes: body.notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update attendance record', details: error.message },
        { status: 500 }
      )
    }

    // Return updated attendance data
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
