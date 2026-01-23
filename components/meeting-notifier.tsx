"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { Clock, Bell, BellOff, Volume2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { getMeetings, type Meeting } from "@/lib/database"
import { getCurrentUser } from "@/lib/features/auth"
import {
  getReminderPreferences,
  hasBeenNotified,
  markAsNotified,
  isMeetingSnoozed,
  snoozeMeeting,
  showBrowserNotification,
  playNotificationSound,
  cleanupOldNotifications,
  canShowBrowserNotifications,
} from "@/lib/utils/meeting-notifications"

export function MeetingNotifier() {
  const router = useRouter()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  
  // Load meetings on mount
  useEffect(() => {
    const fetchMeetings = async () => {
      const user = getCurrentUser()
      if (!user) return
      
      try {
        const data = await getMeetings(user.id)
        setMeetings(data)
      } catch (error) {
        console.error("Failed to fetch meetings for notifications", error)
      }
    }
    
    fetchMeetings()
    
    // Refresh meetings every 5 minutes to keep up to date
    const refreshInterval = setInterval(fetchMeetings, 5 * 60 * 1000)
    
    // Clean up old notification records periodically
    cleanupOldNotifications()
    
    return () => clearInterval(refreshInterval)
  }, [])

  // Handle snooze action
  const handleSnooze = useCallback((meetingId: string, meetingTitle: string) => {
    const snoozeUntil = snoozeMeeting(meetingId, 5) // 5 minute snooze
    toast.success(`Snoozed "${meetingTitle}" for 5 minutes`, {
      duration: 3000,
      position: "top-right"
    })
  }, [])

  // Check for upcoming meetings every minute
  useEffect(() => {
    const checkUpcomingMeetings = () => {
      const prefs = getReminderPreferences()
      
      // Skip if notifications are disabled
      if (!prefs.enabled) return
      
      const now = new Date()
      
      meetings.forEach(meeting => {
        // Skip if snoozed
        if (isMeetingSnoozed(meeting.id)) return
        
        // Parse meeting time
        let meetingTime: Date
        if (meeting.date.includes("T")) {
          meetingTime = new Date(meeting.date)
        } else {
          meetingTime = new Date(meeting.date)
        }

        const diffInMinutes = (meetingTime.getTime() - now.getTime()) / (1000 * 60)
        
        // Check each configured interval
        for (const interval of prefs.intervals) {
          // Notify if meeting is within this interval window (with 1 minute tolerance)
          if (diffInMinutes > 0 && diffInMinutes <= interval && diffInMinutes > interval - 1) {
            // Skip if already notified for this interval
            if (hasBeenNotified(meeting.id, interval)) continue
            
            // Mark as notified immediately to prevent duplicates
            markAsNotified(meeting.id, interval)
            
            // Play sound if enabled
            if (prefs.soundEnabled) {
              playNotificationSound(prefs.soundVolume)
            }
            
            // Show browser notification if enabled and permitted
            if (prefs.browserNotifications && canShowBrowserNotifications()) {
              showBrowserNotification(
                "📅 Upcoming Meeting",
                `${meeting.title} starts in ${Math.ceil(diffInMinutes)} minutes`,
                {
                  onClick: () => router.push("/dashboard/meeting"),
                  requireInteraction: true
                }
              )
            }
            
            // Always show toast notification
            toast(
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    <span className="font-bold text-sm">Upcoming Meeting</span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    in {Math.ceil(diffInMinutes)} min
                  </span>
                </div>
                <p className="text-sm font-medium leading-tight">{meeting.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3" />
                  {meetingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>,
              {
                duration: 15000, // Show for 15 seconds
                position: "top-right",
                action: {
                  label: "Join",
                  onClick: () => router.push("/dashboard/meeting")
                },
                cancel: {
                  label: "Snooze",
                  onClick: () => handleSnooze(meeting.id, meeting.title)
                }
              }
            )
            
            // Only trigger one notification per check cycle per meeting
            break
          }
        }
        
        // Also check for meetings starting NOW (within 1 minute)
        if (diffInMinutes > 0 && diffInMinutes <= 1) {
          if (!hasBeenNotified(meeting.id, 0)) {
            markAsNotified(meeting.id, 0)
            
            // Play urgent sound
            if (prefs.soundEnabled) {
              playNotificationSound(Math.min(prefs.soundVolume + 0.2, 1))
            }
            
            // Show urgent browser notification
            if (prefs.browserNotifications && canShowBrowserNotifications()) {
              showBrowserNotification(
                "🔔 Meeting Starting NOW!",
                meeting.title,
                {
                  onClick: () => router.push("/dashboard/meeting"),
                  requireInteraction: true
                }
              )
            }
            
            // Show urgent toast
            toast.error(
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 animate-pulse" />
                  <span className="font-bold text-sm">Meeting Starting Now!</span>
                </div>
                <p className="text-sm font-medium leading-tight">{meeting.title}</p>
              </div>,
              {
                duration: 30000,
                position: "top-right",
                action: {
                  label: "Join Now",
                  onClick: () => router.push("/dashboard/meeting")
                }
              }
            )
          }
        }
      })
    }
    
    // Initial check
    if (meetings.length > 0) {
      checkUpcomingMeetings()
    }
    
    // Periodic check every 30 seconds for more accurate notifications
    const interval = setInterval(checkUpcomingMeetings, 30 * 1000)
    return () => clearInterval(interval)
  }, [meetings, router, handleSnooze])

  return null // This component doesn't render anything visible
}
