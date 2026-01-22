/**
 * Middleware Module
 * 
 * This module provides a modular middleware system for Next.js applications.
 * It includes:
 * - Authentication middleware for protected routes
 * - API authentication for protected API endpoints
 * - Security headers and rate limiting
 * - Supabase client integration
 * 
 * @example
 * ```ts
 * import { createSupabaseMiddlewareClient, authMiddleware } from '@/lib/middleware'
 * 
 * export async function middleware(request: NextRequest) {
 *   const { supabaseResponse, user } = await createSupabaseMiddlewareClient(request)
 *   
 *   const context = { request, response: supabaseResponse, user }
 *   const authResult = authMiddleware(context)
 *   if (authResult) return authResult
 *   
 *   return supabaseResponse
 * }
 * ```
 */

// Types
export type {
    MiddlewareContext,
    MiddlewareHandler,
    RouteConfig,
} from './types'

export { defaultRouteConfig } from './types'

// Supabase
export {
    createSupabaseMiddlewareClient,
    type SupabaseMiddlewareResult,
} from './supabase'

// Authentication
export {
    authMiddleware,
    apiAuthMiddleware,
} from './auth'

// Security
export {
    addSecurityHeaders,
    rateLimitMiddleware,
} from './security'
