"use client"

import { useState } from "react"
import { Calendar as CalendarIcon } from "lucide-react"

type Meeting = {
  id: string
  title: string
  date: Date
  time: string
  status: string
}

interface DashboardCalendarProps {
  upcomingMeetings: Meeting[]
}

export function DashboardCalendar({ upcomingMeetings }: DashboardCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const todayMeetings = upcomingMeetings.filter(meeting => {
    const meetingDate = new Date(meeting.date)
    return (
      meetingDate.getDate() === selectedDate.getDate() &&
      meetingDate.getMonth() === selectedDate.getMonth() &&
      meetingDate.getFullYear() === selectedDate.getFullYear()
    )
  })

  // Generate days array
  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-0.5" />)
  }
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

    const isSelected = day === selectedDate.getDate()

    days.push(
      <div
        key={day}
        className={`
          flex items-center justify-center text-sm cursor-pointer rounded-md transition-all aspect-square
          ${isSelected ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20' : ''}
          ${isToday && !isSelected ? 'border border-primary text-primary font-bold' : ''}
          ${hasMeeting && !isSelected && !isToday ? 'bg-primary/20 text-primary font-medium' : ''}
          ${!isSelected && !isToday && !hasMeeting ? 'hover:bg-muted text-muted-foreground' : ''}
        `}
        onClick={() => setSelectedDate(currentDate)}
      >
        {day}
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6">
      {/* Left Column: Calendar Grid */}
      <div className="flex-1 flex flex-col justify-center max-w-[280px] mx-auto md:mx-0">
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
                    <div className="text-sm font-semibold uppercase tracking-wider">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                </div>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                <div key={d} className="text-[10px] text-muted-foreground font-medium uppercase">{d}</div>
            ))}
            {days}
            </div>
        </div>
      </div>

      {/* Vertical Divider (Desktop) */}
      <div className="hidden md:block w-px bg-border/50 my-2" />

      {/* Right Column: Schedule List */}
      <div className="flex-1 flex flex-col min-w-0 justify-center">
          <div className="flex items-center justify-between mb-3">
             <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
             </h4>
             <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {todayMeetings.length} Events
             </span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[160px] scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20">
            {todayMeetings.length > 0 ? (
                <>
                {todayMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-start gap-3 group cursor-pointer p-2.5 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all">
                    <div className="w-1.5 h-full min-h-[32px] bg-gradient-to-b from-primary to-purple-500 rounded-full opacity-80" />
                    <div className="min-w-0 flex-1 py-0.5">
                        <p className="text-sm font-medium leading-none text-foreground group-hover:text-primary transition-colors">
                            {meeting.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                             <p className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {meeting.time}
                            </p>
                            <span className={`text-[10px] capitalize ${
                                meeting.status === 'confirmed' ? 'text-green-500' : 'text-amber-500'
                            }`}>
                                • {meeting.status}
                            </span>
                        </div>
                    </div>
                    </div>
                ))}
                </>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-4 border border-dashed border-border rounded-lg bg-muted/5">
                    <div className="bg-muted rounded-full p-2 mb-2">
                        <CalendarIcon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium">No meetings</p>
                    <p className="text-xs text-muted-foreground">Enjoy your free time!</p>
                </div>
            )}
            </div>
        </div>
    </div>
  )
}
