"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  X, 
  Calendar, 
  User, 
  Flag, 
  Tag, 
  MessageCircle, 
  Paperclip, 
  Activity,
  Edit2,
  Trash2,
  Send,
  Link as LinkIcon
} from "lucide-react"
import type { Task, Label as LabelType } from "@/lib/services"

interface IssueComment {
  id: string
  author_id: string
  author?: {
    id: string
    email: string
    name?: string
  }
  body: string
  created_at: string
  updated_at: string
  is_internal: boolean
}

interface IssueActivity {
  id: string
  user_id?: string
  user?: {
    email: string
  }
  action: string
  field_name?: string
  old_value?: string
  new_value?: string
  created_at: string
}

interface IssueDetailModalProps {
  issue: Task
  projectId: string
  labels: LabelType[]
  isOpen: boolean
  onClose: () => void
  onUpdate: (updates: Partial<Task>) => Promise<void>
  onDelete: () => Promise<void>
  useAPI?: boolean
}

type TabType = 'details' | 'comments' | 'attachments' | 'activity'

export function IssueDetailModal({
  issue,
  projectId,
  labels,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  useAPI = false,
}: IssueDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('details')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState<IssueComment[]>([])
  const [activity, setActivity] = useState<IssueActivity[]>([])
  const [newComment, setNewComment] = useState('')
  
  const [editForm, setEditForm] = useState({
    title: issue.title,
    description: issue.description,
    status: issue.status,
    priority: issue.priority,
    assignee: issue.assignee || '',
    dueDate: issue.dueDate || '',
    storyPoints: issue.storyPoints || 0,
  })

  useEffect(() => {
    if (isOpen && useAPI) {
      loadComments()
      loadActivity()
    }
  }, [isOpen, issue.id, useAPI])

  const loadComments = async () => {
    if (!useAPI) return

    try {
      const response = await fetch(`/api/projects/${projectId}/issues/${issue.id}/comments`)
      const data = await response.json()
      if (data.success) {
        setComments(data.data)
      }
    } catch (err) {
      console.error('Failed to load comments:', err)
    }
  }

  const loadActivity = async () => {
    if (!useAPI) return

    try {
      const response = await fetch(`/api/projects/${projectId}/issues/${issue.id}`)
      const data = await response.json()
      if (data.success && data.data.activity) {
        setActivity(data.data.activity)
      }
    } catch (err) {
      console.error('Failed to load activity:', err)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await onUpdate({
        title: editForm.title,
        description: editForm.description,
        status: editForm.status,
        priority: editForm.priority,
        assignee: editForm.assignee || undefined,
        dueDate: editForm.dueDate || undefined,
        storyPoints: editForm.storyPoints,
      })
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update issue:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !useAPI) return

    setLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/issues/${issue.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment, is_internal: false }),
      })
      
      const data = await response.json()
      if (data.success) {
        setNewComment('')
        await loadComments()
      }
    } catch (err) {
      console.error('Failed to add comment:', err)
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

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'backlog': return 'bg-gray-100 text-gray-800'
      case 'todo': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'review': return 'bg-purple-100 text-purple-800'
      case 'done': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      case 'blocked': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return formatDate(timestamp)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="text-2xl font-bold mb-2"
              />
            ) : (
              <h2 className="text-2xl font-bold mb-2">{issue.title}</h2>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">{issue.key || issue.id.slice(0, 8)}</span>
              <span>•</span>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(issue.status)}`}>
                {issue.status.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 px-6 pt-4 border-b border-border">
          {(['details', 'comments', 'attachments', 'activity'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'details' && <Flag className="h-4 w-4 inline mr-1" />}
              {tab === 'comments' && <MessageCircle className="h-4 w-4 inline mr-1" />}
              {tab === 'attachments' && <Paperclip className="h-4 w-4 inline mr-1" />}
              {tab === 'activity' && <Activity className="h-4 w-4 inline mr-1" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'comments' && comments.length > 0 && (
                <span className="ml-1 text-xs">({comments.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <Label className="text-sm font-medium mb-2">Description</Label>
                {isEditing ? (
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full min-h-[100px] p-3 border border-border rounded-md"
                    placeholder="Add a description..."
                  />
                ) : (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {issue.description || 'No description provided'}
                  </p>
                )}
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    Status
                  </Label>
                  {isEditing ? (
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Task['status'] })}
                      className="w-full p-2 border border-border rounded-md"
                      aria-label="Status"
                    >
                      <option value="backlog">Backlog</option>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                      <option value="closed">Closed</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  ) : (
                    <span className={`inline-block px-3 py-1 rounded text-sm ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    Priority
                  </Label>
                  {isEditing ? (
                    <select
                      value={editForm.priority}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as Task['priority'] })}
                      className="w-full p-2 border border-border rounded-md"
                      aria-label="Priority"
                    >
                      <option value="lowest">Lowest</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  ) : (
                    <span className={`${getPriorityColor(issue.priority)} font-medium`}>
                      {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                    </span>
                  )}
                </div>

                {/* Assignee */}
                <div>
                  <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Assignee
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editForm.assignee}
                      onChange={(e) => setEditForm({ ...editForm, assignee: e.target.value })}
                      placeholder="Assignee email"
                    />
                  ) : (
                    <p className="text-sm">{issue.assignee || 'Unassigned'}</p>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Due Date
                  </Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editForm.dueDate}
                      onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm">{formatDate(issue.dueDate)}</p>
                  )}
                </div>

                {/* Story Points */}
                <div>
                  <Label className="text-sm font-medium mb-2">Story Points</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      value={editForm.storyPoints}
                      onChange={(e) => setEditForm({ ...editForm, storyPoints: parseInt(e.target.value) || 0 })}
                    />
                  ) : (
                    <p className="text-sm">{issue.storyPoints || 'Not estimated'}</p>
                  )}
                </div>

                {/* Labels */}
                <div>
                  <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Labels
                  </Label>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(issue.labels) && issue.labels.length > 0 ? (
                      issue.labels.map((labelId) => {
                        const labelIds = Array.isArray(issue.labels) 
                          ? issue.labels.map(l => typeof l === 'string' ? l : l.id)
                          : []
                        const label = labels.find(l => labelIds.includes(l.id))
                        return label ? (
                          <span
                            key={label.id}
                            className="px-2 py-1 rounded text-xs"
                            style={{ backgroundColor: label.color + '20', color: label.color }}
                          >
                            {label.name}
                          </span>
                        ) : null
                      })
                    ) : (
                      <span className="text-sm text-muted-foreground">No labels</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              {comments.length === 0 && !useAPI && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Comments are only available when using Supabase backend</p>
                </div>
              )}
              
              {useAPI && (
                <>
                  {/* Comment List */}
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <Card key={comment.id} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {comment.author?.email || 'Unknown'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatTimestamp(comment.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{comment.body}</p>
                      </Card>
                    ))}
                  </div>

                  {/* Add Comment */}
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 p-3 border border-border rounded-md min-h-[80px]"
                    />
                    <Button
                      onClick={handleAddComment}
                      disabled={loading || !newComment.trim()}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Attachments Tab */}
          {activeTab === 'attachments' && (
            <div className="text-center py-12">
              <Paperclip className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">Attachments feature coming soon</p>
              <p className="text-sm text-muted-foreground">
                You'll be able to upload files, images, and documents to issues
              </p>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-3">
              {activity.length === 0 && !useAPI && (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Activity log is only available when using Supabase backend</p>
                </div>
              )}
              
              {activity.map((item) => (
                <div key={item.id} className="flex gap-3 pb-3 border-b border-border last:border-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{item.user?.email || 'System'}</span>
                      {' '}
                      {item.action === 'created' && 'created this issue'}
                      {item.action === 'updated' && 'updated this issue'}
                      {item.action === 'status_changed' && (
                        <>
                          changed status from{' '}
                          <span className="font-medium">{item.old_value}</span> to{' '}
                          <span className="font-medium">{item.new_value}</span>
                        </>
                      )}
                      {item.field_name && item.action !== 'status_changed' && (
                        <>
                          changed {item.field_name} from{' '}
                          <span className="font-medium">{item.old_value || 'empty'}</span> to{' '}
                          <span className="font-medium">{item.new_value}</span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatTimestamp(item.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-border">
          <Button
            variant="destructive"
            onClick={async () => {
              if (confirm('Are you sure you want to delete this issue?')) {
                await onDelete()
                onClose()
              }
            }}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Issue
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              {isEditing ? 'Cancel' : 'Close'}
            </Button>
            {isEditing && (
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
