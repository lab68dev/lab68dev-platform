"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { 
  FileText, 
  CheckSquare, 
  Calendar, 
  Upload, 
  GitBranch, 
  MessageSquare,
  UserPlus,
  Settings,
  Palette,
  FolderKanban
} from "lucide-react"

export interface ActivityItem {
  id: string
  type: "project" | "todo" | "meeting" | "file" | "chat" | "user" | "settings" | "whiteboard"
  action: string
  description: string
  timestamp: Date
  user?: {
    name: string
    avatar?: string
  }
}

export interface RecentActivityProps {
  userId?: string
  limit?: number
  className?: string
}

export function RecentActivity({ userId, limit = 10, className = "" }: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    loadActivities()
  }, [userId, limit])

  async function loadActivities() {
    // Simulated activity data - in production, fetch from database
    const mockActivities: ActivityItem[] = [
      {
        id: "1",
        type: "project",
        action: "created",
        description: "Created new project 'E-Commerce Platform'",
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        user: { name: "You" },
      },
      {
        id: "2",
        type: "todo",
        action: "completed",
        description: "Completed task 'Setup database schema'",
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        user: { name: "You" },
      },
      {
        id: "3",
        type: "meeting",
        action: "scheduled",
        description: "Scheduled meeting 'Sprint Planning' for tomorrow",
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        user: { name: "You" },
      },
      {
        id: "4",
        type: "file",
        action: "uploaded",
        description: "Uploaded file 'design-mockup.fig'",
        timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
        user: { name: "You" },
      },
      {
        id: "5",
        type: "whiteboard",
        action: "created",
        description: "Created whiteboard 'System Architecture'",
        timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
        user: { name: "You" },
      },
    ]

    setActivities(mockActivities.slice(0, limit))
  }

  const getActivityIcon = (type: string) => {
    const iconClass = "h-4 w-4"
    switch (type) {
      case "project":
        return <FolderKanban className={iconClass} />
      case "todo":
        return <CheckSquare className={iconClass} />
      case "meeting":
        return <Calendar className={iconClass} />
      case "file":
        return <Upload className={iconClass} />
      case "chat":
        return <MessageSquare className={iconClass} />
      case "user":
        return <UserPlus className={iconClass} />
      case "settings":
        return <Settings className={iconClass} />
      case "whiteboard":
        return <Palette className={iconClass} />
      default:
        return <FileText className={iconClass} />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "project":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20"
      case "todo":
        return "text-green-500 bg-green-500/10 border-green-500/20"
      case "meeting":
        return "text-purple-500 bg-purple-500/10 border-purple-500/20"
      case "file":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20"
      case "chat":
        return "text-cyan-500 bg-cyan-500/10 border-cyan-500/20"
      case "whiteboard":
        return "text-pink-500 bg-pink-500/10 border-pink-500/20"
      default:
        return "text-muted-foreground bg-muted border-border"
    }
  }

  const filteredActivities = filter === "all"
    ? activities
    : activities.filter((a) => a.type === filter)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["all", "project", "todo", "meeting", "file", "whiteboard"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap ${
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:border-primary"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No recent activity
          </div>
        ) : (
          filteredActivities.map((activity, index) => (
            <div key={activity.id} className="flex gap-3 group">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div
                  className={`p-2 border ${getActivityColor(activity.type)} transition-all group-hover:scale-110`}
                >
                  {getActivityIcon(activity.type)}
                </div>
                {index < filteredActivities.length - 1 && (
                  <div className="w-0.5 flex-1 bg-border mt-2" />
                )}
              </div>

              {/* Activity Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-tight">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  {activity.user && (
                    <div className="flex items-center gap-2">
                      {activity.user.avatar ? (
                        <img
                          src={activity.user.avatar}
                          alt={activity.user.name}
                          className="w-6 h-6 rounded-full border border-border"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                          {activity.user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
