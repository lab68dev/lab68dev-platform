# 🔐 Lab68 Platform - Complete Security Implementation Guide

## Overview

This guide documents the comprehensive production-ready security features implemented in the Lab68 Dev Platform to protect user accounts from hijacking, brute force attacks, and unauthorized access.

**Last Updated**: January 2026 | **Version**: 2.0.0

---

## 📦 Installed Security Packages

```bash
pnpm add zxcvbn speakeasy qrcode bcryptjs
pnpm add -D @types/bcryptjs @types/qrcode
```

### Package Details
- **zxcvbn** (4.4.2): Password strength analysis (Dropbox library)
- **speakeasy**: TOTP-based 2FA/MFA implementation
- **qrcode**: QR code generation for authenticator apps
- **bcryptjs**: Secure password hashing with salt

---

## 🛡️ Implemented Security Features

### 1. Password Security ✅

#### Strong Password Requirements
```typescript
// Enforced Requirements:
- Minimum 12 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*...)
```

#### Password Strength Validation

**File:** [lib/utils/password-validator.ts](../lib/utils/password-validator.ts)

```typescript
import { validatePasswordStrength } from '@/lib/utils/password-validator'

const result = await validatePasswordStrength('MyP@ssw0rd123', ['user@email.com'])

// Returns:
{
  score: 3,              // 0-4 (Very Weak to Very Strong)
  label: 'Strong',
  color: 'text-green-600',
  feedback: {
    warning: '',
    suggestions: ['Add another word or two...'],
  },
  crackTime: '3 days',
  requirements: {
    length: true,
    uppercase: true,
    lowercase: true,
    number: true,
    specialChar: true,
  }
}
```

**Functions:**
- `validatePasswordStrength()` - Uses zxcvbn for strength analysis
- `getPasswordStrengthLabel()` - Returns human-readable label
- `getPasswordStrengthColor()` - Returns Tailwind color class
- `validatePasswordRequirements()` - Checks all 5 requirements
- `checkPasswordBreach()` - Placeholder for Have I Been Pwned API

---

#### Password Strength UI Component

**File:** [components/password-strength-indicator.tsx](../components/password-strength-indicator.tsx)

```tsx
import { PasswordStrengthIndicator } from '@/components/password-strength-indicator'

<PasswordStrengthIndicator 
  password={password}
  userInputs={[email, username]}
  showRequirements={true}
  className="mt-2"
/>
```

**Features:**
- ✅ Real-time strength analysis
- ✅ Color-coded progress bar (red → green)
- ✅ Strength label (Very Weak → Very Strong)
- ✅ Crack time estimation
- ✅ 5-item requirements checklist with Heroicons
- ✅ Live feedback warnings and suggestions
- ✅ Smooth transitions and animations

---

### 2. Rate Limiting & Account Lockout ✅

**File:** [lib/utils/rate-limiter.ts](../lib/utils/rate-limiter.ts)

Protection against brute force attacks with in-memory storage (upgradeable to Redis).

#### Preset Rate Limiters

```typescript
// Login Protection
loginRateLimit: {
  max: 5 attempts,
  window: 15 minutes,
  lockoutDuration: 30 minutes,
  message: "Too many login attempts. Account locked for 30 minutes."
}

// Signup Protection  
signupRateLimit: {
  max: 3 attempts,
  window: 1 hour,
  lockoutDuration: 1 hour,
  message: "Too many signup attempts."
}

// Password Reset Protection
passwordResetRateLimit: {
  max: 3 attempts,
  window: 1 hour,
  lockoutDuration: 2 hours,
  message: "Too many password reset requests."
}

// API Protection
apiRateLimit: {
  max: 100 requests,
  window: 15 minutes,
  message: "Too many API requests."
}
```

#### Usage Example

```typescript
import { loginRateLimit, clearRateLimit } from '@/lib/utils/rate-limiter'

// In your API route (app/api/auth/login/route.ts)
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  
  // Check rate limit
  const rateLimitResult = await loginRateLimit(request)
  
  if (!rateLimitResult.allowed) {
    return Response.json({
      error: 'Too many login attempts',
      lockedUntil: rateLimitResult.lockedUntil,
      resetTime: rateLimitResult.resetTime,
    }, { status: 429 })
  }

  // Attempt authentication
  const user = await authenticateUser(email, password)
  
  if (!user) {
    // Failed login - rate limit stays
    return Response.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  // Successful login - clear rate limit
  await clearRateLimit(`login:${ip}`)
  
  return Response.json({ success: true, user })
}
```

#### Functions
- `rateLimit(options)` - Create custom rate limiter middleware
- `loginRateLimit(request)` - Preset for login endpoints
- `signupRateLimit(request)` - Preset for signup endpoints  
- `passwordResetRateLimit(request)` - Preset for password reset
- `apiRateLimit(request)` - Preset for general API routes
- `clearRateLimit(key)` - Clear rate limit after success
- `getRateLimitStatus(key)` - Check current status

