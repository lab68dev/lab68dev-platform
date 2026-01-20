import { createClient } from '@supabase/supabase-js'

// Create a Supabase client with the SERVICE_ROLE_KEY for admin access
// This bypasses Row Level Security (RLS) - USE WITH CAUTION
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase Service Role Key')
        return null
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
