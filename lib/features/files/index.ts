import { createClient } from '@/lib/database/supabase-client'
import { logActivity } from '@/lib/features/activity'
import type { FileRecord } from '@/lib/database/connection'

export type { FileRecord }

function guard() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('[Lab68Dev] Supabase is not configured.')
    }
}

export async function createFile(file: Omit<FileRecord, 'id' | 'created_at' | 'updated_at'>) {
    guard()
    const supabase = createClient()
    const { data, error } = await supabase.from('files').insert(file).select().single()
    if (error) throw error
    if (data) logActivity('file', 'uploaded', `Uploaded file '${data.name}'`, data.id, data.name)
    return data
}

export async function getFiles(userId: string) {
    guard()
    const supabase = createClient()
    const { data, error } = await supabase
        .from('files').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (error) throw error
    return data || []
}

export async function deleteFile(id: string) {
    guard()
    const supabase = createClient()
    const { error } = await supabase.from('files').delete().eq('id', id)
    if (error) throw error
}
