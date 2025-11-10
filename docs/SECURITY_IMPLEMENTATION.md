# Security Implementation Guide

## 🔒 Enhanced Security Features

This guide covers all the security enhancements implemented for the Lab68 Dev Platform Staff Portal.

---

## 📦 Installed Packages

```bash
pnpm add bcryptjs jsonwebtoken nodemailer @supabase/supabase-js speakeasy qrcode
pnpm add -D @types/jsonwebtoken @types/nodemailer @types/qrcode @types/speakeasy
```

---

## 1. Password Hashing with Bcrypt

### Implementation

**File:** `lib/staff-security.ts`

```typescript
import bcrypt from 'bcryptjs'

// Hash password with 12 salt rounds
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

// Verify password against hash
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
```

### Usage

```typescript
// When creating user
const passwordHash = await hashPassword('user_password')

// When logging in
const isValid = await verifyPassword('user_password', storedHash)
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
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}
```

### Session Structure

```typescript
interface StaffSession {
  token: string
  staffId: string
  email: string
  role: 'admin' | 'support' | 'moderator'
  name: string
  expiresAt: number
  twoFactorVerified: boolean
}
```

---

## 3. Two-Factor Authentication (2FA)

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
