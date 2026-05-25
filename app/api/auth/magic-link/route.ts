import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { loginRateLimit } from '@/lib/utils/rate-limiter'

function isValidEmail(email: string) {
  const atIndex = email.lastIndexOf('@')

  return (
    atIndex > 0 &&
    atIndex < email.length - 3 &&
    !email.includes(' ') &&
    email.slice(atIndex + 1).includes('.')
  )
}

function getRequestOrigin(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto')

  if (forwardedHost) {
    return `${forwardedProto || 'https'}://${forwardedHost}`
  }

  return new URL(request.url).origin
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await loginRateLimit(request)

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Too many magic link requests. Please try again later.',
          lockedUntil: rateLimitResult.lockedUntil,
          resetTime: rateLimitResult.resetTime,
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase public configuration for magic link auth')
      return NextResponse.json(
        { error: 'Authentication is not configured. Please contact support.' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const origin = getRequestOrigin(request)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Magic link auth error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Check your email for the magic link.',
    })
  } catch (error) {
    console.error('Magic link route error:', error)
    return NextResponse.json(
      { error: 'Unable to send magic link. Please try again.' },
      { status: 500 }
    )
  }
}
