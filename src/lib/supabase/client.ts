import { createClient } from '@supabase/supabase-js'

let supabaseClient: ReturnType<typeof createClient> | null = null

export function createClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vdoqwihhpdconsijmjxh.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkb3F3aWhocGRjb25zaWptanhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4NTkyMjgsImV4cCI6MjEwNzQzNTIyOH0.ih4TURRsbR2NWi6rkrAsCRIEQFOUsIWfiCUrt4B4iQM',
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        }
      }
    )
  }
  return supabaseClient
}
