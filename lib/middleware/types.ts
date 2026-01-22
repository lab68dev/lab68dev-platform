import { NextRequest, NextResponse } from 'next/server'
import { User } from '@supabase/supabase-js'

/**
 * Middleware context passed between middleware functions
 */
export interface MiddlewareContext {
    request: NextRequest
    response: NextResponse
    user: User | null
}

/**
 * Type for a middleware handler function
 */
export type MiddlewareHandler = (
    context: MiddlewareContext
) => Promise<NextResponse | null> | NextResponse | null

/**
 * Configuration for protected routes
 */
export interface RouteConfig {
    /** Routes that require authentication */
    protectedPaths: string[]
    /** Routes that should redirect authenticated users (e.g., login, signup) */
    authPaths: string[]
    /** Routes that require staff access */
    staffPaths: string[]
    /** API routes that require authentication */
    protectedApiPaths: string[]
}

/**
 * Default route configuration
 */
export const defaultRouteConfig: RouteConfig = {
    protectedPaths: ['/dashboard'],
    authPaths: ['/login', '/signup'],
    staffPaths: ['/staff/dashboard'],
    protectedApiPaths: ['/api/projects', '/api/resumes', '/api/chat'],
}
