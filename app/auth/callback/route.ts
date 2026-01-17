import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  console.log('🔐 Auth callback triggered with code:', code ? 'present' : 'missing')

  if (!code) {
    console.error('❌ No authorization code received')
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  try {
    const cookieStore = await cookies()
    
    // Create server-side Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    console.log('🔄 Exchanging code for session...')
    
    // Exchange code for session
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError) {
      console.error('❌ Error exchanging code for session:', sessionError)
      return NextResponse.redirect(`${origin}/login?error=auth_failed&message=${encodeURIComponent(sessionError.message)}`)
    }

    if (!session?.user) {
      console.error('❌ No session or user after exchange')
      return NextResponse.redirect(`${origin}/login?error=no_session`)
    }

    const user = session.user
    console.log('✅ Session created for user:', user.email)

    // Check if this is a new user (first time signing in with Google)
    console.log('🔍 Checking if user exists in database...')
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', user.email)
      .single()

    // If user doesn't exist in our users table, redirect to signup to complete profile
    if (!existingUser) {
      console.log('👤 New user detected, redirecting to signup...')
      
      const userData = {
        email: user.email,
        name: user.user_metadata.full_name || user.user_metadata.name || '',
        avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture || '',
        provider: 'google'
      }

      // Redirect to signup with user data as query params
      const signupUrl = new URL('/signup', origin)
      signupUrl.searchParams.set('google', 'true')
      signupUrl.searchParams.set('email', userData.email || '')
      signupUrl.searchParams.set('name', userData.name)
      if (userData.avatar_url) {
        signupUrl.searchParams.set('avatar', userData.avatar_url)
      }

      return NextResponse.redirect(signupUrl.toString())
    }

    // User exists, redirect to dashboard
    console.log('✅ Existing user found, redirecting to dashboard')
    return NextResponse.redirect(`${origin}/dashboard`)

  } catch (error) {
    console.error('❌ Unexpected error in auth callback:', error)
    return NextResponse.redirect(`${origin}/login?error=server_error&message=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`)
  }
}
