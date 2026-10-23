import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vdoqwihhpdconsijmjxh.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkb3F3aWhocGRjb25zaWptanhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4NTkyMjgsImV4cCI6MjEwNzQzNTIyOH0.ih4TURRsbR2NWi6rkrAsCRIEQFOUsIWfiCUrt4B4iQM'

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey)
}

// Export singleton instance
const supabase = createClient()
export default supabase
