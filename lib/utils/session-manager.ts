/**
 * Session Management Utilities
 * Track and manage user sessions across devices
 */

export interface UserSession {
  id: string
  userId: string
  deviceInfo: {
    userAgent: string
    browser: string
    os: string
    device: string
  }
  location: {
    ip: string
    country?: string
    city?: string
  }
  createdAt: string
  lastActivity: string
  expiresAt: string
  isActive: boolean
  isCurrent: boolean
}

/**
 * Parse user agent to extract device information
 */
export function parseUserAgent(userAgent: string): {
  browser: string
  os: string
  device: string
} {
  // Simple parser - in production, use a library like ua-parser-js
  const browser = detectBrowser(userAgent)
  const os = detectOS(userAgent)
  const device = detectDevice(userAgent)

  return { browser, os, device }
}

function detectBrowser(ua: string): string {
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Edg')) return 'Edge'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Opera')) return 'Opera'
  return 'Unknown Browser'
}

function detectOS(ua: string): string {
  if (ua.includes('Windows')) return 'Windows'
  if (ua.includes('Mac OS X')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('iOS')) return 'iOS'
  return 'Unknown OS'
}

function detectDevice(ua: string): string {
  if (ua.includes('Mobile')) return 'Mobile'
  if (ua.includes('Tablet')) return 'Tablet'
  return 'Desktop'
}

/**
 * Get location from IP address (placeholder)
 * In production, integrate with a geolocation API
 */
export async function getLocationFromIP(ip: string): Promise<{
  country?: string
  city?: string
}> {
  // TODO: Integrate with IP geolocation API (e.g., ipapi.co, ip-api.com)
  // For now, return placeholder
  return {
    country: 'Unknown',
    city: 'Unknown',
  }
}

/**
 * Create session record
 */
export function createSession(
  userId: string,
  userAgent: string,
  ip: string,
  expiresIn: number = 7 * 24 * 60 * 60 * 1000 // 7 days default
): Omit<UserSession, 'location'> {
  const now = new Date().toISOString()
  const deviceInfo = parseUserAgent(userAgent)

  return {
    id: generateSessionId(),
    userId,
    deviceInfo: {
      userAgent,
      ...deviceInfo,
    },
    location: {
      ip,
    },
    createdAt: now,
    lastActivity: now,
    expiresAt: new Date(Date.now() + expiresIn).toISOString(),
    isActive: true,
    isCurrent: true,
  }
}

/**
 * Generate unique session ID
 */
function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Check if session is expired
 */
export function isSessionExpired(session: UserSession): boolean {
  return new Date(session.expiresAt) < new Date()
}

/**
 * Update session activity
 */
export function updateSessionActivity(session: UserSession): UserSession {
  return {
    ...session,
    lastActivity: new Date().toISOString(),
  }
}

/**
 * Invalidate session
 */
export function invalidateSession(session: UserSession): UserSession {
  return {
    ...session,
    isActive: false,
    expiresAt: new Date().toISOString(),
  }
}

/**
 * Check for suspicious session activity
 */
export function detectSuspiciousActivity(
  currentSession: UserSession,
  previousSession: UserSession
): {
  suspicious: boolean
  reasons: string[]
} {
  const reasons: string[] = []

  // Check for impossible travel
  if (
    currentSession.location.country &&
    previousSession.location.country &&
    currentSession.location.country !== previousSession.location.country
  ) {
    const timeDiff =
      new Date(currentSession.createdAt).getTime() -
      new Date(previousSession.lastActivity).getTime()

    // If country changed in less than 1 hour, flag as suspicious
    if (timeDiff < 60 * 60 * 1000) {
      reasons.push('Impossible travel detected')
    }
  }

  // Check for device change
  if (currentSession.deviceInfo.device !== previousSession.deviceInfo.device) {
    reasons.push('New device detected')
  }

  // Check for OS change
  if (currentSession.deviceInfo.os !== previousSession.deviceInfo.os) {
    reasons.push('Different operating system')
  }

  return {
    suspicious: reasons.length > 0,
    reasons,
  }
}

/**
 * Format session for display
 */
export function formatSessionDisplay(session: UserSession): {
  title: string
  subtitle: string
  icon: string
} {
  const { deviceInfo, location } = session
  const locationStr = [location.city, location.country]
    .filter(Boolean)
    .join(', ') || 'Unknown location'

  return {
    title: `${deviceInfo.browser} on ${deviceInfo.os}`,
    subtitle: `${locationStr} • Last active ${formatRelativeTime(session.lastActivity)}`,
    icon: getDeviceIcon(deviceInfo.device),
  }
}

/**
 * Get device icon name
 */
function getDeviceIcon(device: string): string {
  switch (device.toLowerCase()) {
    case 'mobile':
      return 'smartphone'
    case 'tablet':
      return 'tablet'
    default:
      return 'desktop'
  }
}

/**
 * Format relative time
 */
function formatRelativeTime(timestamp: string): string {
  const now = Date.now()
  const then = new Date(timestamp).getTime()
  const diff = now - then

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}
