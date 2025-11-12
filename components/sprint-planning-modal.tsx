"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  X, 
  Calendar, 
  Target, 
  TrendingUp,
  PlayCircle,
  CheckCircle,
  Flag,
  GripVertical,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"
import type { Task, Sprint } from "@/lib/project-management"

interface SprintPlanningModalProps {
  sprint: Sprint
  projectId: string
  backlogIssues: Task[]
  sprintIssues: Task[]
  isOpen: boolean
  onClose: () => void
  onUpdateSprint: (updates: Partial<Sprint>) => Promise<void>
  onMoveToSprint: (issueId: string) => Promise<void>
  onMoveToBacklog: (issueId: string) => Promise<void>
  onStartSprint: () => Promise<void>
  onCompleteSprint: () => Promise<void>
  useAPI?: boolean
}

export function SprintPlanningModal({
  sprint,
  projectId,
  backlogIssues,
  sprintIssues,
  isOpen,
  onClose,
  onUpdateSprint,
  onMoveToSprint,
  onMoveToBacklog,
  onStartSprint,
  onCompleteSprint,
  useAPI = false,
}: SprintPlanningModalProps) {
  const [draggedIssue, setDraggedIssue] = useState<Task | null>(null)
  const [dragOverZone, setDragOverZone] = useState<'backlog' | 'sprint' | null>(null)
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [loading, setLoading] = useState(false)

  const [sprintForm, setSprintForm] = useState({
    name: sprint.name,
    goal: sprint.goal || '',
    startDate: sprint.startDate || '',
    endDate: sprint.endDate || '',
  })

  // Calculate sprint metrics
  const totalStoryPoints = sprintIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
  const completedStoryPoints = sprintIssues
    .filter(issue => issue.status === 'done' || issue.status === 'closed')
    .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0)
  
  const totalIssues = sprintIssues.length
  const completedIssues = sprintIssues.filter(
    issue => issue.status === 'done' || issue.status === 'closed'
  ).length

  const sprintProgress = totalStoryPoints > 0 
    ? Math.round((completedStoryPoints / totalStoryPoints) * 100) 
    : 0

  const handleDragStart = (issue: Task) => {
    setDraggedIssue(issue)
  }

  const handleDragOver = (e: React.DragEvent, zone: 'backlog' | 'sprint') => {
    e.preventDefault()
    setDragOverZone(zone)
  }

  const handleDragLeave = () => {
    setDragOverZone(null)
  }

  const handleDrop = async (e: React.DragEvent, zone: 'backlog' | 'sprint') => {
    e.preventDefault()
    if (!draggedIssue) return

    setLoading(true)
    try {
      if (zone === 'sprint') {
        await onMoveToSprint(draggedIssue.id)
      } else {
        await onMoveToBacklog(draggedIssue.id)
      }
    } catch (err) {
      console.error('Failed to move issue:', err)
    } finally {
      setDraggedIssue(null)
      setDragOverZone(null)
      setLoading(false)
    }
  }

  const handleSaveDetails = async () => {
    setLoading(true)
    try {
      await onUpdateSprint({
        name: sprintForm.name,
        goal: sprintForm.goal,
        startDate: sprintForm.startDate,
        endDate: sprintForm.endDate,
      })
      setIsEditingDetails(false)
    } catch (err) {
      console.error('Failed to update sprint:', err)
    } finally {
      setLoading(false)
    }
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getDaysRemaining = () => {
    if (!sprint.endDate) return null
    const now = new Date()
    const end = new Date(sprint.endDate)
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (!isOpen) return null

  const daysRemaining = getDaysRemaining()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div className="flex-1">
            {isEditingDetails ? (
              <Input
                value={sprintForm.name}
                onChange={(e) => setSprintForm({ ...sprintForm, name: e.target.value })}
                className="text-2xl font-bold mb-2"
              />
            ) : (
              <h2 className="text-2xl font-bold mb-2">{sprint.name}</h2>
            )}
            <div className="flex items-center gap-3 text-sm">
              <span className={`px-2 py-1 rounded text-xs ${
                sprint.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                sprint.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
              }`}>
                {sprint.status.toUpperCase()}
              </span>
              {sprint.startDate && sprint.endDate && (
                <span className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                </span>
              )}
              {daysRemaining !== null && sprint.status === 'active' && (
                <span className={`font-medium ${daysRemaining < 3 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {daysRemaining} days remaining
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditingDetails && sprint.status === 'planning' && (
              <Button variant="outline" size="sm" onClick={() => setIsEditingDetails(true)}>
                Edit Details
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sprint Details */}
        <div className="p-6 border-b border-border space-y-4">
          {/* Goal */}
          <div>
            <Label className="text-sm font-medium mb-1">Sprint Goal</Label>
            {isEditingDetails ? (
              <Input
                value={sprintForm.goal}
                onChange={(e) => setSprintForm({ ...sprintForm, goal: e.target.value })}
                placeholder="What is the goal of this sprint?"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {sprint.goal || 'No goal set'}
              </p>
            )}
          </div>

          {/* Date Range (only when editing) */}
          {isEditingDetails && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-1">Start Date</Label>
                <Input
                  type="date"
                  value={sprintForm.startDate}
                  onChange={(e) => setSprintForm({ ...sprintForm, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-1">End Date</Label>
                <Input
                  type="date"
                  value={sprintForm.endDate}
                  onChange={(e) => setSprintForm({ ...sprintForm, endDate: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Story Points</span>
              </div>
              <p className="text-2xl font-bold">{completedStoryPoints}/{totalStoryPoints}</p>
              <p className="text-xs text-muted-foreground">{sprintProgress}% complete</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Issues</span>
              </div>
              <p className="text-2xl font-bold">{completedIssues}/{totalIssues}</p>
              <p className="text-xs text-muted-foreground">
                {totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0}% complete
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Velocity</span>
              </div>
              <p className="text-2xl font-bold">{completedStoryPoints}</p>
              <p className="text-xs text-muted-foreground">pts completed</p>
            </Card>
          </div>

          {/* Save Button (when editing) */}
          {isEditingDetails && (
            <div className="flex gap-2">
              <Button onClick={handleSaveDetails} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditingDetails(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Planning Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Backlog Column */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>Backlog</span>
                <span className="text-xs text-muted-foreground">({backlogIssues.length})</span>
              </h3>
              <div
                className={`border-2 border-dashed rounded-lg p-4 min-h-[400px] transition-colors ${
                  dragOverZone === 'backlog'
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
                onDragOver={(e) => handleDragOver(e, 'backlog')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'backlog')}
              >
                <div className="space-y-2">
                  {backlogIssues.map((issue) => (
                    <Card
                      key={issue.id}
                      draggable
                      onDragStart={() => handleDragStart(issue)}
                      className="p-3 cursor-move hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-medium truncate">{issue.title}</h4>
                            <Flag className={`h-3 w-3 flex-shrink-0 ${getPriorityColor(issue.priority)}`} />
                          </div>
                          {issue.storyPoints && issue.storyPoints > 0 && (
                            <span className="text-xs bg-muted px-2 py-0.5 rounded">
                              {issue.storyPoints} pts
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMoveToSprint(issue.id)}
                          className="h-6 w-6 p-0 flex-shrink-0"
                          disabled={loading}
                        >
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                  {backlogIssues.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-sm">No issues in backlog</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sprint Column */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>{sprint.name}</span>
                <span className="text-xs text-muted-foreground">({sprintIssues.length})</span>
              </h3>
              <div
                className={`border-2 border-dashed rounded-lg p-4 min-h-[400px] transition-colors ${
                  dragOverZone === 'sprint'
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
                onDragOver={(e) => handleDragOver(e, 'sprint')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'sprint')}
              >
                <div className="space-y-2">
                  {sprintIssues.map((issue) => (
                    <Card
                      key={issue.id}
                      draggable
                      onDragStart={() => handleDragStart(issue)}
                      className="p-3 cursor-move hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-medium truncate">{issue.title}</h4>
                            <Flag className={`h-3 w-3 flex-shrink-0 ${getPriorityColor(issue.priority)}`} />
                          </div>
                          <div className="flex items-center gap-2">
                            {issue.storyPoints && issue.storyPoints > 0 && (
                              <span className="text-xs bg-muted px-2 py-0.5 rounded">
                                {issue.storyPoints} pts
                              </span>
                            )}
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              issue.status === 'done' || issue.status === 'closed'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30'
                            }`}>
                              {issue.status}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMoveToBacklog(issue.id)}
                          className="h-6 w-6 p-0 flex-shrink-0"
                          disabled={loading}
                        >
                          <ArrowLeft className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                  {sprintIssues.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-sm">Drag issues from backlog to add to sprint</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center p-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {useAPI && <span className="text-xs text-green-600">(Supabase)</span>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {sprint.status === 'planning' && sprintIssues.length > 0 && (
              <Button onClick={onStartSprint} className="gap-2">
                <PlayCircle className="h-4 w-4" />
                Start Sprint
              </Button>
            )}
            {sprint.status === 'active' && (
              <Button onClick={onCompleteSprint} variant="default" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Complete Sprint
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
