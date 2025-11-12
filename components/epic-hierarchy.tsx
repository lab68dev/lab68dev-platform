"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronRight, 
  ChevronDown,
  Target,
  CheckCircle,
  Circle,
  Flag,
  Calendar,
} from "lucide-react"
import type { Task } from "@/lib/project-management"

interface Epic {
  id: string
  title: string
  description: string
  issues: Task[]
}

interface EpicHierarchyProps {
  epics: Epic[]
  onEpicClick: (epicId: string) => void
  onIssueClick: (issue: Task) => void
}

export function EpicHierarchy({ epics, onEpicClick, onIssueClick }: EpicHierarchyProps) {
  const [expandedEpics, setExpandedEpics] = useState<Set<string>>(new Set())

  const toggleEpic = (epicId: string) => {
    const newExpanded = new Set(expandedEpics)
    if (newExpanded.has(epicId)) {
      newExpanded.delete(epicId)
    } else {
      newExpanded.add(epicId)
    }
    setExpandedEpics(newExpanded)
  }

  const getEpicProgress = (epic: Epic) => {
    if (epic.issues.length === 0) return 0
    const completedIssues = epic.issues.filter(
      issue => issue.status === 'done' || issue.status === 'closed'
    ).length
    return Math.round((completedIssues / epic.issues.length) * 100)
  }

  const getEpicStoryPoints = (epic: Epic) => {
    const total = epic.issues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
    const completed = epic.issues
      .filter(issue => issue.status === 'done' || issue.status === 'closed')
      .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
    return { total, completed }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-500'
      case 'high': return 'text-orange-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      case 'lowest': return 'text-gray-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'backlog': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      case 'todo': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'review': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      case 'blocked': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (epics.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No epics found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Create an epic to group related issues together
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {epics.map((epic) => {
        const isExpanded = expandedEpics.has(epic.id)
        const progress = getEpicProgress(epic)
        const { total, completed } = getEpicStoryPoints(epic)

        return (
          <Card key={epic.id} className="overflow-hidden">
            {/* Epic Header */}
            <div className="p-4 bg-muted/30">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleEpic(epic.id)}
                  className="mt-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <button
                        onClick={() => onEpicClick(epic.id)}
                        className="text-left hover:text-primary transition-colors"
                      >
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <Target className="h-5 w-5 text-purple-500" />
                          {epic.title}
                        </h3>
                      </button>
                      {epic.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {epic.description}
                        </p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-medium">
                        {epic.issues.filter(i => i.status === 'done' || i.status === 'closed').length}/{epic.issues.length} issues
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {completed}/{total} pts
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Epic Issues (Expanded) */}
            {isExpanded && epic.issues.length > 0 && (
              <div className="p-4 space-y-2 border-t border-border">
                {epic.issues.map((issue) => (
                  <button
                    key={issue.id}
                    onClick={() => onIssueClick(issue)}
                    className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        {issue.status === 'done' || issue.status === 'closed' ? (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {issue.key && (
                              <span className="text-xs font-mono text-muted-foreground">
                                {issue.key}
                              </span>
                            )}
                            <h4 className="text-sm font-medium truncate">{issue.title}</h4>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(issue.status)}`}>
                              {issue.status}
                            </span>
                            {issue.storyPoints && issue.storyPoints > 0 && (
                              <span className="text-xs bg-muted px-2 py-0.5 rounded">
                                {issue.storyPoints} pts
                              </span>
                            )}
                            {issue.dueDate && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(issue.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Flag className={`h-3 w-3 flex-shrink-0 mt-0.5 ${getPriorityColor(issue.priority)}`} />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {isExpanded && epic.issues.length === 0 && (
              <div className="p-8 text-center border-t border-border">
                <p className="text-sm text-muted-foreground">No issues in this epic yet</p>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}

// Helper function to group issues by epic
export function groupIssuesByEpic(issues: Task[]): Epic[] {
  const epicMap = new Map<string, Epic>()
  
  // First, find all epic-type issues
  issues.forEach(issue => {
    const issueType = issue.issue_type || issue.issueType
    if (issueType === 'epic') {
      epicMap.set(issue.id, {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        issues: [],
      })
    }
  })

  // Then, group child issues under their epics
  issues.forEach(issue => {
    const issueType = issue.issue_type || issue.issueType
    if (issueType !== 'epic' && (issue.epicId || issue.epic_id)) {
      const epicId = issue.epicId || issue.epic_id
      const epic = epicMap.get(epicId!)
      if (epic) {
        epic.issues.push(issue)
      }
    }
  })

  return Array.from(epicMap.values())
}
