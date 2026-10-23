import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vdoqwihhpdconsijmjxh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkb3F3aWhocGRjb25zaWptanhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4NTkyMjgsImV4cCI6MjEwNzQzNTIyOH0.ih4TURRsbR2NWi6rkrAsCRIEQFOUsIWfiCUrt4B4iQM'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

export default supabase
