/**
 * Meeting Reminder Notification Utilities
 * Handles notification preferences, browser notifications, and sound alerts
 */

// Types
export interface ReminderPreferences {
    enabled: boolean
    intervals: number[] // minutes before meeting (e.g., [5, 10, 15, 30])
    browserNotifications: boolean
    soundEnabled: boolean
    soundVolume: number // 0-1
}

// Default preferences
const DEFAULT_PREFERENCES: ReminderPreferences = {
    enabled: true,
    intervals: [10], // Default: 10 minutes before
    browserNotifications: false,
    soundEnabled: true,
    soundVolume: 0.5,
}

const STORAGE_KEY = 'lab68_meeting_reminder_preferences'

/**
 * Get reminder preferences from localStorage
 */
export function getReminderPreferences(): ReminderPreferences {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) }
        }
    } catch (e) {
        console.error('Failed to load reminder preferences:', e)
    }
    return DEFAULT_PREFERENCES
}

/**
 * Save reminder preferences to localStorage
 */
export function setReminderPreferences(prefs: Partial<ReminderPreferences>): void {
    if (typeof window === 'undefined') return

    try {
        const current = getReminderPreferences()
        const updated = { ...current, ...prefs }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

        // Dispatch event for components to react
        window.dispatchEvent(new CustomEvent('lab68_reminder_prefs_change', { detail: updated }))
    } catch (e) {
        console.error('Failed to save reminder preferences:', e)
    }
}

/**
 * Request browser notification permission
 * Returns true if granted, false otherwise
 */
export async function requestNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
        console.warn('Browser notifications not supported')
        return false
    }

    if (Notification.permission === 'granted') {
        return true
    }

    if (Notification.permission === 'denied') {
        console.warn('Browser notifications are blocked')
        return false
    }

    try {
        const permission = await Notification.requestPermission()
        return permission === 'granted'
    } catch (e) {
        console.error('Failed to request notification permission:', e)
        return false
    }
}

/**
 * Check if browser notifications are available and permitted
 */
export function canShowBrowserNotifications(): boolean {
    if (typeof window === 'undefined' || !('Notification' in window)) {
        return false
    }
    return Notification.permission === 'granted'
}

/**
 * Show a browser notification for a meeting
 */
export function showBrowserNotification(
    title: string,
    body: string,
    options?: {
        icon?: string
        onClick?: () => void
        requireInteraction?: boolean
    }
): void {
    if (!canShowBrowserNotifications()) return

    try {
        const notification = new Notification(title, {
            body,
            icon: options?.icon || '/icon.png',
            badge: '/icon.png',
            requireInteraction: options?.requireInteraction ?? true,
            tag: 'meeting-reminder',
        })

        if (options?.onClick) {
            notification.onclick = () => {
                window.focus()
                options.onClick?.()
                notification.close()
            }
        }

        // Auto-close after 30 seconds
        setTimeout(() => notification.close(), 30000)
    } catch (e) {
        console.error('Failed to show browser notification:', e)
    }
}

/**
 * Play notification sound
 */
export function playNotificationSound(volume?: number): void {
    if (typeof window === 'undefined') return

    const prefs = getReminderPreferences()
    if (!prefs.soundEnabled) return

    try {
        const audio = new Audio('/sounds/timer-complete.mp3')
        audio.volume = volume ?? prefs.soundVolume
        audio.play().catch(e => console.log('Audio play failed:', e))
    } catch (e) {
        console.error('Audio setup failed:', e)
    }
}

/**
 * Track which meetings have been notified for which intervals
 * Key format: `${meetingId}_${minutesBefore}`
 */
const NOTIFIED_KEY = 'lab68_notified_meeting_reminders'

export function hasBeenNotified(meetingId: string, minutesBefore: number): boolean {
    if (typeof window === 'undefined') return true

    try {
        const notified = JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '[]') as string[]
        return notified.includes(`${meetingId}_${minutesBefore}`)
    } catch {
        return false
    }
}

export function markAsNotified(meetingId: string, minutesBefore: number): void {
    if (typeof window === 'undefined') return

    try {
        const notified = JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '[]') as string[]
        const key = `${meetingId}_${minutesBefore}`
        if (!notified.includes(key)) {
            notified.push(key)
            localStorage.setItem(NOTIFIED_KEY, JSON.stringify(notified))
        }
    } catch (e) {
        console.error('Failed to mark notification:', e)
    }
}

/**
 * Clean up old notification records (older than 24 hours to prevent memory growth)
 */
export function cleanupOldNotifications(): void {
    if (typeof window === 'undefined') return

    // This runs periodically; for simplicity we just keep the array limited
    try {
        const notified = JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '[]') as string[]
        // Keep only last 100 entries
        if (notified.length > 100) {
            localStorage.setItem(NOTIFIED_KEY, JSON.stringify(notified.slice(-100)))
        }
    } catch {
        // Ignore
    }
}

/**
 * Snooze a notification for a specific meeting
 * Returns the snooze end time
 */
const SNOOZE_KEY = 'lab68_snoozed_reminders'

export function snoozeMeeting(meetingId: string, snoozeMinutes: number = 5): Date {
    if (typeof window === 'undefined') return new Date()

    const snoozeUntil = new Date(Date.now() + snoozeMinutes * 60 * 1000)

    try {
        const snoozed = JSON.parse(localStorage.getItem(SNOOZE_KEY) || '{}') as Record<string, string>
        snoozed[meetingId] = snoozeUntil.toISOString()
        localStorage.setItem(SNOOZE_KEY, JSON.stringify(snoozed))
    } catch (e) {
        console.error('Failed to snooze meeting:', e)
    }

    return snoozeUntil
}

export function isMeetingSnoozed(meetingId: string): boolean {
    if (typeof window === 'undefined') return false

    try {
        const snoozed = JSON.parse(localStorage.getItem(SNOOZE_KEY) || '{}') as Record<string, string>
        const snoozeUntil = snoozed[meetingId]
        if (snoozeUntil) {
            return new Date(snoozeUntil) > new Date()
        }
    } catch {
        // Ignore
    }

    return false
}

/**
 * Get available reminder interval options
 */
export function getAvailableIntervals(): { value: number; label: string }[] {
    return [
        { value: 5, label: '5 minutes' },
        { value: 10, label: '10 minutes' },
        { value: 15, label: '15 minutes' },
        { value: 30, label: '30 minutes' },
        { value: 60, label: '1 hour' },
    ]
}
