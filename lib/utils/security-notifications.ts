/**
 * Security Notification Email Service
 * Sends alerts for important security events
 */

export interface SecurityEvent {
  type: 'login' | 'password_change' | 'email_change' | 'mfa_enabled' | 'mfa_disabled' | 'failed_login' | 'account_locked' | 'new_device' | 'suspicious_activity'
  userEmail: string
  userName?: string
  details: {
    ipAddress?: string
    location?: string
    device?: string
    timestamp: string
    [key: string]: any
  }
}

/**
 * Send security notification email
 * @param event - Security event details
 * @returns Promise indicating success/failure
 */
export async function sendSecurityNotification(event: SecurityEvent): Promise<boolean> {
  try {
    const emailContent = generateEmailContent(event)
    
    // TODO: Integrate with your email service (SendGrid, AWS SES, Resend, etc.)
    // Example with fetch to your API endpoint:
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: event.userEmail,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Failed to send security notification:', error)
    return false
  }
}

/**
 * Generate email content based on event type
 */
function generateEmailContent(event: SecurityEvent): {
  subject: string
  html: string
  text: string
} {
  const { type, userName, details } = event
  const name = userName || 'User'
  const timestamp = new Date(details.timestamp).toLocaleString()
  const location = details.location || 'Unknown location'
  const ipAddress = details.ipAddress || 'Unknown IP'
  const device = details.device || 'Unknown device'

  const baseStyles = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #00FF99 0%, #00CC7A 100%); color: #0A0A0A; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
      .alert { background: #fff; border-left: 4px solid #00FF99; padding: 15px; margin: 20px 0; }
      .details { background: #fff; padding: 15px; margin: 20px 0; border-radius: 4px; }
      .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      .button { display: inline-block; background: #00FF99; color: #0A0A0A; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 10px 0; }
    </style>
  `

  switch (type) {
    case 'login':
      return {
        subject: '🔐 New Login to Your Lab68 Account',
        html: `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>New Login Detected</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>We detected a new login to your Lab68 account.</p>
              
              <div class="details">
                <strong>Login Details:</strong><br>
                📅 Time: ${timestamp}<br>
                📍 Location: ${location}<br>
                🌐 IP Address: ${ipAddress}<br>
                💻 Device: ${device}
              </div>

              <div class="alert">
                <strong>Was this you?</strong><br>
                If you recognize this login, no action is needed. If you don't recognize this activity, please secure your account immediately.
              </div>

              <a href="https://lab68dev.com/dashboard/settings/security" class="button">Review Security Settings</a>

              <p>Stay safe,<br>The Lab68 Team</p>
            </div>
            <div class="footer">
              <p>This is an automated security notification from Lab68 Dev Platform</p>
            </div>
          </div>
        `,
        text: `Hi ${name},\n\nWe detected a new login to your Lab68 account.\n\nLogin Details:\nTime: ${timestamp}\nLocation: ${location}\nIP Address: ${ipAddress}\nDevice: ${device}\n\nIf you don't recognize this activity, please secure your account immediately at https://lab68dev.com/dashboard/settings/security\n\nStay safe,\nThe Lab68 Team`,
      }

    case 'password_change':
      return {
        subject: '🔒 Your Lab68 Password Was Changed',
        html: `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>Password Changed</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Your Lab68 account password was successfully changed.</p>
              
              <div class="details">
                <strong>Change Details:</strong><br>
                📅 Time: ${timestamp}<br>
                📍 Location: ${location}<br>
                🌐 IP Address: ${ipAddress}
              </div>

              <div class="alert">
                <strong>Didn't make this change?</strong><br>
                If you didn't change your password, your account may be compromised. Reset your password immediately and enable two-factor authentication.
              </div>

              <a href="https://lab68dev.com/dashboard/settings/security" class="button">Secure My Account</a>

              <p>Stay safe,<br>The Lab68 Team</p>
            </div>
            <div class="footer">
              <p>This is an automated security notification from Lab68 Dev Platform</p>
            </div>
          </div>
        `,
        text: `Hi ${name},\n\nYour Lab68 account password was successfully changed at ${timestamp}.\n\nIf you didn't make this change, please secure your account immediately at https://lab68dev.com/dashboard/settings/security\n\nStay safe,\nThe Lab68 Team`,
      }

    case 'mfa_enabled':
      return {
        subject: '✅ Two-Factor Authentication Enabled',
        html: `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>2FA Enabled Successfully</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Two-factor authentication has been enabled on your Lab68 account. Your account is now more secure! 🎉</p>
              
              <div class="alert">
                <strong>Important:</strong><br>
                Make sure to save your backup codes in a safe place. You'll need them if you lose access to your authenticator app.
              </div>

              <p>Enabled at: ${timestamp}</p>

              <p>Stay safe,<br>The Lab68 Team</p>
            </div>
            <div class="footer">
              <p>This is an automated security notification from Lab68 Dev Platform</p>
            </div>
          </div>
        `,
        text: `Hi ${name},\n\nTwo-factor authentication has been enabled on your Lab68 account at ${timestamp}.\n\nMake sure to save your backup codes in a safe place.\n\nStay safe,\nThe Lab68 Team`,
      }

    case 'failed_login':
      return {
        subject: '⚠️ Failed Login Attempts on Your Account',
        html: `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>Failed Login Attempts</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>We detected multiple failed login attempts on your Lab68 account.</p>
              
              <div class="details">
                <strong>Attempt Details:</strong><br>
                📅 Time: ${timestamp}<br>
                📍 Location: ${location}<br>
                🌐 IP Address: ${ipAddress}<br>
                🔢 Attempts: ${details.attempts || 'Multiple'}
              </div>

              <div class="alert">
                <strong>Protect your account:</strong><br>
                If this wasn't you, someone may be trying to access your account. We recommend changing your password and enabling two-factor authentication.
              </div>

              <a href="https://lab68dev.com/dashboard/settings/security" class="button">Secure My Account</a>

              <p>Stay safe,<br>The Lab68 Team</p>
            </div>
            <div class="footer">
              <p>This is an automated security notification from Lab68 Dev Platform</p>
            </div>
          </div>
        `,
        text: `Hi ${name},\n\nWe detected multiple failed login attempts on your Lab68 account at ${timestamp} from ${location} (${ipAddress}).\n\nIf this wasn't you, please secure your account immediately at https://lab68dev.com/dashboard/settings/security\n\nStay safe,\nThe Lab68 Team`,
      }

    default:
      return {
        subject: '🔔 Security Alert - Lab68 Account',
        html: `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>Security Alert</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>We detected important security activity on your Lab68 account at ${timestamp}.</p>
              
              <a href="https://lab68dev.com/dashboard/settings/security" class="button">Review Activity</a>

              <p>Stay safe,<br>The Lab68 Team</p>
            </div>
            <div class="footer">
              <p>This is an automated security notification from Lab68 Dev Platform</p>
            </div>
          </div>
        `,
        text: `Hi ${name},\n\nWe detected important security activity on your Lab68 account at ${timestamp}.\n\nPlease review your security settings at https://lab68dev.com/dashboard/settings/security\n\nStay safe,\nThe Lab68 Team`,
      }
  }
}

/**
 * Batch send notifications for multiple events
 */
export async function sendBatchNotifications(events: SecurityEvent[]): Promise<boolean[]> {
  return Promise.all(events.map(event => sendSecurityNotification(event)))
}
