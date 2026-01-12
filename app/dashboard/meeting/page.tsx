"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCurrentUser } from "@/lib/features/auth"
import { getTranslations, getUserLanguage } from "@/lib/config"
import { Plus, Trash2, CalendarIcon, Clock, X, Search, Filter } from "lucide-react"
import { getMeetings, createMeeting, deleteMeeting as deleteMeetingDB, type Meeting as DBMeeting } from "@/lib/database"

interface Meeting {
  id: string
  userId: string
  title: string
  description: string
  date: string
  time: string
  duration: number
  createdAt: string
}

export default function MeetingPage() {
  const router = useRouter()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 30,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [filterTime, setFilterTime] = useState<"all" | "upcoming" | "past">("all")
  const [language, setLanguage] = useState(getUserLanguage())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = getTranslations(language).meeting

  const loadMeetings = useCallback(async () => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getMeetings(user.id)
      
      // Transform Supabase data to match component interface
      const transformedMeetings: Meeting[] = data.map((m) => {
        // Split datetime into date and time
        const datetime = new Date(m.date)
        const date = datetime.toISOString().split('T')[0]
        const time = datetime.toTimeString().substring(0, 5)
        
        return {
          id: m.id,
          userId: m.user_id,
          title: m.title,
          description: m.description || "",
          date: date,
          time: time,
          duration: m.duration || 30,
          createdAt: m.created_at,
        }
      })
      
      setMeetings(transformedMeetings)
    } catch (err) {
      console.error('Failed to load meetings:', err)
      setError('Failed to load meetings')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadMeetings()

    // Listen for language changes
    const handleStorageChange = () => {
      setLanguage(getUserLanguage())
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [loadMeetings])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const user = getCurrentUser()
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Combine date and time into a single datetime string
      const meetingDate = `${formData.date}T${formData.time}`

      await createMeeting({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        date: meetingDate,
        duration: formData.duration,
      })

      await loadMeetings()
      setFormData({ title: "", description: "", date: "", time: "", duration: 30 })
      setShowForm(false)
    } catch (err) {
      console.error("Error creating meeting:", err)
      setError("Failed to create meeting")
    } finally {
      setLoading(false)
    }
  }, [formData, loadMeetings])

  const deleteMeeting = useCallback(async (meetingId: string) => {
    try {
      setLoading(true)
      setError(null)
      await deleteMeetingDB(meetingId)
      await loadMeetings()
    } catch (err) {
      console.error("Error deleting meeting:", err)
      setError("Failed to delete meeting")
    } finally {
      setLoading(false)
    }
  }, [loadMeetings])

  const isPastMeeting = (date: string, time: string) => {
    const meetingDateTime = new Date(`${date}T${time}`)
    return meetingDateTime < new Date()
  }

  // Filter meetings based on search and filters
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchQuery.toLowerCase())

    const isPast = isPastMeeting(meeting.date, meeting.time)
    const matchesTime =
      filterTime === "all" ||
      (filterTime === "upcoming" && !isPast) ||
      (filterTime === "past" && isPast)

    return matchesSearch && matchesTime
  })

  const upcomingMeetings = filteredMeetings
    .filter((m) => !isPastMeeting(m.date, m.time))
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return dateA.getTime() - dateB.getTime()
    })

  const pastMeetings = filteredMeetings
    .filter((m) => isPastMeeting(m.date, m.time))
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return dateB.getTime() - dateA.getTime()
    })

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          {t.scheduleMeeting}
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value as "all" | "upcoming" | "past")}
            className="bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
            title="Filter by time"
          >
            <option value="all">All Meetings</option>
            <option value="upcoming">{t.upcoming}</option>
            <option value="past">{t.past}</option>
          </select>
        </div>
        {(searchQuery || filterTime !== "all") && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              Showing {filteredMeetings.length} of {meetings.length} meetings
            </span>
            <button
              onClick={() => {
                setSearchQuery("")
                setFilterTime("all")
              }}
              className="text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md border border-border bg-background p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.scheduleMeeting}</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.meetingTitle}</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={t.meetingTitle}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.meetingDescription}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t.meetingDescription}
                  rows={3}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.date}</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                    title={t.date}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.time}</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                    title={t.time}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t.duration} ({t.minutes})
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  title={t.duration}
                  min="15"
                  step="15"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {t.schedule}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                >
                  {t.cancel}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {meetings.length === 0 ? (
        <div className="border border-border p-12 text-center space-y-4">
          <Plus className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-xl font-bold mb-2">{t.noMeetings}</h3>
            <p className="text-muted-foreground">{t.startScheduling}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {upcomingMeetings.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 border-b border-border pb-4">
                {t.upcoming} ({upcomingMeetings.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingMeetings.map((meeting) => (
                  <Card key={meeting.id} className="border-border p-6 bg-card hover:border-primary transition-colors">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold text-balance flex-1">{meeting.title}</h3>
                        <div className="flex items-center gap-1 text-xs border border-primary text-primary px-2 py-1">
                          <Clock className="h-3 w-3" />
                          <span>{meeting.duration}m</span>
                        </div>
                      </div>

                      {meeting.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{meeting.description}</p>
                      )}

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1 border border-border px-2 py-1">
                          <CalendarIcon className="h-3 w-3" />
                          {new Date(meeting.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 border border-border px-2 py-1">
                          <Clock className="h-3 w-3" />
                          {meeting.time}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMeeting(meeting.id)}
                          className="w-full gap-2 border-destructive text-destructive hover:bg-destructive hover:text-background"
                        >
                          <Trash2 className="h-3 w-3" />
                          {t.cancel}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {pastMeetings.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 border-b border-border pb-4">
                {t.past} ({pastMeetings.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastMeetings.map((meeting) => (
                  <Card
                    key={meeting.id}
                    className="border-border p-6 bg-card hover:border-primary transition-colors opacity-60"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold text-balance flex-1">{meeting.title}</h3>
                        <div className="flex items-center gap-1 text-xs border border-border text-muted-foreground px-2 py-1">
                          <Clock className="h-3 w-3" />
                          <span>{meeting.duration}m</span>
                        </div>
                      </div>

                      {meeting.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{meeting.description}</p>
                      )}

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1 border border-border px-2 py-1">
                          <CalendarIcon className="h-3 w-3" />
                          {new Date(meeting.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 border border-border px-2 py-1">
                          <Clock className="h-3 w-3" />
                          {meeting.time}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMeeting(meeting.id)}
                          className="w-full gap-2 border-destructive text-destructive hover:bg-destructive hover:text-background"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
