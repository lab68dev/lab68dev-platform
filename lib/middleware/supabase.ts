import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { User } from '@supabase/supabase-js'

/**
 * Result of creating a Supabase client in middleware
 */
export interface SupabaseMiddlewareResult {
    supabaseResponse: NextResponse
    user: User | null
}

/**
 * Creates a Supabase server client for middleware and refreshes auth tokens
 * 
 * @param request - The incoming Next.js request
 * @returns Object containing the response with updated cookies and the current user
 */
export async function createSupabaseMiddlewareClient(
    request: NextRequest
): Promise<SupabaseMiddlewareResult> {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Refresh the auth token
    const { data: { user } } = await supabase.auth.getUser()

    return {
        supabaseResponse,
        user,
    }
}