#### Auto-Cleanup
- In-memory store automatically cleaned every 5 minutes
- Expired entries removed to prevent memory leaks
- Production: Upgrade to Redis for multi-server support

---

### 3. Multi-Factor Authentication (MFA/2FA) ✅

**File:** [lib/utils/mfa.ts](../lib/utils/mfa.ts)

TOTP-based two-factor authentication compatible with Google Authenticator, Authy, Microsoft Authenticator.

#### Enable MFA for User

```typescript
import { generateMFASecret } from '@/lib/utils/mfa'

// When user enables 2FA
const mfaData = await generateMFASecret('user@email.com')

// Save to database
await db.users.update({
  where: { id: userId },
  data: {
    mfaSecret: mfaData.secret,          // Base32 secret
    mfaBackupCodes: mfaData.backupCodes, // 8 codes
    mfaEnabled: true,
  }
})

// Return to user
return {
  qrCode: mfaData.qrCode,              // Data URL for QR image
  backupCodes: mfaData.backupCodes,     // ["ABCD-1234", ...]
  secret: mfaData.secret                // For manual entry
}
```

#### Verify MFA Token

```typescript
import { verifyMFAToken } from '@/lib/utils/mfa'

// User submits 6-digit code
const { valid, delta } = verifyMFAToken(user.mfaSecret, userToken)

if (valid) {
  // ✅ Token valid - proceed with login
  console.log(`Token valid (time delta: ${delta} steps)`)
} else {
  // ❌ Invalid token
  return Response.json({ error: 'Invalid MFA code' }, { status: 401 })
}
```

#### Verify Backup Code

```typescript
import { verifyBackupCode } from '@/lib/utils/mfa'

const result = verifyBackupCode(user.mfaBackupCodes, userBackupCode)

if (result.valid) {
  // Update database - remove used code
  await db.users.update({
    where: { id: userId },
    data: { mfaBackupCodes: result.remainingCodes }
  })
  
  // ✅ Backup code valid - proceed
  console.log(`${result.remainingCodes.length} backup codes remaining`)
}
```

#### Risk-Based MFA

```typescript
import { shouldRequireMFA } from '@/lib/utils/mfa'

const context = {
  ipAddress: '203.0.113.1',
  deviceFingerprint: 'Chrome-Windows-Desktop',
  location: 'New York, USA',
  lastLoginTime: user.lastLoginAt,
  lastLoginIP: user.lastLoginIP,
  lastLoginLocation: user.lastLoginLocation,
}

if (shouldRequireMFA(context)) {
  // 🔐 Require MFA for this login
  return { requireMFA: true }
}
```

**Risk Triggers:**
- New IP address
- New device fingerprint
- New geographic location
- Hasn't logged in for 30+ days

#### Regenerate Backup Codes

```typescript
import { regenerateBackupCodes } from '@/lib/utils/mfa'

const newCodes = regenerateBackupCodes()

await db.users.update({
  where: { id: userId },
  data: { mfaBackupCodes: newCodes }
})
```

#### Functions
- `generateMFASecret(email)` - Create secret + QR + backup codes
- `verifyMFAToken(secret, token)` - Validate 6-digit TOTP code
- `verifyBackupCode(codes, input)` - Validate & remove backup code
- `regenerateBackupCodes()` - Generate 8 new backup codes
- `shouldRequireMFA(context)` - Risk-based MFA requirement
- `getTokenTimeRemaining(secret)` - Seconds until token expires

---

### 4. Security Notifications ✅

**File:** [lib/utils/security-notifications.ts](../lib/utils/security-notifications.ts)

Automated email alerts for security events with professional HTML templates.

#### Supported Event Types

```typescript
type SecurityEventType =
  | 'login'                  // New login
  | 'password_change'        // Password changed
  | 'email_change'           // Email changed
  | 'mfa_enabled'            // 2FA enabled
  | 'mfa_disabled'           // 2FA disabled
  | 'failed_login'           // Multiple failed attempts
  | 'account_locked'         // Account locked due to rate limit
  | 'new_device'             // Login from new device
  | 'suspicious_activity'    // Suspicious activity detected
```

#### Send Security Notification

```typescript
import { sendSecurityNotification } from '@/lib/utils/security-notifications'

// After successful login
await sendSecurityNotification({
  type: 'login',
  userEmail: 'user@example.com',
  userName: 'John Doe',
  details: {
    ipAddress: request.headers.get('x-forwarded-for'),
    location: 'New York, USA',
    device: 'Chrome on Windows',
    timestamp: new Date().toISOString(),
  }
})

// After password change
await sendSecurityNotification({
  type: 'password_change',
  userEmail: user.email,
  userName: user.name,
  details: {
    ipAddress: ip,
    timestamp: new Date().toISOString(),
  }
})

// Suspicious activity
await sendSecurityNotification({
  type: 'suspicious_activity',
  userEmail: user.email,
  userName: user.name,
  details: {
    reason: 'Impossible travel detected',
    ipAddress: newIP,
    location: newLocation,
    previousIP: lastIP,
    previousLocation: lastLocation,
    timestamp: new Date().toISOString(),
  }
})
```

