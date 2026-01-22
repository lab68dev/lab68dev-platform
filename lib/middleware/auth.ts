import { NextResponse } from 'next/server'
import { MiddlewareContext, RouteConfig, defaultRouteConfig } from './types'

/**
 * Checks if the current path matches any of the provided paths
 */
function matchesPath(pathname: string, paths: string[]): boolean {
    return paths.some(path => pathname.startsWith(path))
}

/**
 * Authentication middleware handler
 * 
 * Handles:
 * - Redirecting unauthenticated users from protected routes to login
 * - Redirecting authenticated users from auth routes to dashboard
 * - Protecting staff-only routes
 * 
 * @param context - The middleware context
 * @param config - Route configuration (optional, uses defaults if not provided)
 * @returns NextResponse if redirect is needed, null to continue chain
 */
export function authMiddleware(
    context: MiddlewareContext,
    config: RouteConfig = defaultRouteConfig
): NextResponse | null {
    const { request, response, user } = context
    const pathname = request.nextUrl.pathname

    // Check if path is protected and user is not authenticated
    if (matchesPath(pathname, config.protectedPaths) && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
    }

    // Check if path is auth-only and user is already authenticated
    if (matchesPath(pathname, config.authPaths) && user) {
        const url = request.nextUrl.clone()
        const redirect = url.searchParams.get('redirect') || '/dashboard'
        url.pathname = redirect
        url.searchParams.delete('redirect')
        return NextResponse.redirect(url)
    }

    // Check if path is staff-only
    if (matchesPath(pathname, config.staffPaths) && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/staff/login'
        return NextResponse.redirect(url)
    }

    return null
}

/**
 * API authentication middleware handler
 * 
 * Protects API routes that require authentication
 * 
 * @param context - The middleware context
 * @param config - Route configuration (optional)
 * @returns NextResponse with 401 if unauthorized, null to continue chain
 */
export function apiAuthMiddleware(
    context: MiddlewareContext,
    config: RouteConfig = defaultRouteConfig
): NextResponse | null {
    const { request, user } = context
    const pathname = request.nextUrl.pathname

    // Check if this is a protected API route
    if (matchesPath(pathname, config.protectedApiPaths) && !user) {
        return NextResponse.json(
            { error: 'Unauthorized', message: 'Authentication required' },
            { status: 401 }
        )
    }

    return null
}
