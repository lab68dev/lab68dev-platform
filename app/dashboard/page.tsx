"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Activity, GitBranch, Users, Zap, FolderKanban, ListTodo, Calendar, MessageSquare, Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets } from "lucide-react"
import { getCurrentUser, type User } from "@/lib/auth"
import { getUserLanguage, getTranslations, type Language } from "@/lib/i18n"
import { 
  getProjects, 
  getTodos, 
  getMilestones,
  getMeetings 
} from "@/lib/database"

type Weather = {
  temp: number
  condition: string
  humidity: number
  windSpeed: number
  location: string
}

type Meeting = {
  id: string
  title: string
  date: Date
  time: string
  status: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [lang, setLang] = useState<Language>("en")
  const [counts, setCounts] = useState({
    projects: 0,
    todos: 0,
    milestones: 0,
    meetings: 0,
  })
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [weather, setWeather] = useState<Weather | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
    } else {
      setUser(currentUser)
      const userLang = (currentUser.language as Language) || getUserLanguage()
      setLang(userLang)
      loadCounts(currentUser.id)
    }
  }, [router])

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch weather data (simulated - you can integrate real API like OpenWeatherMap)
  useEffect(() => {
    async function fetchWeather() {
      setWeatherLoading(true)
      try {
        // Simulated weather data - replace with real API call
        // Example: const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=YourCity&appid=YOUR_API_KEY&units=metric`)
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
        
        const mockWeather: Weather = {
          temp: Math.floor(Math.random() * 15) + 20, // 20-35°C
          condition: ['Sunny', 'Cloudy', 'Rainy', 'Windy'][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
          windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
          location: 'Your City'
        }
        
        setWeather(mockWeather)
      } catch (error) {
        console.error("Failed to fetch weather:", error)
      } finally {
        setWeatherLoading(false)
      }
    }

    fetchWeather()
    // Update weather every 30 minutes
    const weatherInterval = setInterval(fetchWeather, 1800000)
    return () => clearInterval(weatherInterval)
  }, [])

  async function loadCounts(userId: string) {
    try {
      setLoading(true)
      const [projects, todos, milestones, meetings] = await Promise.all([
        getProjects(userId),
        getTodos(userId),
        getMilestones(userId),
        getMeetings(userId),
      ])

      setCounts({
        projects: projects.length,
        todos: todos.filter(t => t.status !== "done").length, // Only count active todos
        milestones: milestones.filter(m => m.status !== "completed").length, // Only count active milestones
        meetings: meetings.length,
      })

      // Load upcoming meetings with dates
      const meetingsWithDates: Meeting[] = meetings.map((m: any) => ({
        id: m.id,
        title: m.title,
        date: new Date(m.scheduled_at || Date.now()),
        time: new Date(m.scheduled_at || Date.now()).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        status: m.status || 'scheduled'
      }))
      setUpcomingMeetings(meetingsWithDates)
    } catch (error) {
      console.error("Failed to load dashboard counts:", error)
    } finally {
      setLoading(false)
    }
  }

  const t = getTranslations(lang)

  // Format time parts for digital clock
  const formatTimePart = (num: number): string => {
    return num.toString().padStart(2, '0')
  }

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return Sun
      case 'cloudy':
        return Cloud
      case 'rainy':
        return CloudRain
      case 'snowy':
        return CloudSnow
      case 'windy':
        return Wind
      default:
        return Cloud
    }
  }

  const hours = formatTimePart(currentTime.getHours())
  const minutes = formatTimePart(currentTime.getMinutes())
  const seconds = formatTimePart(currentTime.getSeconds())
  const date = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  const stats = [
    { label: "Active Projects", value: loading ? "..." : counts.projects.toString(), icon: FolderKanban, change: `${counts.projects} total` },
    { label: "Pending Todos", value: loading ? "..." : counts.todos.toString(), icon: ListTodo, change: "Active tasks" },
    { label: "Active Milestones", value: loading ? "..." : counts.milestones.toString(), icon: GitBranch, change: "In progress" },
    { label: "Upcoming Meetings", value: loading ? "..." : counts.meetings.toString(), icon: Calendar, change: "Scheduled" },
  ]

  const recentProjects: Array<{ name: string; status: string; updated: string }> = []

  if (!user) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">{t.dashboard.loading}</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Header with Digital Clock and Weather */}
      <div className="border-b border-border pb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {t.dashboard.welcomeBack}, {user.name}
            </h1>
            <p className="text-muted-foreground">{t.dashboard.happeningToday}</p>
          </div>
          
          <div className="flex gap-4">
            {/* Animated Digital Clock */}
            <div className="border border-border bg-card p-4 min-w-[220px]">
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Current Time
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1 font-mono">
                  {/* Hours */}
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                      {hours}
                    </div>
                    <div className="text-[8px] text-muted-foreground mt-1">Hours</div>
                  </div>
                  
                  {/* Separator */}
                  <div className="text-3xl font-bold text-primary animate-pulse px-1">:</div>
                  
                  {/* Minutes */}
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                      {minutes}
                    </div>
                    <div className="text-[8px] text-muted-foreground mt-1">Mins</div>
                  </div>
                  
                  {/* Separator */}
                  <div className="text-3xl font-bold text-primary animate-pulse px-1">:</div>
                  
                  {/* Seconds */}
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                      {seconds}
                    </div>
                    <div className="text-[8px] text-muted-foreground mt-1">Secs</div>
                  </div>
                </div>
                
                {/* Date */}
                <div className="text-xs text-muted-foreground text-center border-t border-border pt-2">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Animated Weather Widget */}
            <div className="border border-border bg-card p-4 min-w-[220px]">
              {weatherLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin text-primary">
                    <Cloud className="h-6 w-6" />
                  </div>
                </div>
              ) : weather ? (
                <div className="space-y-3">
                  {/* Weather Header */}
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <div>
                      <h3 className="text-xs font-medium text-foreground">Weather</h3>
                      <p className="text-[10px] text-muted-foreground">{weather.location}</p>
                    </div>
                    <div className="animate-bounce">
                      {(() => {
                        const WeatherIcon = getWeatherIcon(weather.condition)
                        return <WeatherIcon className="h-6 w-6 text-primary" />
                      })()}
                    </div>
                  </div>

                  {/* Temperature & Condition */}
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-1 mb-1">
                      <span className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                        {weather.temp}°
                      </span>
                      <span className="text-sm text-muted-foreground">C</span>
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {weather.condition}
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="flex items-center justify-around pt-2 border-t border-border">
                    <div className="flex flex-col items-center gap-1">
                      <Droplets className="h-4 w-4 text-primary animate-pulse" />
                      <span className="text-[10px] font-medium">{weather.humidity}%</span>
                      <span className="text-[8px] text-muted-foreground">Humidity</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Wind className="h-4 w-4 text-primary animate-pulse" />
                      <span className="text-[10px] font-medium">{weather.windSpeed} km/h</span>
                      <span className="text-[8px] text-muted-foreground">Wind</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-xs text-muted-foreground flex items-center justify-center h-full">
                  Weather unavailable
                </div>
              )}
            </div>

            {/* Calendar Widget */}
            <div className="border border-border bg-card p-3 w-[280px]">
              <div className="space-y-2">
                {/* Calendar Header */}
                <div className="text-[10px] text-muted-foreground font-medium text-center border-b border-border pb-2">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>

                {/* Mini Calendar */}
                <div className="grid grid-cols-7 gap-1 text-center text-[9px]">
                  {/* Day headers */}
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} className="text-muted-foreground font-medium p-1">
                      {day}
                    </div>
                  ))}

                  {/* Calendar days */}
                  {(() => {
                    const year = selectedDate.getFullYear()
                    const month = selectedDate.getMonth()
                    const firstDay = new Date(year, month, 1).getDay()
                    const daysInMonth = new Date(year, month + 1, 0).getDate()
                    const today = new Date()
                    const days = []

                    // Empty cells for days before month starts
                    for (let i = 0; i < firstDay; i++) {
                      days.push(<div key={`empty-${i}`} className="p-1" />)
                    }

                    // Days of the month
                    for (let day = 1; day <= daysInMonth; day++) {
                      const currentDate = new Date(year, month, day)
                      const isToday = 
                        day === today.getDate() &&
                        month === today.getMonth() &&
                        year === today.getFullYear()
                      
                      const hasMeeting = upcomingMeetings.some(meeting => {
                        const meetingDate = new Date(meeting.date)
                        return (
                          meetingDate.getDate() === day &&
                          meetingDate.getMonth() === month &&
                          meetingDate.getFullYear() === year
                        )
                      })

                      days.push(
                        <div
                          key={day}
                          className={`p-1 cursor-pointer transition-all rounded ${
                            isToday
                              ? 'bg-primary text-primary-foreground font-bold'
                              : hasMeeting
                              ? 'bg-primary/20 text-primary font-medium border border-primary'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedDate(currentDate)}
                        >
                          {day}
                        </div>
                      )
                    }

                    return days
                  })()}
                </div>

                {/* Meetings for selected date */}
                <div className="border-t border-border pt-2 max-h-[100px] overflow-y-auto scrollbar-hide">
                  <div className="text-[9px] text-muted-foreground mb-1 font-medium">
                    Meetings Today
                  </div>
                  {(() => {
                    const todayMeetings = upcomingMeetings.filter(meeting => {
                      const meetingDate = new Date(meeting.date)
                      const selected = selectedDate
                      return (
                        meetingDate.getDate() === selected.getDate() &&
                        meetingDate.getMonth() === selected.getMonth() &&
                        meetingDate.getFullYear() === selected.getFullYear()
                      )
                    })

                    if (todayMeetings.length === 0) {
                      return (
                        <div className="text-[9px] text-muted-foreground/50 italic py-1">
                          No meetings scheduled
                        </div>
                      )
                    }

                    return todayMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="flex items-start gap-1 py-1 border-l-2 border-primary pl-2 mb-1 hover:bg-muted/50 transition-colors"
                      >
                        <Calendar className="h-2.5 w-2.5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] font-medium truncate">
                            {meeting.title}
                          </div>
                          <div className="text-[8px] text-muted-foreground">
                            {meeting.time}
                          </div>
                        </div>
                      </div>
                    ))
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-border p-6 bg-card">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-primary">{stat.change}</p>
                </div>
                <Icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{t.dashboard.recentProjects}</h2>
        {recentProjects.length === 0 ? (
          <div className="border border-border p-8 text-center">
            <p className="text-muted-foreground">No projects yet. Start building!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentProjects.map((project) => (
              <div key={project.name} className="border border-border p-4 hover:border-primary transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.updated}</p>
                  </div>
                  <span className="text-xs border border-primary text-primary px-3 py-1">{project.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Assistant Preview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{t.dashboard.aiAssistant}</h2>
        <div className="border border-border p-6 bg-card space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary mt-2" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">System</p>
              <p className="text-sm text-muted-foreground">How can I assist you with your development today?</p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t.dashboard.askAnything}
              className="flex-1 bg-background border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <button className="bg-primary text-primary-foreground px-6 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
              {t.dashboard.send}
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{t.dashboard.systemStatus}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary" />
              <p className="text-sm font-medium">API Status</p>
            </div>
            <p className="text-xs text-muted-foreground">{t.dashboard.allSystemsOperational}</p>
          </div>
          <div className="border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary" />
              <p className="text-sm font-medium">Build Queue</p>
            </div>
            <p className="text-xs text-muted-foreground">0 {t.dashboard.buildsInProgress}</p>
          </div>
          <div className="border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary" />
              <p className="text-sm font-medium">Database</p>
            </div>
            <p className="text-xs text-muted-foreground">{t.dashboard.connectedAndHealthy}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
