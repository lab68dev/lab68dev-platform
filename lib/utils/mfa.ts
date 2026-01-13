/**
 * Multi-Factor Authentication (MFA/2FA) Utilities
 * Implements Time-based One-Time Password (TOTP) authentication
 */

import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

export interface MFASecret {
  secret: string
  qrCode: string
  backupCodes: string[]
}

export interface MFAVerification {
  valid: boolean
  message: string
}

/**
 * Generate MFA secret and QR code for user
 * @param userEmail - User's email address
 * @param appName - Application name (default: Lab68)
 * @returns MFA secret, QR code, and backup codes
 */
export async function generateMFASecret(
  userEmail: string,
  appName: string = 'Lab68'
): Promise<MFASecret> {
  // Generate secret
  const secret = speakeasy.generateSecret({
    name: `${appName} (${userEmail})`,
    issuer: appName,
    length: 32,
  })

  // Generate QR code
  const qrCode = await QRCode.toDataURL(secret.otpauth_url || '')

  // Generate backup codes
  const backupCodes = generateBackupCodes(8)

  return {
    secret: secret.base32,
    qrCode,
    backupCodes,
  }
}

/**
 * Verify MFA token
 * @param secret - User's MFA secret
 * @param token - 6-digit token from authenticator app
 * @returns Verification result
 */
export function verifyMFAToken(secret: string, token: string): MFAVerification {
  try {
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time steps before/after (60 seconds total window)
    })

    return {
      valid: verified,
      message: verified ? 'Token verified successfully' : 'Invalid token',
    }
  } catch (error) {
    return {
      valid: false,
      message: 'Error verifying token',
    }
  }
}

/**
 * Verify backup code
 * @param backupCodes - Array of user's backup codes
 * @param code - Code to verify
 * @returns Verification result and remaining codes
 */
export function verifyBackupCode(
  backupCodes: string[],
  code: string
): {
  valid: boolean
  remainingCodes: string[]
  message: string
} {
  const normalizedCode = code.replace(/\s/g, '').toUpperCase()
  const normalizedBackupCodes = backupCodes.map(c => c.replace(/\s/g, '').toUpperCase())

  const index = normalizedBackupCodes.indexOf(normalizedCode)

  if (index === -1) {
    return {
      valid: false,
      remainingCodes: backupCodes,
      message: 'Invalid backup code',
    }
  }

  // Remove used backup code
  const remainingCodes = [...backupCodes]
  remainingCodes.splice(index, 1)

  return {
    valid: true,
    remainingCodes,
    message: 'Backup code verified successfully',
  }
}

/**
 * Generate random backup codes
 * @param count - Number of backup codes to generate
 * @returns Array of backup codes
 */
function generateBackupCodes(count: number = 8): string[] {
  const codes: string[] = []

  for (let i = 0; i < count; i++) {
    // Generate 8-character alphanumeric code
    const code = Array.from({ length: 8 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(
        Math.floor(Math.random() * 36)
      )
    ).join('')

    // Format as XXXX-XXXX
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`)
  }

  return codes
}

/**
 * Regenerate backup codes
 * @param count - Number of backup codes to generate
 * @returns Array of new backup codes
 */
export function regenerateBackupCodes(count: number = 8): string[] {
  return generateBackupCodes(count)
}

/**
 * Check if MFA should be required based on risk assessment
 * @param ipAddress - User's IP address
 * @param userAgent - User's user agent
 * @param lastKnownIP - User's last known IP address
 * @returns Whether MFA should be required
 */
export function shouldRequireMFA(
  ipAddress: string,
  userAgent: string,
  lastKnownIP?: string
): boolean {
  // Require MFA if IP changed
  if (lastKnownIP && ipAddress !== lastKnownIP) {
    return true
  }

  // Add more risk-based checks here
  // - Country change detection
  // - Suspicious user agent
  // - Unusual login time
  
  return false
}

/**
 * Format time remaining for current TOTP token
 * @returns Seconds remaining until token expires
 */
export function getTokenTimeRemaining(): number {
  const now = Math.floor(Date.now() / 1000)
  const step = 30 // TOTP time step in seconds
  return step - (now % step)
}