#### Email Templates

**Professional HTML emails with:**
- ✅ Lab68 branding with green gradient header
- ✅ Event-specific icons and styling
- ✅ Event details table (time, location, IP, device)
- ✅ Action buttons ("Review Security Settings")
- ✅ Security tips and warnings
- ✅ Plain text fallback

#### Batch Notifications

```typescript
import { sendBatchNotifications } from '@/lib/utils/security-notifications'

await sendBatchNotifications([
  {
    type: 'login',
    userEmail: 'user1@example.com',
    userName: 'User 1',
    details: { /* ... */ }
  },
  {
    type: 'mfa_enabled',
    userEmail: 'user2@example.com',
    userName: 'User 2',
    details: { /* ... */ }
  }
])
```

#### Functions
- `sendSecurityNotification(event)` - Send single email
- `generateEmailContent(event)` - Generate HTML + plain text
- `sendBatchNotifications(events)` - Send multiple emails
- `formatEventDetails(details)` - Format details for display

#### Integration Required
```typescript
// Replace placeholder in lib/utils/security-notifications.ts
// Option 1: SendGrid
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

// Option 2: AWS SES
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

// Option 3: Resend
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
```

---

### 5. Session Management ✅

**File:** [lib/utils/session-manager.ts](../lib/utils/session-manager.ts)

Track and manage user sessions across multiple devices.

#### Create Session

```typescript
import { createSession } from '@/lib/utils/session-manager'

const session = await createSession(
  userId,
  request.headers.get('user-agent'),
  request.headers.get('x-forwarded-for'),
  { expiresInDays: 7 }
)

// Save to database
await db.sessions.create({
  data: {
    id: session.id,
    userId: session.userId,
    deviceInfo: session.deviceInfo,
    location: session.location,
    ipAddress: session.ipAddress,
    expiresAt: session.expiresAt,
  }
})

// Return session token
return { sessionToken: session.id }
```

#### Update Session Activity

```typescript
import { updateSessionActivity } from '@/lib/utils/session-manager'

const updatedSession = updateSessionActivity(currentSession)

await db.sessions.update({
  where: { id: sessionId },
  data: { lastActivity: updatedSession.lastActivity }
})
```

#### Detect Suspicious Activity

```typescript
import { detectSuspiciousActivity } from '@/lib/utils/session-manager'

const suspiciousFlags = detectSuspiciousActivity(
  currentSession,
  allUserSessions
)

if (suspiciousFlags.length > 0) {
  // Send alert
  await sendSecurityNotification({
    type: 'suspicious_activity',
    userEmail: user.email,
    userName: user.name,
    details: {
      reason: suspiciousFlags.join(', '),
      ipAddress: currentSession.ipAddress,
      location: currentSession.location,
      device: currentSession.deviceInfo.browser,
      timestamp: new Date().toISOString(),
    }
  })
}
```

**Detects:**
- 🚨 Impossible travel (new location + short time interval)
- ⚠️ Device changes (different browser/OS/device type)
- 📍 Country changes

#### Logout All Devices

```typescript
import { invalidateSession } from '@/lib/utils/session-manager'

// Logout all user sessions
const userSessions = await db.sessions.findMany({ where: { userId } })

for (const session of userSessions) {
  const invalidated = invalidateSession(session)
  await db.sessions.update({
    where: { id: session.id },
    data: { isActive: false }
  })
}
```

#### Display Sessions to User

```typescript
import { formatSessionDisplay } from '@/lib/utils/session-manager'

const sessions = await db.sessions.findMany({ where: { userId } })

const displaySessions = sessions.map(formatSessionDisplay)

// Returns user-friendly format:
{
  id: 'session_123',
  device: 'Chrome on Windows',
  location: 'New York, USA',
  lastActive: '2 hours ago',
  isCurrent: true,
  isExpired: false
}
```

#### Functions
- `createSession(userId, userAgent, ip, options)` - Create new session
- `isSessionExpired(session)` - Check if expired
- `updateSessionActivity(session)` - Update last activity time
- `invalidateSession(session)` - Logout session
- `detectSuspiciousActivity(session, allSessions)` - Fraud detection
- `formatSessionDisplay(session)` - UI-friendly format
- `parseUserAgent(userAgent)` - Extract browser/OS/device
- `getLocationFromIP(ip)` - Get location (placeholder for API)

#### Session Data Structure

```typescript
interface UserSession {
  id: string
  userId: string
  deviceInfo: {
    browser: string    // "Chrome", "Firefox", "Safari"
    os: string         // "Windows", "macOS", "Linux"
    device: string     // "Desktop", "Mobile", "Tablet"
  }
  location: string     // "New York, USA"
  ipAddress: string
  createdAt: Date
  lastActivity: Date
  expiresAt: Date
  isActive: boolean
  isCurrent?: boolean
}
```

---

## 2. JWT Session Management

### JWT Implementation

**File:** `lib/staff-security.ts`

