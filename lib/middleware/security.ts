import { NextRequest, NextResponse } from 'next/server'

/**
 * Security headers to add to all responses
 */
const securityHeaders: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
}

/**
 * Adds security headers to the response
 * 
 * @param response - The NextResponse to add headers to
 * @returns The response with security headers added
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
    })
    return response
}

/**
 * Simple in-memory rate limit store
 * Note: In production, use Redis or similar for distributed rate limiting
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
    /** Maximum requests allowed in the window */
    maxRequests: number
    /** Time window in milliseconds */
    windowMs: number
}

const defaultRateLimitConfig: RateLimitConfig = {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
}

/**
 * Rate limiting middleware for API routes
 * 
 * @param request - The incoming request
 * @param config - Rate limit configuration
 * @returns NextResponse with 429 if rate limited, null to continue
 */
export function rateLimitMiddleware(
    request: NextRequest,
    config: RateLimitConfig = defaultRateLimitConfig
): NextResponse | null {
    // Only apply to API routes
    if (!request.nextUrl.pathname.startsWith('/api')) {
        return null
    }

    const ip = request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown'
    const key = `${ip}:${request.nextUrl.pathname}`
    const now = Date.now()

    const record = rateLimitStore.get(key)

    if (!record || now > record.resetTime) {
        // First request or window expired
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + config.windowMs,
        })
        return null
    }

    if (record.count >= config.maxRequests) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000)
        return NextResponse.json(
            { error: 'Too Many Requests', message: 'Rate limit exceeded' },
            {
                status: 429,
                headers: {
                    'Retry-After': retryAfter.toString(),
                    'X-RateLimit-Limit': config.maxRequests.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': record.resetTime.toString(),
                },
            }
        )
    }

    // Increment count
    record.count++
    rateLimitStore.set(key, record)

    return null
}

// Cleanup old entries periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now()
        for (const [key, record] of rateLimitStore.entries()) {
            if (now > record.resetTime) {
                rateLimitStore.delete(key)
            }
        }
    }, 5 * 60 * 1000)
}
