import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// POST - Bulk upsert attendance records
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { records } = body

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: 'Invalid records format' }, { status: 400 })
    }

    // Transform records to use UUID for employee_id (foreign key)
    const transformedRecords = records.map(record => ({
      ...record,
      employee_id: record.employee_id // Already UUID from frontend
    }))

    // Bulk upsert attendance records
    const { data, error } = await supabaseAdmin
      .from('attendance')
      .upsert(transformedRecords, {
        onConflict: 'employee_id,date',
        ignoreDuplicates: false
      })
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error bulk upserting attendance:', error)
    return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 })
  }
}
