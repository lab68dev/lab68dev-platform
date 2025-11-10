import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import speakeasy from 'speakeasy'
import { createClient } from '@supabase/supabase-js'

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRY = '24h'

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

// Password Hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// JWT Token Management
export interface JWTPayload {
  staffId: string
  email: string
  role: 'admin' | 'support' | 'moderator'
  name: string
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload
  } catch (error) {
    return null
  }
}

// 2FA Management
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

export function verifyTwoFactorToken(token: string, secret: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Allow 2 steps of drift (60 seconds before/after)
  })
}

export function generateBackupCodes(): string[] {
  const codes: string[] = []
  for (let i = 0; i < 10; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    codes.push(code)
  }
  return codes
}

// Rate Limiting (In-memory implementation)
interface RateLimitRecord {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitRecord>()

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    // Create new record
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      allowed: true,
      remaining: maxAttempts - 1,
      resetTime: now + windowMs,
    }
  }

  if (record.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    }
  }

  record.count++
  rateLimitStore.set(identifier, record)

  return {
    allowed: true,
    remaining: maxAttempts - record.count,
    resetTime: record.resetTime,
  }
}

export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier)
}

// Clean up expired rate limit records
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60 * 1000) // Clean every minute

// Session Management
export interface StaffSession {
  token: string
  staffId: string
  email: string
  role: 'admin' | 'support' | 'moderator'
  name: string
  expiresAt: number
  twoFactorVerified: boolean
}

export function createSession(staff: JWTPayload, twoFactorVerified: boolean = false): StaffSession {
  const token = generateToken(staff)
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

  return {
    token,
    staffId: staff.staffId,
    email: staff.email,
    role: staff.role,
    name: staff.name,
    expiresAt,
    twoFactorVerified,
  }
}

export function validateSession(session: StaffSession | null): boolean {
  if (!session) return false
  
  // Check if expired
  if (Date.now() > session.expiresAt) return false
  
  // Verify token
  const payload = verifyToken(session.token)
  if (!payload) return false
  
  return true
}

// Supabase Staff Operations
export async function createStaffInDatabase(staffData: {
  email: string
  name: string
  role: 'admin' | 'support' | 'moderator'
  department: string
  employeeId: string
  phone?: string
  passwordHash: string
}) {
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase
    .from('staff_users')
    .insert({
      email: staffData.email,
      name: staffData.name,
      role: staffData.role,
      department: staffData.department,
      employee_id: staffData.employeeId,
      phone: staffData.phone || null,
      password_hash: staffData.passwordHash,
      is_active: false, // Requires approval
      is_pending: true,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getStaffByEmail(email: string) {
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase
    .from('staff_users')
    .select('*')
    .eq('email', email)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  
  return data
}

export async function getStaffById(id: string) {
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase
    .from('staff_users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  
  return data
}

export async function updateStaffLastLogin(staffId: string) {
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const { error } = await supabase
    .from('staff_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', staffId)

  if (error) throw error
}

export async function updateStaff2FA(staffId: string, secret: string | null) {
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const { error } = await supabase
    .from('staff_users')
    .update({ 
      two_factor_secret: secret,
      two_factor_enabled: secret !== null,
    })
    .eq('id', staffId)

  if (error) throw error
}

export async function getAllStaff() {
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase
    .from('staff_users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateStaffStatus(staffId: string, isActive: boolean) {
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const { error } = await supabase
    .from('staff_users')
    .update({ 
      is_active: isActive,
      is_pending: false,
    })
    .eq('id', staffId)

  if (error) throw error
}

export async function deleteStaffFromDatabase(staffId: string) {
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const { error } = await supabase
    .from('staff_users')
    .delete()
    .eq('id', staffId)

  if (error) throw error
}

// Activity Logging
export async function logStaffActivity(activity: {
  staffId: string
  staffName: string
  action: string
  description: string
}) {
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const { error } = await supabase
    .from('staff_activity_log')
    .insert({
      staff_id: activity.staffId,
      staff_name: activity.staffName,
      action: activity.action,
      description: activity.description,
      created_at: new Date().toISOString(),
    })

  if (error) throw error
}

export async function getStaffActivityLog(limit: number = 100) {
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase
    .from('staff_activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}
