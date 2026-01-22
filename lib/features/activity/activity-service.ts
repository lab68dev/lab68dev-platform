import { createClient } from "../../database/supabase-client"
import { getCurrentUser } from "../auth"

export interface Activity {
    id: string
    user_id: string
    type: 'project' | 'todo' | 'meeting' | 'file' | 'chat' | 'whiteboard' | 'settings'
    action: 'created' | 'updated' | 'deleted' | 'completed' | 'scheduled' | 'uploaded'
    description: string
    entity_id?: string
    entity_title?: string
    created_at: string
}

export type ActivityType = Activity['type']
export type ActivityAction = Activity['action']

/**
 * Log a new user activity
 */
export async function logActivity(
    type: ActivityType,
    action: ActivityAction,
    description: string,
    entityId?: string,
    entityTitle?: string
): Promise<Activity | null> {
    const user = getCurrentUser()
    if (!user) return null

    const newActivity: Omit<Activity, 'id' | 'created_at'> = {
        user_id: user.id,
        type,
        action,
        description,
        entity_id: entityId,
        entity_title: entityTitle
    }

    try {
        // Check if Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            return logActivityLocal(newActivity)
        }

        const supabase = createClient()
        const { data, error } = await supabase
            .from('activities')
            .insert({
                ...newActivity,
                // Supabase expects snake_case but we might be passing camelCase if we're not careful,
                // specifically for created_at which is auto-generated
            })
            .select()
            .single()

        if (error) {
            console.warn('Supabase error logging activity, using localStorage fallback:', error)
            return logActivityLocal(newActivity)
        }

        return data
    } catch (err) {
        console.warn('Error logging activity:', err)
        return logActivityLocal(newActivity)
    }
}

/**
 * Get recent activities for a user
 */
export async function getRecentActivities(limit = 10): Promise<Activity[]> {
    const user = getCurrentUser()
    if (!user) return []

    try {
        // Check if Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            return getActivitiesLocal(user.id, limit)
        }

        const supabase = createClient()
        const { data, error } = await supabase
            .from('activities')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) {
            console.warn('Supabase error fetching activities, using localStorage fallback:', error)
            return getActivitiesLocal(user.id, limit)
        }

        return data || []
    } catch (err) {
        console.warn('Error fetching activities:', err)
        return getActivitiesLocal(user.id, limit)
    }
}

// ==========================================
// LocalStorage Fallback Implementation
// ==========================================

function logActivityLocal(activity: Omit<Activity, 'id' | 'created_at'>): Activity {
    const fullActivity: Activity = {
        ...activity,
        id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        created_at: new Date().toISOString()
    }

    try {
        const key = `activities_${activity.user_id}`
        const stored = localStorage.getItem(key) || '[]'
        const activities: Activity[] = JSON.parse(stored)

        // Add to beginning
        activities.unshift(fullActivity)

        // Keep max 50 items locally
        if (activities.length > 50) {
            activities.length = 50
        }

        localStorage.setItem(key, JSON.stringify(activities))
    } catch (e) {
        console.error('LocalStorage error:', e)
    }

    return fullActivity
}

function getActivitiesLocal(userId: string, limit: number): Activity[] {
    try {
        const key = `activities_${userId}`
        const stored = localStorage.getItem(key)
        if (!stored) return []

        const activities: Activity[] = JSON.parse(stored)
        return activities.slice(0, limit)
    } catch (e) {
        console.error('LocalStorage error:', e)
        return []
    }
}
