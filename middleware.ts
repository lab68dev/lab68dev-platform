import { NextResponse, type NextRequest } from 'next/server'
import {
  createSupabaseMiddlewareClient,
  authMiddleware,
  apiAuthMiddleware,
  addSecurityHeaders,
  rateLimitMiddleware,
  type MiddlewareContext,
} from '@/lib/middleware'

export async function middleware(request: NextRequest) {
  // Apply rate limiting for API routes
  const rateLimitResult = rateLimitMiddleware(request)
  if (rateLimitResult) return rateLimitResult

  // Create Supabase client and refresh auth token
  const { supabaseResponse, user } = await createSupabaseMiddlewareClient(request)

  // Create middleware context
  const context: MiddlewareContext = {
    request,
    response: supabaseResponse,
    user,
  }

  // Check API authentication
  const apiAuthResult = apiAuthMiddleware(context)
  if (apiAuthResult) return apiAuthResult

  // Check page authentication and redirects
  const authResult = authMiddleware(context)
  if (authResult) return authResult

  // Add security headers to response
  addSecurityHeaders(supabaseResponse)

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
