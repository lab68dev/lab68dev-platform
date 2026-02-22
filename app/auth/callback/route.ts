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

    // Check if user profile exists (created by trigger on signup)
    console.log('🔍 Checking if user profile exists...')
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('id', user.id)
      .single()

    // Handle potential errors from the profile lookup
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('❌ Error checking if profile exists:', profileError)
      return NextResponse.redirect(
        `${origin}/login?error=profile_lookup_failed&message=${encodeURIComponent(profileError.message)}`
      )
    }

    if (!existingProfile) {
      console.log('👤 New user/No profile detected, creating default profile...')

      const userData = {
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
      }

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          name: userData.name,
          language: 'en',
          avatar: userData.avatar
        })

      if (insertError) {
        console.error('❌ Error creating profile:', insertError)
        return NextResponse.redirect(
          `${origin}/login?error=profile_creation_failed&message=${encodeURIComponent(insertError.message)}`
        )
      }
    }

    // User profile exists or was just created, redirect to dashboard
    console.log('✅ User profile ready, redirecting to dashboard')
    return NextResponse.redirect(`${origin}/dashboard`)

  } catch (error) {
    console.error('❌ Unexpected error in auth callback:', error)
    return NextResponse.redirect(`${origin}/login?error=server_error&message=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`)
  }
}
