import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/database/supabase-admin'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })
        }

        const supabaseAdmin = createAdminClient()
        if (!supabaseAdmin) {
            return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 })
        }

        // Since we need to bypass existing user passwords, we will search for the user by email
        // and forcefully update their password.
        // In @supabase/supabase-js recent versions, generating a link is easy or listing users handles it.

        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()

        if (listError) {
            return NextResponse.json({ success: false, error: listError.message }, { status: 400 })
        }

        const user = users.find((u: any) => u.email === email)

        if (user) {
            // User exists! Force update their password to the hidden password
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                user.id,
                { password }
            )

            if (updateError) {
                return NextResponse.json({ success: false, error: updateError.message }, { status: 400 })
            }

            return NextResponse.json({ success: true, message: 'Password synced' })
        } else {
            // User does not exist, standard signup will handle it in the client
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
        }

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