```typescript
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRY = '24h'

interface JWTPayload {
  staffId: string
  email: string
  role: 'admin' | 'support' | 'moderator'
  name: string
}## 🔧 Complete Integration Examples

### Example 1: Secure Signup Flow

**File:** `app/api/auth/signup/route.ts`

```typescript
import { signupRateLimit } from '@/lib/utils/rate-limiter'
import { validatePasswordStrength } from '@/lib/utils/password-validator'
import { sendSecurityNotification } from '@/lib/utils/security-notifications'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  // 1. Rate limiting
  const rateLimitResult = await signupRateLimit(request)
  if (!rateLimitResult.allowed) {
    return Response.json(
      { error: 'Too many signup attempts' },
      { status: 429 }
    )
  }

  // 2. Parse request body
  const { email, password, name } = await request.json()

  // 3. Validate password strength
  const passwordValidation = await validatePasswordStrength(password, [email, name])
  
  if (passwordValidation.score < 3) {
    return Response.json(
      { 
        error: 'Password too weak',
        feedback: passwordValidation.feedback,
        requirements: passwordValidation.requirements
      },
      { status: 400 }
    )
  }

  // 4. Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // 5. Create user in database
  const user = await db.users.create({
    data: {
      email,
      name,
      password: hashedPassword,
      mfaEnabled: false,
    }
  })

  // 6. Send welcome email (optional)
  await sendSecurityNotification({
    type: 'login',
    userEmail: user.email,
    userName: user.name,
    details: {
      ipAddress: request.headers.get('x-forwarded-for'),
      device: request.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
    }
  })

  return Response.json({ success: true, userId: user.id })
}
```

---

### Example 2: Secure Login Flow with MFA

**File:** `app/api/auth/login/route.ts`

```typescript
import { loginRateLimit, clearRateLimit } from '@/lib/utils/rate-limiter'
import { verifyMFAToken } from '@/lib/utils/mfa'
import { sendSecurityNotification } from '@/lib/utils/security-notifications'
import { createSession, detectSuspiciousActivity } from '@/lib/utils/session-manager'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  // 1. Rate limiting
  const rateLimitResult = await loginRateLimit(request)
  if (!rateLimitResult.allowed) {
    return Response.json(
      { error: 'Too many login attempts. Account locked.' },
      { status: 429 }
    )
  }

  // 2. Parse credentials
  const { email, password, mfaToken } = await request.json()

  // 3. Find user
  const user = await db.users.findUnique({ where: { email } })
  if (!user) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  // 4. Verify password
  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) {
    // Send failed login notification after 3 attempts
    const failedAttempts = rateLimitResult.remaining === 2
    if (failedAttempts) {
      await sendSecurityNotification({
        type: 'failed_login',
        userEmail: user.email,
        userName: user.name,
        details: {
          ipAddress: ip,
          device: userAgent,
          timestamp: new Date().toISOString(),
        }
      })
    }
    return Response.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  // 5. Check if MFA is required
  if (user.mfaEnabled) {
    if (!mfaToken) {
      return Response.json({ requireMFA: true }, { status: 403 })
    }

    const mfaValid = verifyMFAToken(user.mfaSecret!, mfaToken)
    if (!mfaValid.valid) {
      return Response.json({ error: 'Invalid MFA code' }, { status: 401 })
    }
  }

  // 6. Create session
  const session = await createSession(user.id, userAgent, ip, { expiresInDays: 7 })

  // 7. Check for suspicious activity
  const allUserSessions = await db.sessions.findMany({
    where: { userId: user.id, isActive: true }
  })
  
  const suspiciousFlags = detectSuspiciousActivity(session, allUserSessions)
  if (suspiciousFlags.length > 0) {
    await sendSecurityNotification({
      type: 'suspicious_activity',
      userEmail: user.email,
      userName: user.name,
      details: {
        reason: suspiciousFlags.join(', '),
        ipAddress: session.ipAddress,
        location: session.location,
        device: `${session.deviceInfo.browser} on ${session.deviceInfo.os}`,
        timestamp: new Date().toISOString(),
      }
    })
  }

  // 8. Save session to database
  await db.sessions.create({
    data: {
      id: session.id,
      userId: session.userId,
      deviceInfo: session.deviceInfo,
      location: session.location,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity,
      expiresAt: session.expiresAt,
      isActive: true,
    }
  })

  // 9. Clear rate limit on successful login
  await clearRateLimit(`login:${ip}`)

  // 10. Send login notification
  await sendSecurityNotification({
    type: 'login',
    userEmail: user.email,
    userName: user.name,
    details: {
      ipAddress: session.ipAddress,
      location: session.location,
      device: `${session.deviceInfo.browser} on ${session.deviceInfo.os}`,
      timestamp: new Date().toISOString(),
    }
  })

  // 11. Update last login
  await db.users.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
      lastLoginIP: session.ipAddress,
      lastLoginLocation: session.location,
    }
  })

  return Response.json({
    success: true,
    sessionToken: session.id,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  })
}
```

---

### Example 3: Enable MFA Endpoint

**File:** `app/api/auth/mfa/enable/route.ts`

```typescript
import { generateMFASecret } from '@/lib/utils/mfa'
import { sendSecurityNotification } from '@/lib/utils/security-notifications'

