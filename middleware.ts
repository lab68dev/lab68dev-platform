import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import {
  authMiddleware,
  apiAuthMiddleware,
  addSecurityHeaders,
  rateLimitMiddleware,
  type MiddlewareContext,
} from '@/lib/middleware'

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/dashboard/(.*)']

// Auth routes that should redirect to dashboard if already logged in
const AUTH_ROUTES = ['/login', '/signup']

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => {
    if (route.includes('(.*)')) {
      const baseRoute = route.replace('(.*)', '')
      return pathname.startsWith(baseRoute)
    }
    return pathname === route
  })
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.includes(pathname)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Rate limit API routes (100 req/min per IP per endpoint)
  const rateLimitResult = rateLimitMiddleware(request)
  if (rateLimitResult) return rateLimitResult

  // 2. Create Supabase client for middleware
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Get the current user session and refresh if needed
  const { data: { user } } = await supabase.auth.getUser()

  // 3. API Authentication check
  const context: MiddlewareContext = {
    request,
    response,
    user,
  }

  const apiAuthResult = apiAuthMiddleware(context)
  if (apiAuthResult) return addSecurityHeaders(apiAuthResult)

  // 4. Page Authentication and redirects
  const authResult = authMiddleware(context)
  if (authResult) return addSecurityHeaders(authResult)

  // Redirect authenticated users away from auth pages
  if (isAuthRoute(pathname) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users to login
  if (isProtectedRoute(pathname) && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 5. Add security headers to the response
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, icons (public assets)
     * - sw.js, manifest.json (PWA files)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|icons|sw.js|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
