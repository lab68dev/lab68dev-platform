import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseMiddlewareClient } from '@/lib/middleware/supabase'
import { authMiddleware } from '@/lib/middleware/auth'
import { rateLimitMiddleware, addSecurityHeaders } from '@/lib/middleware/security'

export async function middleware(request: NextRequest) {
  // 1. Rate limit API routes (100 req/min per IP per endpoint)
  const rateLimitResult = rateLimitMiddleware(request)
  if (rateLimitResult) return rateLimitResult

  // 2. Create Supabase middleware client (refreshes session)
  const { supabaseResponse, user } = await createSupabaseMiddlewareClient(request)

  // 3. Auth middleware — redirects unauthenticated users from protected routes
  const context = { request, response: supabaseResponse, user }
  const authResult = authMiddleware(context)
  if (authResult) return addSecurityHeaders(authResult)

  // 4. Add security headers to all responses
  return addSecurityHeaders(supabaseResponse)
}

export const config = {
  matcher: [
    // Match all routes except static files, _next internals, and public assets
    '/((?!_next/static|_next/image|favicon.ico|images|icons|sw.js|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
