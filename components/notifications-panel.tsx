"use client"

import { useState, useEffect } from "react"
import { Bell, X, Calendar, Clock } from "lucide-react"
import { createClient } from "@/lib/database/supabase-client"
import { getCurrentUser } from "@/lib/features/auth"
import { getTranslations, getUserLanguage } from "@/lib/config"

interface Meeting {
  id: string
  userId: string
  title: string
  date: string
  time: string
  duration: number
}

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([])
  const [language, setLanguage] = useState(getUserLanguage())
  const t = getTranslations(language)

  const fetchUpcomingMeetings = async (userId: string) => {
    const supabase = createClient()
    const now = new Date().toISOString()
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('user_id', userId)
      .gt('date', now.split('T')[0])
      .lte('date', tomorrow.split('T')[0])
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching meetings:', error)
      return
    }

    setUpcomingMeetings(data || [])
  }

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) return

    fetchUpcomingMeetings(user.id)

    // Set up Supabase Realtime subscription
    const supabase = createClient()
    const channel = supabase
      .channel('meetings-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meetings',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchUpcomingMeetings(user.id)
        }
      )
      .subscribe()

    // Fallback polling for time-based updates (e.g. "Starts in 5m" changes every minute)
    const interval = setInterval(() => fetchUpcomingMeetings(user.id), 60000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [])

  const formatTimeUntil = (date: string, time: string) => {
    const meetingDateTime = new Date(`${date}T${time}`)
    const now = new Date()
    const diff = meetingDateTime.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 border border-border hover:border-primary transition-colors rounded-md bg-card"
        aria-label="Open notifications"
      >
        <Bell className="h-5 w-5" />
        {upcomingMeetings.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
            {upcomingMeetings.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className="fixed right-2 top-20 sm:absolute sm:right-0 sm:left-auto sm:top-full mt-2 w-[calc(100vw-1rem)] sm:w-96 max-w-md bg-card border-2 border-border shadow-2xl z-50 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-border bg-muted">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">{t.notifications?.title || "Notifications"}</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 hover:bg-secondary rounded-md transition-colors"
                title="Close notifications"
                aria-label="Close notifications"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[calc(100vh-12rem)] sm:max-h-[500px] overflow-y-auto">
              {upcomingMeetings.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Bell className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-base font-medium text-foreground mb-2">
                    {t.notifications?.noUpcoming || "No upcoming meetings"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You&apos;re all caught up!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {upcomingMeetings.map((meeting) => (
                    <div 
                      key={meeting.id} 
                      className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      {/* Meeting Title */}
                      <h4 className="font-semibold text-base mb-3 text-foreground break-words">
                        {meeting.title}
                      </h4>
                      
                      {/* Meeting Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded">
                            <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="font-medium whitespace-nowrap">
                              {new Date(meeting.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded">
                            <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="font-medium whitespace-nowrap">{meeting.time}</span>
                          </div>
                        </div>
                        
                        {/* Time Until Meeting */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-primary/20 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
                          </div>
                          <span className="text-xs font-bold text-primary whitespace-nowrap">
                            {t.notifications?.startsIn || "Starts in"} {formatTimeUntil(meeting.date, meeting.time)}
                          </span>
                        </div>
                        
                        {/* Duration Badge */}
                        <div className="flex justify-end">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                            {meeting.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            {upcomingMeetings.length > 0 && (
              <div className="p-3 border-t-2 border-border bg-muted text-center">
                <button className="text-sm text-primary hover:underline font-medium transition-colors">
                  View All Meetings →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
