// API Route: /api/attendance/bulk
// POST request that handles bulk attendance upsert operations
// More efficient than individual POST/PUT calls for multiple records

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/attendance/bulk - Bulk upsert attendance records
// Request body: { records: attendance[] } - array of attendance records
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { records } = body

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: records array required' },
        { status: 400 }
      )
    }

    // Validate each record
    const requiredFields = ['employee_id', 'date', 'status', 'marked_by']
    for (const record of records) {
      const missingFields = requiredFields.filter(field => !record[field])
      if (missingFields.length > 0) {
        return NextResponse.json(
          { error: 'Missing required fields in record', missing: missingFields },
          { status: 400 }
        )
      }
    }

    // Prepare records for upsert
    const upsertData = records.map(record => ({
      employee_id: record.employee_id,
      date: record.date,
      status: record.status,
      check_in_time: record.check_in_time || null,
      check_out_time: record.check_out_time || null,
      notes: record.notes || null,
      marked_by: record.marked_by,
    }))

    // Bulk upsert using Supabase
    const { data, error } = await supabase
      .from('attendance')
      .upsert(upsertData, {
        onConflict: 'employee_id,date',
        ignoreDuplicates: false
      })
      .select()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to bulk upsert attendance records', details: error.message },
        { status: 500 }
      )
    }

    // Return upserted data
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
