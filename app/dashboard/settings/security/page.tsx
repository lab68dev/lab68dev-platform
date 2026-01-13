'use client'

import { useState, useEffect } from 'react'
import { PasswordStrengthIndicator } from '@/components/password-strength-indicator'
import {
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

interface Session {
  id: string
  device: string
  location: string
  lastActive: string
  isCurrent: boolean
  ipAddress: string
}

export default function SecuritySettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [sessions, setSessions] = useState<Session[]>([])
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [mfaToken, setMfaToken] = useState('')
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSessions()
    fetchMFAStatus()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/auth/sessions')
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions)
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    }
  }

  const fetchMFAStatus = async () => {
    try {
      const response = await fetch('/api/auth/mfa/status')
      if (response.ok) {
        const data = await response.json()
        setMfaEnabled(data.enabled)
      }
    } catch (error) {
      console.error('Failed to fetch MFA status:', error)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/password/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to change password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleEnableMFA = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/mfa/enable', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setQrCode(data.qrCode)
        setBackupCodes(data.backupCodes)
        setShowBackupCodes(true)
        setMessage({ type: 'success', text: 'Scan the QR code with your authenticator app' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to enable MFA' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyMFA = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: mfaToken }),
      })

      const data = await response.json()

      if (response.ok) {
        setMfaEnabled(true)
        setQrCode(null)
        setMfaToken('')
        setMessage({ type: 'success', text: 'Two-factor authentication enabled successfully!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Invalid verification code' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDisableMFA = async () => {
    if (!confirm('Are you sure you want to disable two-factor authentication?')) {
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/mfa/disable', {
        method: 'POST',
      })

      if (response.ok) {
        setMfaEnabled(false)
        setMessage({ type: 'success', text: 'Two-factor authentication disabled' })
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'Failed to disable MFA' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to revoke this session?')) {
      return
    }

    try {
      const response = await fetch('/api/auth/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })

      if (response.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId))
        setMessage({ type: 'success', text: 'Session revoked successfully' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to revoke session' })
    }
  }

  const handleLogoutAllDevices = async () => {
    if (!confirm('This will log you out from all devices except this one. Continue?')) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoutAll: true }),
      })

      if (response.ok) {
        await fetchSessions()
        setMessage({ type: 'success', text: 'Logged out from all other devices' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to logout from all devices' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account security and protect your data
        </p>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`rounded-lg p-4 flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="flex-1">{message.text}</p>
          <button onClick={() => setMessage(null)}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Change Password */}
      <section className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheckIcon className="w-6 h-6 text-green-600" />
            Change Password
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Update your password regularly to keep your account secure
          </p>
        </div>

        <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <PasswordStrengthIndicator
              password={newPassword}
              showRequirements={true}
              className="mt-2"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </section>

      {/* Two-Factor Authentication */}
      <section className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <DevicePhoneMobileIcon className="w-6 h-6 text-blue-600" />
            Two-Factor Authentication
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Add an extra layer of security to your account
          </p>
        </div>

        <div className="p-6 space-y-4">
          {mfaEnabled ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <CheckCircleIcon className="w-5 h-5" />
                Two-factor authentication is enabled
              </div>
              <button
                onClick={handleDisableMFA}
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium transition-colors"
              >
                {loading ? 'Disabling...' : 'Disable 2FA'}
              </button>
            </div>
          ) : qrCode ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Step 1: Scan QR Code</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
                <div className="bg-white p-4 inline-block border rounded-lg">
                  <img src={qrCode} alt="MFA QR Code" className="w-64 h-64" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Step 2: Save Backup Codes</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Store these backup codes in a safe place. Each can be used once if you lose access to your authenticator app.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="bg-white p-2 rounded border">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <form onSubmit={handleVerifyMFA} className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Step 3: Verify Code</h3>
                  <label htmlFor="mfaToken" className="block text-sm text-gray-600 mb-2">
                    Enter the 6-digit code from your authenticator app
                  </label>
                  <input
                    id="mfaToken"
                    type="text"
                    value={mfaToken}
                    onChange={(e) => setMfaToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || mfaToken.length !== 6}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {loading ? 'Verifying...' : 'Verify & Enable 2FA'}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Protect your account with two-factor authentication using an authenticator app
              </p>
              <button
                onClick={handleEnableMFA}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
              >
                {loading ? 'Setting up...' : 'Enable 2FA'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Active Sessions */}
      <section className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ComputerDesktopIcon className="w-6 h-6 text-purple-600" />
            Active Sessions
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage devices that are currently logged into your account
          </p>
        </div>

        <div className="p-6 space-y-4">
          {sessions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No active sessions</p>
          ) : (
            <>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`border rounded-lg p-4 flex justify-between items-center ${
                      session.isCurrent ? 'border-green-300 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{session.device}</p>
                        {session.isCurrent && (
                          <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full font-medium">
                            Current Session
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {session.location} • {session.ipAddress}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Last active: {session.lastActive}
                      </p>
                    </div>
                    {!session.isCurrent && (
                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogoutAllDevices}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium transition-colors"
                >
                  {loading ? 'Logging out...' : 'Logout All Other Devices'}
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Security Tips */}
      <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <KeyIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Security Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use a unique password that you don't use anywhere else</li>
              <li>• Enable two-factor authentication for maximum security</li>
              <li>• Regularly review your active sessions and revoke unknown devices</li>
              <li>• Never share your password or backup codes with anyone</li>
              <li>• Update your password if you suspect it has been compromised</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
