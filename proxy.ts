import { NextResponse, type NextRequest } from 'next/server'
import {
  createSupabaseMiddlewareClient,
  authMiddleware,
  apiAuthMiddleware,
  addSecurityHeaders,
  rateLimitMiddleware,
  type MiddlewareContext,
} from '@/lib/middleware'

export async function proxy(request: NextRequest) {
  // 1. Rate limit API routes (100 req/min per IP per endpoint)
  const rateLimitResult = rateLimitMiddleware(request)
  if (rateLimitResult) return rateLimitResult

  // 2. Create Supabase client and refresh auth token
  const { supabaseResponse, user } = await createSupabaseMiddlewareClient(request)

  const context: MiddlewareContext = {
    request,
    response: supabaseResponse,
    user,
  }

  // 3. API Authentication check
  const apiAuthResult = apiAuthMiddleware(context)
  if (apiAuthResult) return addSecurityHeaders(apiAuthResult)

  // 4. Page Authentication and redirects
  const authResult = authMiddleware(context)
  if (authResult) return addSecurityHeaders(authResult)

  // 5. Add security headers to the main response
  return addSecurityHeaders(supabaseResponse)
}

export const config = {
  matcher: [
    /*
     * Match all routes except static files, _next internals, and public assets
     * This includes sw.js and manifest.json to ensure PWA works correctly
     */
    '/((?!_next/static|_next/image|favicon.ico|images|icons|sw.js|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