export async function POST(request: Request) {
  // Assume user is authenticated via middleware
  const userId = request.headers.get('x-user-id')
  
  const user = await db.users.findUnique({ where: { id: userId } })
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Generate MFA secret and QR code
  const mfaData = await generateMFASecret(user.email)

  // Save to database
  await db.users.update({
    where: { id: user.id },
    data: {
      mfaSecret: mfaData.secret,
      mfaBackupCodes: mfaData.backupCodes,
      mfaEnabled: true,
    }
  })

  // Send notification
  await sendSecurityNotification({
    type: 'mfa_enabled',
    userEmail: user.email,
    userName: user.name,
    details: {
      ipAddress: request.headers.get('x-forwarded-for'),
      timestamp: new Date().toISOString(),
    }
  })

  return Response.json({
    success: true,
    qrCode: mfaData.qrCode,
    backupCodes: mfaData.backupCodes,
    secret: mfaData.secret,
  })
}
```

---

### Example 4: Security Settings Page

**File:** `app/dashboard/settings/security/page.tsx`

```tsx
'use client'

import { useState } from 'react'
import { PasswordStrengthIndicator } from '@/components/password-strength-indicator'
import { ShieldCheckIcon, DevicePhoneMobileIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'

export default function SecuritySettingsPage() {
  const [password, setPassword] = useState('')
  const [sessions, setSessions] = useState([])
  const [mfaEnabled, setMfaEnabled] = useState(false)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Change Password */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <ShieldCheckIcon className="w-6 h-6 text-green-600" />
          Change Password
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <PasswordStrengthIndicator
              password={password}
              showRequirements={true}
              className="mt-2"
            />
          </div>
          
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Update Password
          </button>
        </div>
      </section>

      {/* Two-Factor Authentication */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <DevicePhoneMobileIcon className="w-6 h-6 text-blue-600" />
          Two-Factor Authentication
        </h2>
        
        {mfaEnabled ? (
          <div className="space-y-4">
            <p className="text-green-600 font-medium">
              ✅ Two-factor authentication is enabled
            </p>
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Disable 2FA
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              Add an extra layer of security to your account
            </p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Enable 2FA
            </button>
          </div>
        )}
      </section>

      {/* Active Sessions */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <ComputerDesktopIcon className="w-6 h-6 text-purple-600" />
          Active Sessions
        </h2>
        
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{session.device}</p>
                <p className="text-sm text-gray-600">{session.location}</p>
                <p className="text-xs text-gray-500">Last active: {session.lastActive}</p>
              </div>
              <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded">
                Revoke
              </button>
            </div>
          ))}
          
          <button className="w-full px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Logout All Devices
          </button>
        </div>
      </section>
    </div>
  )
}
```

---

## 🗄️ Database Schema

### Required Tables

**Sessions Table**

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_info JSONB NOT NULL, -- {browser, os, device}
  location TEXT,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_activity TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at),
  INDEX idx_is_active (is_active)
);
```

**Users Table (add MFA columns)**

```sql
ALTER TABLE users
ADD COLUMN mfa_enabled BOOLEAN DEFAULT false,
ADD COLUMN mfa_secret TEXT,
ADD COLUMN mfa_backup_codes TEXT[], -- Array of backup codes
ADD COLUMN last_login_at TIMESTAMP,
ADD COLUMN last_login_ip TEXT,
ADD COLUMN last_login_location TEXT;
```

**Security Events Table**

```sql
CREATE TABLE security_events (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'login', 'password_change', etc.
  ip_address TEXT,
  location TEXT,
  device TEXT,
  details JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_user_id (user_id),
  INDEX idx_event_type (event_type),
  INDEX idx_created_at (created_at)
);
```

---

## 🛡️ Security Best Practices

### 1. Password Storage

```typescript
import bcrypt from 'bcryptjs'

// ✅ DO: Use bcrypt with 12+ rounds
const hashedPassword = await bcrypt.hash(password, 12)

// ❌ DON'T: Store plain text passwords
const user = { password: 'MyPassword123' } // NEVER DO THIS
```

### 2. Token Management

```typescript
// ✅ DO: Use httpOnly, secure cookies
response.cookies.set('sessionToken', token, {
  httpOnly: true,  // Prevent XSS
  secure: true,    // HTTPS only
  sameSite: 'lax', // CSRF protection
  maxAge: 7 * 24 * 60 * 60, // 7 days
})

// ❌ DON'T: Store tokens in localStorage
localStorage.setItem('token', token) // Vulnerable to XSS
```

### 3. Rate Limiting Production Setup

