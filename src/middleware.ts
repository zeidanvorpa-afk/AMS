// Next.js Middleware - Route protection and session management
// This middleware runs before every page request to check authentication
// It protects routes and manages user redirects based on authentication status

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Main middleware function - runs on every request
export async function middleware(req: NextRequest) {
  // Create the response object
  const res = NextResponse.next()

  // Create a Supabase server client for this request
  // Uses server-side Supabase client to read auth session from cookies
  const supabase = createServerClient(
    'https://vdoqwihhpdconsijmjxh.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkb3F3aWhocGRjb25zaWptanhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4NTkyMjgsImV4cCI6MjEwNzQzNTIyOH0.ih4TURRsbR2NWi6rkrAsCRIEQFOUsIWfiCUrt4B4iQM',
    {
      cookies: {
        // Custom cookie handlers to work with Next.js request/response
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
            path: '/',
          })
        },
        remove(name: string, options: any) {
          res.cookies.delete({
            name,
            ...options,
            path: '/',
          })
        },
      },
    }
  )

  // Get the current user's session from Supabase
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define protected routes that require authentication
  const protectedPaths = ['/dashboard', '/people', '/attendance', '/reports']
  const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))

  // If user tries to access a protected route without being logged in, redirect to login
  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If user is already logged in and tries to access login page, redirect to dashboard
  if (req.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Allow the request to proceed
  return res
}

// Middleware configuration - defines which routes the middleware should run on
export const config = {
  // Matcher pattern: runs on all routes except:
  // - API routes (handled separately)
  // - Static files (_next/static, _next/image)
  // - Favicon
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
