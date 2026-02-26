import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/database/supabase-server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('query')

        if (!query) {
            return NextResponse.json({ users: [] })
        }

        // 1. Authenticate the request (ensure user is logged in)
        const supabaseServer = await createServerSupabaseClient()
        const { data: { user }, error: authError } = await supabaseServer.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Use Standard Server Client instead of Admin to fetch profiles
        const trimmedQuery = query.trim()
        const safeQuery = trimmedQuery.replace(/[,%()]/g, '')

        const { data, error } = await supabaseServer
            .from('profiles')
            .select('id, email, name, avatar')
            .or(`email.ilike.%${safeQuery}%,name.ilike.%${safeQuery}%`)
            .limit(10)

        if (error) {
            console.error('Error searching users:', error)
            return NextResponse.json({ error: 'Search failed' }, { status: 500 })
        }

        return NextResponse.json({ users: data || [] })

    } catch (error) {
        console.error('Unexpected error in user search API:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
