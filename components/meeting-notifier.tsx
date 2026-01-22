"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { getMeetings, type Meeting } from "@/lib/database"
import { getCurrentUser } from "@/lib/features/auth"

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
    return () => clearInterval(refreshInterval)
  }, [])

  // Check for upcoming meetings every minute
  useEffect(() => {
    const checkUpcomingMeetings = () => {
      const now = new Date()
      const notifiedKey = "notified_meetings"
      const notified = JSON.parse(localStorage.getItem(notifiedKey) || "[]") as string[]
      
      meetings.forEach(meeting => {
        // Skip if already notified
        if (notified.includes(meeting.id)) return
        
        // Combine date and time
        // Note: meeting.date is YYYY-MM-DD string, we might need to be careful with timezones
        // Assuming meeting.date and meeting.time are stored in local time or consistent UTC
        // The previous file showed meeting.date as a string. 
        // Let's construct a date object. 
        // If meeting.date is a full ISO string (from DB), we just use it.
        // In DB definition (lib/database.ts): date: string 
        // In page.tsx it was splitting it. DB usually returns ISO string for timestamptz.
        // Let's try to parse it safely.
        
        let meetingTime: Date
        if (meeting.date.includes("T")) {
             meetingTime = new Date(meeting.date)
        } else {
             // Fallback if it's just date string, though our DB typically stores full ISO
             meetingTime = new Date(meeting.date) 
        }

        const diffInMinutes = (meetingTime.getTime() - now.getTime()) / (1000 * 60)
        
        // Notify if meeting is starting in 0-10 minutes
        if (diffInMinutes > 0 && diffInMinutes <= 10) {
          // Show notification
          toast(
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-start justify-between">
                <span className="font-bold text-sm">Upcoming Meeting</span>
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
              duration: 10000, // Show for 10 seconds
              position: "top-right",
              action: {
                label: "Join",
                onClick: () => router.push("/dashboard/meeting")
              }
            }
          )
          
          // Mark as notified
          const updatedNotified = [...notified, meeting.id]
          localStorage.setItem(notifiedKey, JSON.stringify(updatedNotified))
        }
      })
    }
    
    // Initial check
    if (meetings.length > 0) {
      checkUpcomingMeetings()
    }
    
    // Periodic check every minute
    const interval = setInterval(checkUpcomingMeetings, 60 * 1000)
    return () => clearInterval(interval)
  }, [meetings, router])

  return null // This component doesn't render anything visible
}
