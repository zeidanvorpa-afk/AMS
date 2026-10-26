import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  return createSupabaseClient(
    'https://vdoqwihhpdconsijmjxh.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkb3F3aWhocGRjb25zaWptanhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4NTkyMjgsImV4cCI6MjEwNzQzNTIyOH0.ih4TURRsbR2NWi6rkrAsCRIEQFOUsIWfiCUrt4B4iQM'
  )
}

export const supabaseAdmin = createSupabaseClient(
  'https://vdoqwihhpdconsijmjxh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkb3F3aWhocGRjb25zaWptanhoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTg1OTIyOCwiZXhwIjoyMTA3NDM1MjI4fQ.0K5Z8m7N6Q1Z8Q2Z8R8Q8Z8Q8Z8Q8Z8Q8Z8Q8Z8Q8Z8Q'
)