```typescript
// For production: Use Redis instead of in-memory storage
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function productionRateLimit(key: string) {
  const count = await redis.incr(key)
  
  if (count === 1) {
    await redis.expire(key, 900) // 15 minutes
  }
  
  return {
    allowed: count <= 5,
    remaining: Math.max(0, 5 - count)
  }
}
```

### 4. SQL Injection Prevention

```typescript
// ✅ DO: Use parameterized queries
const user = await db.users.findUnique({
  where: { email: userInput }
})

// ❌ DON'T: Concatenate strings
const query = `SELECT * FROM users WHERE email = '${userInput}'` // VULNERABLE
```

### 5. Logging Security Events

```typescript
// Log all security events for audit
async function logSecurityEvent(event: SecurityEvent) {
  await db.securityEvents.create({
    data: {
      userId: event.userId,
      eventType: event.type,
      ipAddress: event.ipAddress,
      location: event.location,
      device: event.device,
      details: event.details,
      createdAt: new Date(),
    }
  })
}
```

### 6. Environment Variables

```bash
# .env.local
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email Service
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=security@lab68dev.com

# Redis (Production)
REDIS_URL=redis://localhost:6379

# Session Secret
SESSION_SECRET=your-super-secret-key-change-this
```

---

## 📊 Monitoring & Alerts

### Key Metrics to Track

```typescript
// 1. Failed Login Attempts by IP
SELECT ip_address, COUNT(*) as attempts
FROM security_events
WHERE event_type = 'failed_login'
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY ip_address
HAVING COUNT(*) > 5
ORDER BY attempts DESC;

// 2. MFA Adoption Rate
SELECT 
  COUNT(*) FILTER (WHERE mfa_enabled = true) * 100.0 / COUNT(*) as adoption_rate
FROM users;

// 3. Active Sessions by User
SELECT user_id, COUNT(*) as session_count
FROM sessions
WHERE is_active = true
GROUP BY user_id
HAVING COUNT(*) > 3;

// 4. Suspicious Activity Events
SELECT user_id, event_type, COUNT(*) as occurrences
FROM security_events
WHERE event_type = 'suspicious_activity'
  AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY user_id, event_type;
```

### Alert Thresholds

```typescript
const ALERT_THRESHOLDS = {
  // Critical - Immediate action
  FAILED_LOGINS_PER_IP: 10,        // 10+ failures in 5 min
  FAILED_LOGINS_PER_USER: 5,       // 5+ failures in 15 min
  SUSPICIOUS_ACTIVITY_RATE: 0.1,   // 10% of logins flagged
  
  // Warning - Monitor closely
  MFA_BYPASS_ATTEMPTS: 3,          // 3+ backup code uses in 24h
  COUNTRY_CHANGES: 3,              // 3+ different countries in 24h
  DEVICE_CHANGES: 5,               // 5+ different devices in 7d
  
  // Info - Track trends
  NEW_DEVICE_LOGINS: 2,            // 2+ new devices in 24h
  PASSWORD_RESET_REQUESTS: 3,      // 3+ requests in 24h
}
```

---

## 🚀 Deployment Checklist

### Before Production Launch

- [ ] **Environment Variables**
  - [ ] Set strong `SESSION_SECRET`
  - [ ] Configure email service (SendGrid/SES/Resend)
  - [ ] Set up Redis for rate limiting
  - [ ] Configure Supabase secrets

- [ ] **Database**
  - [ ] Create sessions table
  - [ ] Add MFA columns to users table
  - [ ] Create security_events table
  - [ ] Set up database indexes
  - [ ] Enable Row Level Security (RLS)

- [ ] **Security Features**
  - [ ] Test password validation
  - [ ] Test rate limiting
  - [ ] Test MFA flow
  - [ ] Test security notifications
  - [ ] Test session management

- [ ] **External Integrations**
  - [ ] Integrate Have I Been Pwned API
  - [ ] Integrate IP geolocation service
  - [ ] Set up email service
  - [ ] Configure Redis (production)

- [ ] **Monitoring**
  - [ ] Set up error tracking (Sentry)
  - [ ] Configure logging (Winston/Pino)
  - [ ] Create security dashboards
  - [ ] Set up alerting

- [ ] **Testing**
  - [ ] Penetration testing
  - [ ] Load testing
  - [ ] Security audit
  - [ ] User acceptance testing

---

## 🔄 Maintenance Tasks

### Daily
- Review security event logs
- Check for locked accounts
- Monitor failed login attempts

### Weekly
- Review suspicious activity reports
- Check MFA adoption rate
- Analyze session patterns
- Review rate limit effectiveness

### Monthly
- Rotate session secrets
- Update dependencies
- Security patch updates
- Review and update security policies

