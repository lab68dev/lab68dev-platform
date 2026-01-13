/**
 * Rate Limiter Middleware for API Routes
 * Prevents brute force attacks and abuse
 */

interface RateLimitEntry {
  count: number
  resetTime: number
  lockedUntil?: number
}

interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
  lockoutDurationMs?: number
  keyGenerator?: (req: Request) => string
}

// In-memory store (for production, use Redis or similar)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now && (!value.lockedUntil || value.lockedUntil < now)) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Rate limiter for API routes
 * @param config - Rate limit configuration
 * @returns Middleware function
 */
export function rateLimit(config: RateLimitConfig) {
  const {
    maxAttempts,
    windowMs,
    lockoutDurationMs = 15 * 60 * 1000, // 15 minutes default
    keyGenerator = (req: Request) => {
      // Default: use IP address
      const forwarded = req.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
      return ip
    },
  } = config

  return async function rateLimitMiddleware(req: Request): Promise<{
    allowed: boolean
    remaining: number
    resetTime: number
    lockedUntil?: number
  }> {
    const key = keyGenerator(req)
    const now = Date.now()

    let entry = rateLimitStore.get(key)

    // Check if account is locked out
    if (entry?.lockedUntil && entry.lockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        lockedUntil: entry.lockedUntil,
      }
    }

    // Reset if window has passed
    if (!entry || entry.resetTime < now) {
      entry = {
        count: 0,
        resetTime: now + windowMs,
      }
      rateLimitStore.set(key, entry)
    }

    // Increment counter
    entry.count++

    // Check if limit exceeded
    if (entry.count > maxAttempts) {
      // Lock the account
      entry.lockedUntil = now + lockoutDurationMs
      rateLimitStore.set(key, entry)

      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        lockedUntil: entry.lockedUntil,
      }
    }

    const remaining = Math.max(0, maxAttempts - entry.count)

    return {
      allowed: true,
      remaining,
      resetTime: entry.resetTime,
    }
  }
}

/**
 * Login rate limiter - strict limits
 */
export const loginRateLimit = rateLimit({
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  lockoutDurationMs: 30 * 60 * 1000, // 30 minutes lockout
})

/**
 * Signup rate limiter - moderate limits
 */
export const signupRateLimit = rateLimit({
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
  lockoutDurationMs: 60 * 60 * 1000, // 1 hour lockout
})

/**
 * Password reset rate limiter - very strict
 */
export const passwordResetRateLimit = rateLimit({
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
  lockoutDurationMs: 2 * 60 * 60 * 1000, // 2 hours lockout
})

/**
 * API general rate limiter - moderate
 */
export const apiRateLimit = rateLimit({
  maxAttempts: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
})

/**
 * Clear rate limit for a specific key (e.g., after successful login)
 */
export function clearRateLimit(req: Request, keyGenerator?: (req: Request) => string): void {
  const key = keyGenerator
    ? keyGenerator(req)
    : req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  
  rateLimitStore.delete(key)
}

/**
 * Get current rate limit status
 */
export function getRateLimitStatus(
  req: Request,
  keyGenerator?: (req: Request) => string
): RateLimitEntry | null {
  const key = keyGenerator
    ? keyGenerator(req)
    : req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  
  return rateLimitStore.get(key) || null
}
