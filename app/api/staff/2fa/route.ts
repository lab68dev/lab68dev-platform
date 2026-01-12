import { NextRequest, NextResponse } from 'next/server'
import {
  getStaffById,
  generateTwoFactorSecret,
  verifyTwoFactorToken,
  updateStaff2FA,
  generateBackupCodes,
  supabase,
} from '@/lib/features/staff'
import { send2FASetupEmail } from '@/lib/features/staff/email-service'
import QRCode from 'qrcode'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { staffId, action, token, secret } = body

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      )
    }

    const staff = await getStaffById(staffId)
    if (!staff) {
      return NextResponse.json(
        { error: 'Staff not found' },
        { status: 404 }
      )
    }

    // Setup 2FA
    if (action === 'setup') {
      const twoFactorData = generateTwoFactorSecret(staff.email)
      const backupCodes = generateBackupCodes()

      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(twoFactorData.otpauth_url!)

      return NextResponse.json({
        secret: twoFactorData.secret,
        qrCode: qrCodeDataUrl,
        backupCodes,
      })
    }

    // Verify and enable 2FA
    if (action === 'verify') {
      if (!token || !secret) {
        return NextResponse.json(
          { error: 'Token and secret are required' },
          { status: 400 }
        )
      }

      const isValid = verifyTwoFactorToken(token, secret)

      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid 2FA token' },
          { status: 401 }
        )
      }

      // Enable 2FA in database
      await updateStaff2FA(staffId, secret)

      // Send confirmation email
      try {
        await send2FASetupEmail(staff.email, staff.name)
      } catch (emailError) {
        console.error('Failed to send 2FA setup email:', emailError)
      }

      return NextResponse.json({
        message: '2FA enabled successfully',
      })
    }

    // Disable 2FA
    if (action === 'disable') {
      if (!token) {
        return NextResponse.json(
          { error: 'Token is required to disable 2FA' },
          { status: 400 }
        )
      }

      if (!staff.two_factor_secret) {
        return NextResponse.json(
          { error: '2FA is not enabled' },
          { status: 400 }
        )
      }

      const isValid = verifyTwoFactorToken(token, staff.two_factor_secret)

      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid 2FA token' },
          { status: 401 }
        )
      }

      await updateStaff2FA(staffId, null)

      return NextResponse.json({
        message: '2FA disabled successfully',
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('2FA error:', error)
    return NextResponse.json(
      { error: error.message || '2FA operation failed' },
      { status: 500 }
    )
  }
}