### Quarterly
- Full security audit
- Penetration testing
- Review and update alert thresholds
- User security awareness training

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/security)
- [Have I Been Pwned API](https://haveibeenpwned.com/API/v3)

---

## 🆘 Security Contact

For security concerns or to report vulnerabilities:

- **Email**: security@lab68dev.com
- **GitHub Security Advisories**: [lab68dev/lab68dev-platform/security/advisories](https://github.com/lab68dev/lab68dev-platform/security/advisories)
- **Bug Bounty**: Contact security team for details

**Response Time**: Critical issues within 24 hours

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | Jan 2026 | Complete security implementation overhaul |
| 1.0.0 | Dec 2025 | Initial security features |

**Last Updated**: January 2026  
**Maintained By**: Lab68 Security Team

---

## ⚖️ License

This security implementation guide is part of the Lab68 Dev Platform.  
See [LICENSE](../LICENSE) for details.



### 2FA Implementation

**File:** `lib/staff-security.ts`

```typescript
import speakeasy from 'speakeasy'

// Generate 2FA secret
export function generateTwoFactorSecret(email: string) {
  const secret = speakeasy.generateSecret({
    name: `Lab68Dev (${email})`,
    issuer: 'Lab68 Dev Platform',
    length: 32,
  })
  
  return {
    secret: secret.base32,
    otpauth_url: secret.otpauth_url,
  }
}

// Verify 2FA token
export function verifyTwoFactorToken(token: string, secret: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // 60 seconds drift
  })
}

// Generate backup codes
export function generateBackupCodes(): string[] {
  const codes: string[] = []
  for (let i = 0; i < 10; i++) {
    codes.push(Math.random().toString(36).substring(2, 10).toUpperCase())
  }
  return codes
}
```

### API Endpoint

**File:** `app/api/staff/2fa/route.ts`

Actions:

- `setup` - Generate QR code and secret
- `verify` - Verify token and enable 2FA
- `disable` - Disable 2FA with token verification

---

## 4. Rate Limiting

### Rate Limiting Implementation

**File:** `lib/staff-security.ts`

```typescript
const rateLimitStore = new Map<string, RateLimitRecord>()

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number; resetTime: number }
```

### Usage Examples

```typescript
// Login rate limiting - 5 attempts per 15 minutes
const rateLimit = checkRateLimit(`login_${email}`, 5, 15 * 60 * 1000)

// Signup rate limiting - 3 attempts per hour
const rateLimit = checkRateLimit(`signup_${ipAddress}`, 3, 60 * 60 * 1000)

if (!rateLimit.allowed) {
  return { error: 'Too many attempts. Try again later.' }
}
```

### Auto-Cleanup

Rate limit records are automatically cleaned every minute:

```typescript
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60 * 1000)
```

---

## 5. Email Notifications

### Configuration

**File:** `lib/staff-email.ts`

```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})
```

### Email Templates

1. **Staff Approval Email** - `sendStaffApprovalEmail()`
2. **Staff Rejection Email** - `sendStaffRejectionEmail()`
3. **2FA Setup Email** - `send2FASetupEmail()`
4. **Password Reset Email** - `sendPasswordResetEmail()`
5. **Login Alert Email** - `sendLoginAlertEmail()`
6. **Account Deactivation Email** - `sendAccountDeactivationEmail()`

### Gmail Setup

1. Enable 2FA on Gmail account
2. Generate App Password: <https://myaccount.google.com/apppasswords>
3. Add to `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=lab68dev@gmail.com
SMTP_PASSWORD=your_app_password_here
```

---

## 6. Supabase Database Integration

### Schema

**File:** `supabase-staff-schema.sql`

Tables created:

- `staff_users` - Staff member accounts
- `staff_approval_requests` - Registration approvals
- `staff_activity_log` - Audit trail
- `staff_sessions` - JWT session tracking
- `staff_password_resets` - Password reset tokens
- `staff_rate_limits` - Persistent rate limiting

### Database Operations

```typescript
// Create staff
await createStaffInDatabase(staffData)

// Get staff by email
const staff = await getStaffByEmail(email)

// Update last login
await updateStaffLastLogin(staffId)

// Enable/disable 2FA
await updateStaff2FA(staffId, secret)

// Log activity
await logStaffActivity(activityData)
```

---

## 🚀 Setup Instructions

### 1. Install Supabase

```bash
# Already installed
pnpm add @supabase/supabase-js
```

### 2. Create Supabase Project

1. Go to <https://supabase.com>
2. Create new project
3. Copy Project URL and Anon Key

### 3. Run Database Schema

1. Open Supabase SQL Editor
2. Paste contents of `supabase-staff-schema.sql`
3. Execute the SQL

### 4. Configure Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-generated-secret-key

# SMTP (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=lab68dev@gmail.com
SMTP_PASSWORD=your-gmail-app-password
FROM_EMAIL=lab68dev@gmail.com
FROM_NAME=Lab68 Dev Platform

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 5. Generate JWT Secret

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

---

## 🔐 API Endpoints

### POST /api/staff/signup

Register new staff member

```typescript
{
  name: string
  email: string
  password: string
  confirmPassword: string
  department: string
  employeeId: string
  phone?: string
}
```

Response:

```typescript
{
  message: string
  staffId: string
}
```

### POST /api/staff/login

Authenticate staff member

```typescript
{
  email: string
  password: string
  twoFactorToken?: string
}
```

Response:

```typescript
{
  session: StaffSession
  staff: StaffInfo
}
```

### POST /api/staff/2fa

Manage 2FA

Actions:

- `setup` - Generate QR code
- `verify` - Enable 2FA
- `disable` - Disable 2FA

```typescript
{
  staffId: string
  action: 'setup' | 'verify' | 'disable'
  token?: string
  secret?: string
}
```

---

## 🔒 Security Best Practices

### Password Requirements

- Minimum 8 characters
- Bcrypt with 12 salt rounds
- Never stored in plain text

### JWT Tokens

- 24-hour expiration
- Signed with secret key
- Verified on every request
- Stored in database for tracking

### Rate Limiting

- Login: 5 attempts / 15 minutes
- Signup: 3 attempts / 1 hour
- Auto-cleanup of expired records

### 2FA

- TOTP-based (Time-based One-Time Password)
- 30-second time window
- 10 backup codes generated
- QR code for easy setup

### Email Notifications

- TLS encryption
- Professional HTML templates
- Login alerts from new devices
- Account changes notifications

---

## 📊 Database Schema

### staff_users

```sql
id UUID PRIMARY KEY
email TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL
role TEXT CHECK (role IN ('admin', 'support', 'moderator'))
two_factor_enabled BOOLEAN DEFAULT FALSE
two_factor_secret TEXT
backup_codes TEXT[]
is_active BOOLEAN DEFAULT FALSE
last_login TIMESTAMP
```

### staff_sessions

```sql
id UUID PRIMARY KEY
staff_id UUID REFERENCES staff_users(id)
token TEXT NOT NULL
expires_at TIMESTAMP NOT NULL
ip_address TEXT
user_agent TEXT
```

### staff_activity_log

```sql
id UUID PRIMARY KEY
staff_id UUID REFERENCES staff_users(id)
action TEXT NOT NULL
description TEXT NOT NULL
ip_address TEXT
created_at TIMESTAMP
```

---

## 🧪 Testing

### Test Credentials

```text
Email: admin@lab68dev.com
Password: Admin@123456
```

**⚠️ CHANGE THESE IN PRODUCTION!**

### Testing 2FA

1. Login to staff portal
2. Go to Settings
3. Click "Enable 2FA"
4. Scan QR code with Google Authenticator or Authy
5. Enter 6-digit code
6. Save backup codes

### Testing Rate Limiting

1. Try logging in with wrong password 6 times
2. Should see "Too many attempts" message
3. Wait 15 minutes or clear rate limit in database

### Testing Emails

1. Configure SMTP in `.env.local`
2. Create new staff account
3. Approve the account (should send email)
4. Enable 2FA (should send email)
5. Login from new IP (should send alert)

---

## 🐛 Troubleshooting

### Emails Not Sending

1. **Check SMTP credentials**

   ```env
   SMTP_USER=lab68dev@gmail.com
   SMTP_PASSWORD=your_app_password
   ```

2. **Enable "Less Secure Apps"** (Gmail)
   - Or use App Password (recommended)

3. **Check firewall/port**
   - Port 587 should be open

### 2FA Not Working

1. **Check time synchronization**
   - Device time must be accurate

2. **Verify secret storage**
   - Check database `two_factor_secret` field

3. **Use backup codes**
   - If authenticator lost

### Rate Limiting Too Strict

1. **Increase limits** in `lib/staff-security.ts`
2. **Clear rate limits** manually:

   ```sql
   DELETE FROM staff_rate_limits WHERE identifier = 'login_email@example.com';
   ```

### JWT Verification Failing

1. **Check JWT_SECRET** matches across environments
2. **Verify token not expired**
3. **Check system time** is accurate

---

## 📈 Monitoring

### Activity Logging

All actions are logged to `staff_activity_log`:

```typescript
await logStaffActivity({
  staffId: staff.id,
  staffName: staff.name,
  action: 'login',
  description: 'Logged in from 192.168.1.1',
})
```

### Session Tracking

Active sessions in `staff_sessions` table:

```sql
SELECT * FROM staff_sessions WHERE expires_at > NOW();
```

### Rate Limit Monitoring

Check current rate limits:

```sql
SELECT * FROM staff_rate_limits WHERE reset_time > NOW();
```

---

## 🔄 Migration from localStorage

If you're migrating from localStorage:

1. Run database schema
2. Configure Supabase credentials
3. Export localStorage data
4. Import to Supabase tables
5. Update frontend to use API routes

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [JWT Best Practices](https://jwt.io/introduction)
- [Bcrypt](https://www.npmjs.com/package/bcryptjs)
- [Speakeasy (2FA)](https://www.npmjs.com/package/speakeasy)
- [Nodemailer](https://nodemailer.com/)

---

**Security Implementation Complete!** ✅

All 6 security features have been implemented:

1. ✅ Password Hashing (Bcrypt)
2. ✅ JWT Sessions
3. ✅ Two-Factor Authentication
4. ✅ Rate Limiting
5. ✅ Email Notifications
6. ✅ Supabase Database Integration
