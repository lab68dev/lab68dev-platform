import nodemailer from 'nodemailer'

// Email configuration (use environment variables in production)
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587')
const SMTP_USER = process.env.SMTP_USER || 'lab68dev@gmail.com'
const SMTP_PASS = process.env.SMTP_PASSWORD || ''
const FROM_EMAIL = process.env.FROM_EMAIL || 'lab68dev@gmail.com'
const FROM_NAME = process.env.FROM_NAME || 'Lab68 Dev Platform'

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
})

// Email templates
export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    })
  } catch (error) {
    console.error('Failed to send email:', error)
    throw new Error('Email sending failed')
  }
}

// Staff Approval Email
export async function sendStaffApprovalEmail(
  staffEmail: string,
  staffName: string
): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Account Approved!</h1>
        </div>
        <div class="content">
          <p>Hi ${staffName},</p>
          
          <p>Great news! Your staff account for <strong>Lab68 Dev Platform</strong> has been approved.</p>
          
          <p>You can now access the staff portal and start managing the platform.</p>
          
          <p style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/staff/login" class="button">
              Login to Staff Portal
            </a>
          </p>
          
          <p><strong>Important Security Tips:</strong></p>
          <ul>
            <li>Enable Two-Factor Authentication (2FA) for enhanced security</li>
            <li>Never share your credentials with anyone</li>
            <li>Log out when not in use</li>
            <li>Report suspicious activities immediately</li>
          </ul>
          
          <p>If you have any questions, please contact your administrator.</p>
          
          <p>Best regards,<br>Lab68 Dev Platform Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Lab68 Dev Platform. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: staffEmail,
    subject: '✅ Your Staff Account Has Been Approved - Lab68 Dev Platform',
    html,
  })
}

// Staff Rejection Email
export async function sendStaffRejectionEmail(
  staffEmail: string,
  staffName: string,
  reason?: string
): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Staff Application Update</h1>
        </div>
        <div class="content">
          <p>Hi ${staffName},</p>
          
          <p>Thank you for your interest in joining the Lab68 Dev Platform staff team.</p>
          
          <p>Unfortunately, we are unable to approve your application at this time.</p>
          
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          
          <p>If you believe this is an error or would like to discuss this further, please contact your administrator at <a href="mailto:lab68dev@gmail.com">lab68dev@gmail.com</a>.</p>
          
          <p>Best regards,<br>Lab68 Dev Platform Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Lab68 Dev Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: staffEmail,
    subject: 'Staff Application Update - Lab68 Dev Platform',
    html,
  })
}

// Two-Factor Authentication Setup Email
export async function send2FASetupEmail(
  staffEmail: string,
  staffName: string
): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #22c55e; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔒 2FA Enabled Successfully</h1>
        </div>
        <div class="content">
          <p>Hi ${staffName},</p>
          
          <p>Two-Factor Authentication (2FA) has been successfully enabled for your account.</p>
          
          <p><strong>What this means:</strong></p>
          <ul>
            <li>Enhanced security for your account</li>
            <li>You'll need your authenticator app to login</li>
            <li>Backup codes have been generated for emergency access</li>
          </ul>
          
          <p><strong>Important:</strong> Make sure to save your backup codes in a secure location. You'll need them if you lose access to your authenticator app.</p>
          
          <p>If you did not enable 2FA, please contact your administrator immediately at <a href="mailto:lab68dev@gmail.com">lab68dev@gmail.com</a>.</p>
          
          <p>Best regards,<br>Lab68 Dev Platform Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Lab68 Dev Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: staffEmail,
    subject: '🔒 Two-Factor Authentication Enabled - Lab68 Dev Platform',
    html,
  })
}

// Password Reset Email
export async function sendPasswordResetEmail(
  staffEmail: string,
  staffName: string,
  resetToken: string
): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/staff/reset-password?token=${resetToken}`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔑 Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi ${staffName},</p>
          
          <p>We received a request to reset your password for your Lab68 Dev Platform staff account.</p>
          
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">
              Reset Password
            </a>
          </p>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul style="margin: 10px 0 0 0;">
              <li>This link expires in 1 hour</li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: white; padding: 10px; border-radius: 4px; font-size: 12px;">
            ${resetUrl}
          </p>
          
          <p>If you did not request a password reset, please contact your administrator immediately.</p>
          
          <p>Best regards,<br>Lab68 Dev Platform Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Lab68 Dev Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: staffEmail,
    subject: '🔑 Password Reset Request - Lab68 Dev Platform',
    html,
  })
}

// Login Alert Email
export async function sendLoginAlertEmail(
  staffEmail: string,
  staffName: string,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .info-box { background: white; border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New Login Detected</h1>
        </div>
        <div class="content">
          <p>Hi ${staffName},</p>
          
          <p>A new login to your staff account was detected.</p>
          
          <div class="info-box">
            <p><strong>Login Details:</strong></p>
            <ul>
              <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
              <li><strong>IP Address:</strong> ${ipAddress}</li>
              <li><strong>Device:</strong> ${userAgent}</li>
            </ul>
          </div>
          
          <p>If this was you, no action is needed.</p>
          
          <p><strong>If this wasn't you:</strong></p>
          <ul>
            <li>Change your password immediately</li>
            <li>Enable Two-Factor Authentication (2FA)</li>
            <li>Contact your administrator at <a href="mailto:lab68dev@gmail.com">lab68dev@gmail.com</a></li>
          </ul>
          
          <p>Best regards,<br>Lab68 Dev Platform Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Lab68 Dev Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: staffEmail,
    subject: '🔔 New Login Alert - Lab68 Dev Platform',
    html,
  })
}

// Account Deactivation Email
export async function sendAccountDeactivationEmail(
  staffEmail: string,
  staffName: string
): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #6b7280; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Account Deactivated</h1>
        </div>
        <div class="content">
          <p>Hi ${staffName},</p>
          
          <p>Your staff account for Lab68 Dev Platform has been deactivated.</p>
          
          <p>You will no longer have access to the staff portal.</p>
          
          <p>If you believe this is an error or would like more information, please contact your administrator at <a href="mailto:lab68dev@gmail.com">lab68dev@gmail.com</a>.</p>
          
          <p>Best regards,<br>Lab68 Dev Platform Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Lab68 Dev Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: staffEmail,
    subject: 'Account Deactivated - Lab68 Dev Platform',
    html,
  })
}
