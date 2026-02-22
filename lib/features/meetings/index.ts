import { createClient } from '@/lib/database/supabase-client'
import { logActivity } from '@/lib/features/activity'
import type { Meeting } from '@/lib/database/connection'

export type { Meeting }

function guard() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('[Lab68Dev] Supabase is not configured.')
    }
}

export async function createMeeting(meeting: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>) {
    guard()
    const supabase = createClient()
    const { data, error } = await supabase.from('meetings').insert(meeting).select().single()
    if (error) throw error
    if (data) logActivity('meeting', 'scheduled', `Scheduled meeting '${data.title}'`, data.id, data.title)
    return data
}

export async function getMeetings(userId: string) {
    guard()
    const supabase = createClient()
    const { data, error } = await supabase
        .from('meetings').select('*').eq('user_id', userId).order('date', { ascending: true })
    if (error) throw error
    return data || []
}

export async function updateMeeting(id: string, updates: Partial<Meeting>) {
    guard()
    const supabase = createClient()
    const { data, error } = await supabase.from('meetings').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
}

export async function deleteMeeting(id: string) {
    guard()
    const supabase = createClient()
    const { error } = await supabase.from('meetings').delete().eq('id', id)
    if (error) throw error
}
