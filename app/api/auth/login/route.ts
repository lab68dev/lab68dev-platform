import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { loginRateLimit, clearRateLimit } from '@/lib/utils/rate-limiter'
import { verifyMFAToken } from '@/lib/utils/mfa'
import { sendSecurityNotification } from '@/lib/utils/security-notifications'
import { createSession, detectSuspiciousActivity, type UserSession } from '@/lib/utils/session-manager'
import bcrypt from 'bcryptjs'

// TODO: Replace with your actual database client
// import { db } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // 1. Rate limiting - Prevent brute force attacks
    const rateLimitResult = await loginRateLimit(request)

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Too many login attempts. Your account has been temporarily locked.',
          lockedUntil: rateLimitResult.lockedUntil,
          resetTime: rateLimitResult.resetTime,
        },
        { status: 429 }
      )
    }

    // 2. Parse credentials
    const body = await request.json()
    const { email, password, mfaToken } = body

    // 3. Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // 4. Find user by email
    // TODO: Replace with your database query
    // const user = await db.users.findUnique({
    //   where: { email: email.toLowerCase() }
    // })

    // Mock user for demonstration
    const user = {
      id: 'user_123',
      email: email.toLowerCase(),
      name: 'Demo User',
      password: await bcrypt.hash('password123', 12), // Replace with actual hashed password from DB
      mfaEnabled: false,
      mfaSecret: null,
      lastLoginAt: null,
      lastLoginIP: null,
      lastLoginLocation: null,
    }

    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // 5. Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      // Send notification after multiple failed attempts
      if (rateLimitResult.remaining <= 2) {
        await sendSecurityNotification({
          type: 'failed_login',
          userEmail: user.email,
          userName: user.name,
          details: {
            ipAddress: ip,
            location: 'Unknown', // TODO: Add IP geolocation
            device: userAgent,
            timestamp: new Date().toISOString(),
            attemptsRemaining: rateLimitResult.remaining,
          },
        })
      }

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // 6. Check if MFA is required
    if (user.mfaEnabled) {
      if (!mfaToken) {
        return NextResponse.json(
          {
            requireMFA: true,
            message: 'Please enter your two-factor authentication code',
          },
          { status: 403 }
        )
      }

      // Verify MFA token
      const mfaValid = verifyMFAToken(user.mfaSecret!, mfaToken)

      if (!mfaValid.valid) {
        return NextResponse.json(
          { error: 'Invalid MFA code. Please try again.' },
          { status: 401 }
        )
      }
    }

    // 7. Create session
    const session = createSession(
      user.id,
      userAgent,
      ip,
      7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    )

    // 8. Check for suspicious activity
    // TODO: Fetch all user sessions from database
    // const allUserSessions = await db.sessions.findMany({
    //   where: { userId: user.id, isActive: true }
    // })

    const allUserSessions: UserSession[] = [] // Mock empty sessions

    // Only check for suspicious activity if there's a previous session
    if (allUserSessions.length > 0) {
      const previousSession = allUserSessions[0]
      // Add location to current session for suspicious activity check
      const sessionWithLocation: UserSession = {
        ...session,
        location: {
          ip: ip,
          country: undefined,
          city: undefined
        },
        isActive: true,
        isCurrent: true
      }

      const suspiciousFlags = detectSuspiciousActivity(sessionWithLocation, previousSession)

      if (suspiciousFlags.suspicious && suspiciousFlags.reasons.length > 0) {
        await sendSecurityNotification({
          type: 'suspicious_activity',
          userEmail: user.email,
          userName: user.name,
          details: {
            reason: suspiciousFlags.reasons.join(', '),
            ipAddress: ip,
            location: 'Unknown',
            device: `${session.deviceInfo.browser} on ${session.deviceInfo.os}`,
            timestamp: new Date().toISOString(),
          },
        })
      }
    }

    // 9. Save session to database
    // TODO: Replace with your database query
    // await db.sessions.create({
    //   data: {
    //     id: session.id,
    //     userId: session.userId,
    //     deviceInfo: session.deviceInfo,
    //     location: session.location,
    //     ipAddress: session.ipAddress,
    //     createdAt: session.createdAt,
    //     lastActivity: session.lastActivity,
    //     expiresAt: session.expiresAt,
    //     isActive: true,
    //   }
    // })

    // 10. Clear rate limit on successful login
    await clearRateLimit(request, () => `login:${ip}`)

    // 11. Send login notification
    await sendSecurityNotification({
      type: 'login',
      userEmail: user.email,
      userName: user.name,
      details: {
        ipAddress: ip,
        location: 'Unknown',
        device: `${session.deviceInfo.browser} on ${session.deviceInfo.os}`,
        timestamp: new Date().toISOString(),
      },
    })

    // 12. Update last login information
    // TODO: Replace with your database query
    // await db.users.update({
    //   where: { id: user.id },
    //   data: {
    //     lastLoginAt: new Date(),
    //     lastLoginIP: ip,
    //     lastLoginLocation: 'Unknown',
    //   }
    // })

    // 13. Set session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })

    response.cookies.set('sessionToken', session.id, {
      httpOnly: true,  // Prevent XSS attacks
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax', // CSRF protection
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    )
  }
}
