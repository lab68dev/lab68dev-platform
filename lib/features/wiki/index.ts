import 'server-only'
import { createClient } from '@/lib/database/supabase-client'
import type { WikiArticle } from '@/lib/database/connection'

export type { WikiArticle }

function guard() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('[Lab68Dev] Supabase is not configured.')
    }
}

export async function createWikiArticle(article: Omit<WikiArticle, 'id' | 'created_at' | 'updated_at'>) {
    guard()
    const supabase = createClient()
    const { data, error } = await supabase.from('wiki_articles').insert(article).select().single()
    if (error) throw error
    return data
}

export async function getWikiArticles(userId?: string) {
    guard()
    const supabase = createClient()
    let query = supabase.from('wiki_articles').select('*').order('created_at', { ascending: false })
    if (userId) query = query.eq('user_id', userId)
    const { data, error } = await query
    if (error) throw error
    return data || []
}

export async function updateWikiArticle(id: string, updates: Partial<WikiArticle>) {
    guard()
    const supabase = createClient()
    const { data, error } = await supabase
        .from('wiki_articles').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
}

export async function deleteWikiArticle(id: string) {
    guard()
    const supabase = createClient()
    const { error } = await supabase.from('wiki_articles').delete().eq('id', id)
    if (error) throw error
}
