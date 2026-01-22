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
          flex items-center justify-center p-0.5 text-[10px] cursor-pointer rounded-sm transition-all h-5 w-5 mx-auto
          ${isSelected ? 'bg-primary text-primary-foreground font-bold' : ''}
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
    <div className="border border-border bg-card p-2 sm:p-3 w-full sm:w-[200px]">
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-1.5">
           <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></div>
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              {selectedDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
            </div>
          </div>
          <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-y-1 gap-x-0.5 text-center">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} className="text-[8px] text-muted-foreground font-medium">{d}</div>
          ))}
          {days}
        </div>

        {/* Meetings List */}
        <div className="border-t border-border pt-1.5 mt-1">
          {todayMeetings.length > 0 ? (
            <div className="space-y-1">
              {todayMeetings.slice(0, 2).map((meeting) => (
                <div key={meeting.id} className="flex items-center gap-1.5 group cursor-default">
                  <div className="w-1 h-3 bg-primary rounded-full group-hover:h-4 transition-all" />
                  <div className="min-w-0">
                    <p className="text-[9px] font-medium truncate max-w-[140px] leading-tight text-foreground">
                      {meeting.title}
                    </p>
                    <p className="text-[8px] text-muted-foreground leading-none">
                      {meeting.time}
                    </p>
                  </div>
                </div>
              ))}
              {todayMeetings.length > 2 && (
                <p className="text-[8px] text-muted-foreground pl-2.5">+{todayMeetings.length - 2} more</p>
              )}
            </div>
          ) : (
             <div className="text-[9px] text-muted-foreground/50 italic py-0.5 text-center">
                Free ({selectedDate.getDate()})
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
