import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password } = await request.json()

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Create user record in public.users table
    if (authData.user) {
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: email,
          full_name: fullName,
          role: 'user'
        })

      if (dbError) {
        console.error('Error creating user record:', dbError)
        // Don't fail signup if DB insert fails, user can still login
      }
    }

    return NextResponse.json({ success: true, user: authData.user })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
  }
}
