"use client"

import { BentoCard } from "@/components/bento-card"
import { FolderKanban, ListTodo, GitBranch, Calendar } from "lucide-react"

interface DashboardStatsProps {
  counts: {
    projects: number
    todos: number
    milestones: number
    meetings: number
  }
  loading: boolean
}

export function DashboardStats({ counts, loading }: DashboardStatsProps) {
  const stats = [
    { label: "Active Projects", value: loading ? "..." : counts.projects.toString(), icon: FolderKanban, change: `${counts.projects} total`, color: "text-blue-400" },
    { label: "Pending Todos", value: loading ? "..." : counts.todos.toString(), icon: ListTodo, change: "Active tasks", color: "text-emerald-400" },
    { label: "Active Milestones", value: loading ? "..." : counts.milestones.toString(), icon: GitBranch, change: "In progress", color: "text-purple-400" },
    { label: "Upcoming Meetings", value: loading ? "..." : counts.meetings.toString(), icon: Calendar, change: "Scheduled", color: "text-pink-400" },
  ]

  return (
    <>
      {stats.map((stat, i) => (
        <BentoCard key={i} className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className={`p-2 rounded-lg bg-background/50 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-background/50 ${stat.color}`}>
              {stat.change}
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        </BentoCard>
      ))}
    </>
  )
}
