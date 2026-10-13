// Supabase client configuration
// This file exports a Supabase client instance for database operations
// Used by frontend components and API routes to interact with the database

import { createClient } from '@supabase/supabase-js'

// Supabase project URL - connects to the hosted PostgreSQL database
const supabaseUrl = 'https://vdoqwihhpdconsijmjxh.supabase.co'

// Supabase anonymous key - allows public access with RLS (Row Level Security) policies
// This key is safe to use in client-side code as it respects database security policies
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkb3F3aWhocGRjb25zaWptanhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4NTkyMjgsImV4cCI6MjEwNzQzNTIyOH0.ih4TURRsbR2NWi6rkrAsCRIEQFOUsIWfiCUrt4B4iQM'

// Create and export the Supabase client instance
// This client can be imported throughout the application for database operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
