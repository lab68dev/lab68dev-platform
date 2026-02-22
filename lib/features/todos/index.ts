import 'server-only'
import { createClient } from '@/lib/database/supabase-client'
import { logActivity } from '@/lib/features/activity'
import type { Todo } from '@/lib/database/connection'

export type { Todo }

function guard() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('[Lab68Dev] Supabase is not configured.')
    }
}

export async function createTodo(todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) {
    guard()
    const supabase = createClient()
    const { data, error } = await supabase.from('todos').insert(todo).select().single()
    if (error) throw error
    if (data) logActivity('todo', 'created', `Created task '${data.title}'`, data.id, data.title)
    return data
}

export async function getTodos(userId: string) {
    guard()
    const supabase = createClient()
    const { data, error } = await supabase
        .from('todos').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (error) throw error
    return data || []
}

export async function updateTodo(id: string, updates: Partial<Todo>) {
    guard()
    const supabase = createClient()
    const { data, error } = await supabase.from('todos').update(updates).eq('id', id).select().single()
    if (error) throw error
    if (data) {
        if (updates.completed === true) {
            logActivity('todo', 'completed', `Completed task '${data.title}'`, data.id, data.title)
        } else {
            logActivity('todo', 'updated', `Updated task '${data.title}'`, data.id, data.title)
        }
    }
    return data
}

export async function deleteTodo(id: string) {
    guard()
    const supabase = createClient()
    const { error } = await supabase.from('todos').delete().eq('id', id)
    if (error) throw error
}
