// API Route: /api/employees
// Handles GET (list employees) and POST (create employee) requests
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

// GET /api/employees - Fetch all employees with optional filtering
// Query params: ?status=active (optional) - filter by status
export async function GET(request: NextRequest) {
  try {
    // Get status filter from query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Build Supabase query
    let query = supabase.from('employees').select('*')

    // Add status filter if provided
    if (status) {
      query = query.eq('status', status)
    }

    // Order by last name alphabetically
    query = query.order('last_name', { ascending: true })

    // Execute query
    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch employees', details: error.message },
        { status: 500 }
      )
    }

    // Return employee data
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

// POST /api/employees - Create a new employee
// Request body: employee object with required fields
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['employee_id', 'first_name', 'last_name', 'email', 'department', 'position', 'hire_date']
    const missingFields = requiredFields.filter(field => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', missing: missingFields },
        { status: 400 }
      )
    }

    // Insert new employee into database using admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('employees')
      .insert({
        employee_id: body.employee_id,
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        department: body.department,
        position: body.position,
        hire_date: body.hire_date,
        status: body.status || 'active',  // Default to active if not provided
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create employee', details: error.message },
        { status: 500 }
      )
    }

    // Return created employee data
    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
