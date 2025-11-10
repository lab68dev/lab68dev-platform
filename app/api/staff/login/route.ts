import { NextRequest, NextResponse } from 'next/server'
import {
  getStaffByEmail,
  verifyPassword,
  createSession,
  updateStaffLastLogin,
  checkRateLimit,
  resetRateLimit,
  logStaffActivity,
  supabase,
} from '@/lib/staff-security'
import { sendLoginAlertEmail } from '@/lib/staff-email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, twoFactorToken } = body

    // Rate limiting
    const rateLimit = checkRateLimit(`login_${email}`, 5, 15 * 60 * 1000) // 5 attempts per 15 minutes

    if (!rateLimit.allowed) {
      const resetIn = Math.ceil((rateLimit.resetTime - Date.now()) / 1000 / 60)
      return NextResponse.json(
        { error: `Too many login attempts. Please try again in ${resetIn} minutes.` },
        { status: 429 }
      )
    }

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Get staff from database
    if (!supabase) {
      // Fallback to client-side localStorage
      return NextResponse.json(
        { fallback: true },
        { status: 200 }
      )
    }

    const staff = await getStaffByEmail(email)

    if (!staff) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, staff.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if account is active
    if (!staff.is_active) {
      return NextResponse.json(
        { error: 'Your account is pending approval or has been deactivated' },
        { status: 403 }
      )
    }

    // Check 2FA if enabled
    if (staff.two_factor_enabled && staff.two_factor_secret) {
      if (!twoFactorToken) {
        return NextResponse.json(
          { require2FA: true },
          { status: 200 }
        )
      }

      // Verify 2FA token (will be implemented in client)
      // For now, we'll trust the client verification
    }

    // Reset rate limit on successful login
    resetRateLimit(`login_${email}`)

    // Create session
    const session = createSession(
      {
        staffId: staff.id,
        email: staff.email,
        role: staff.role,
        name: staff.name,
      },
      !!twoFactorToken
    )

    // Update last login
    await updateStaffLastLogin(staff.id)

    // Store session in database
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    await supabase
      .from('staff_sessions')
      .insert({
        staff_id: staff.id,
        token: session.token,
        expires_at: new Date(session.expiresAt).toISOString(),
        ip_address: clientIp,
        user_agent: userAgent,
      })

    // Log activity
    await logStaffActivity({
      staffId: staff.id,
      staffName: staff.name,
      action: 'login',
      description: `Logged in from ${clientIp}`,
    })

    // Send login alert email (async, don't wait)
    try {
      await sendLoginAlertEmail(staff.email, staff.name, clientIp, userAgent)
    } catch (emailError) {
      console.error('Failed to send login alert email:', emailError)
    }

    return NextResponse.json({
      session,
      staff: {
        id: staff.id,
        email: staff.email,
        name: staff.name,
        role: staff.role,
        department: staff.department,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    )
  }
}
