// ============================================
// PROJECT MANAGEMENT TYPES & UTILITIES
// ============================================

// Feature flag: set to true to use API backend, false for localStorage
const USE_API_BACKEND = typeof window !== 'undefined' && 
  process.env.NEXT_PUBLIC_USE_SUPABASE_BACKEND === 'true'

export interface Label {
  id: string
  name: string
  color: string
  projectId?: string
  project_id?: string
  description?: string
}

export interface Sprint {
  id: string
  name: string
  goal: string
  startDate?: string
  endDate?: string
  start_date?: string
  end_date?: string
  status: 'planning' | 'active' | 'completed'
  projectId?: string
  project_id?: string
}

// Issue is the new name for Task (Jira-like)
export interface Issue {
  id: string
  key?: string
  title: string
  description: string
  issue_type?: 'story' | 'task' | 'bug' | 'epic' | 'subtask'
  issueType?: 'story' | 'task' | 'bug' | 'epic' | 'subtask'
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done' | 'closed' | 'blocked'
  priority: 'lowest' | 'low' | 'medium' | 'high' | 'urgent'
  assignee?: string
  assignee_id?: string
  assigneeId?: string
  reporter_id?: string
  reporterId?: string
  labels: string[] | Label[] // Label IDs or full objects
  sprintId?: string
  sprint_id?: string
  epicId?: string
  epic_id?: string
  parentId?: string
  parent_id?: string
  projectId?: string
  project_id?: string
  storyPoints?: number
  story_points?: number
  dueDate?: string
  due_date?: string
  order: number
  order_index?: number
  createdAt?: string
  created_at?: string
  updatedAt?: string
  updated_at?: string
  resolved_at?: string
}

// Keep Task as an alias for backward compatibility
export type Task = Issue

// Default label colors
export const DEFAULT_LABEL_COLORS = [
  '#ef4444', // red
  '#f59e0b', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#6b7280', // gray
]

// LocalStorage keys
export const STORAGE_KEYS = {
  LABELS: (projectId: string) => `labels_${projectId}`,
  SPRINTS: (projectId: string) => `sprints_${projectId}`,
  TASKS: (projectId: string) => `tasks_${projectId}`,
}

// ============================================
// LABEL OPERATIONS
// ============================================

export function getLabels(projectId: string): Label[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEYS.LABELS(projectId))
  return stored ? JSON.parse(stored) : []
}

export function createLabel(projectId: string, name: string, color: string): Label {
  const labels = getLabels(projectId)
  const newLabel: Label = {
    id: `label_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    color,
    projectId,
  }
  labels.push(newLabel)
  localStorage.setItem(STORAGE_KEYS.LABELS(projectId), JSON.stringify(labels))
  return newLabel
}

export function updateLabel(projectId: string, labelId: string, updates: Partial<Label>): Label | null {
  const labels = getLabels(projectId)
  const index = labels.findIndex(l => l.id === labelId)
  if (index === -1) return null
  
  labels[index] = { ...labels[index], ...updates }
  localStorage.setItem(STORAGE_KEYS.LABELS(projectId), JSON.stringify(labels))
  return labels[index]
}

export function deleteLabel(projectId: string, labelId: string): void {
  const labels = getLabels(projectId)
  const filtered = labels.filter(l => l.id !== labelId)
  localStorage.setItem(STORAGE_KEYS.LABELS(projectId), JSON.stringify(filtered))
  
  // Remove label from all tasks
  const tasks = getTasks(projectId)
  tasks.forEach(task => {
    const taskLabels = task.labels as string[]
    if (Array.isArray(taskLabels) && taskLabels.includes(labelId)) {
      task.labels = taskLabels.filter(id => id !== labelId)
    }
  })
  saveTasks(projectId, tasks)
}

// ============================================
// SPRINT OPERATIONS
// ============================================

export function getSprints(projectId: string): Sprint[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEYS.SPRINTS(projectId))
  return stored ? JSON.parse(stored) : []
}

export function createSprint(projectId: string, sprint: Omit<Sprint, 'id'>): Sprint {
  const sprints = getSprints(projectId)
  const newSprint: Sprint = {
    ...sprint,
    id: `sprint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  }
  sprints.push(newSprint)
  localStorage.setItem(STORAGE_KEYS.SPRINTS(projectId), JSON.stringify(sprints))
  return newSprint
}

export function updateSprint(projectId: string, sprintId: string, updates: Partial<Sprint>): Sprint | null {
  const sprints = getSprints(projectId)
  const index = sprints.findIndex(s => s.id === sprintId)
  if (index === -1) return null
  
  sprints[index] = { ...sprints[index], ...updates }
  localStorage.setItem(STORAGE_KEYS.SPRINTS(projectId), JSON.stringify(sprints))
  return sprints[index]
}

export function deleteSprint(projectId: string, sprintId: string): void {
  const sprints = getSprints(projectId)
  const filtered = sprints.filter(s => s.id !== sprintId)
  localStorage.setItem(STORAGE_KEYS.SPRINTS(projectId), JSON.stringify(filtered))
  
  // Move sprint tasks back to backlog
  const tasks = getTasks(projectId)
  tasks.forEach(task => {
    if (task.sprintId === sprintId) {
      task.sprintId = undefined
      task.status = 'backlog'
    }
  })
  saveTasks(projectId, tasks)
}

export function getActiveSprint(projectId: string): Sprint | null {
  const sprints = getSprints(projectId)
  return sprints.find(s => s.status === 'active') || null
}

// ============================================
// TASK OPERATIONS
// ============================================

export function getTasks(projectId: string): Task[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEYS.TASKS(projectId))
  return stored ? JSON.parse(stored) : []
}

export function saveTasks(projectId: string, tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEYS.TASKS(projectId), JSON.stringify(tasks))
}

export function createTask(projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>): Task {
  const tasks = getTasks(projectId)
  const maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) : 0
  
  const newTask: Task = {
    ...task,
    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    order: maxOrder + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  tasks.push(newTask)
  saveTasks(projectId, tasks)
  return newTask
}

export function updateTask(projectId: string, taskId: string, updates: Partial<Task>): Task | null {
  const tasks = getTasks(projectId)
  const index = tasks.findIndex(t => t.id === taskId)
  if (index === -1) return null
  
  tasks[index] = { 
    ...tasks[index], 
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  saveTasks(projectId, tasks)
  return tasks[index]
}

export function deleteTask(projectId: string, taskId: string): void {
  const tasks = getTasks(projectId)
  const filtered = tasks.filter(t => t.id !== taskId)
  saveTasks(projectId, filtered)
}

export function reorderTasks(projectId: string, taskIds: string[]): void {
  const tasks = getTasks(projectId)
  taskIds.forEach((id, index) => {
    const task = tasks.find(t => t.id === id)
    if (task) {
      task.order = index
    }
  })
  saveTasks(projectId, tasks)
}

export function moveTaskToSprint(projectId: string, taskId: string, sprintId: string | undefined): Task | null {
  const task = updateTask(projectId, taskId, { 
    sprintId,
    status: sprintId ? 'todo' : 'backlog'
  })
  return task
}

export function getTasksByStatus(projectId: string, status: Task['status']): Task[] {
  const tasks = getTasks(projectId)
  return tasks.filter(t => t.status === status).sort((a, b) => a.order - b.order)
}

export function getTasksBySprint(projectId: string, sprintId: string | undefined): Task[] {
  const tasks = getTasks(projectId)
  if (sprintId === undefined) {
    return tasks.filter(t => t.status === 'backlog').sort((a, b) => a.order - b.order)
  }
  return tasks.filter(t => t.sprintId === sprintId).sort((a, b) => a.order - b.order)
}

// ============================================
// STATISTICS
// ============================================

export function getSprintStats(projectId: string, sprintId: string) {
  const tasks = getTasksBySprint(projectId, sprintId)
  const completed = tasks.filter(t => t.status === 'done').length
  const inProgress = tasks.filter(t => t.status === 'in-progress').length
  const todo = tasks.filter(t => t.status === 'todo').length
  const review = tasks.filter(t => t.status === 'review').length
  
  const totalPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || t.story_points || 0), 0)
  const completedPoints = tasks.filter(t => t.status === 'done').reduce((sum, t) => sum + (t.storyPoints || t.story_points || 0), 0)
  
  return {
    total: tasks.length,
    completed,
    inProgress,
    todo,
    review,
    totalPoints,
    completedPoints,
    completionRate: tasks.length > 0 ? (completed / tasks.length) * 100 : 0,
  }
}

// ============================================
// API-BACKED FUNCTIONS (when USE_API_BACKEND is true)
// ============================================

// Helper to convert snake_case API response to camelCase for compatibility
function normalizeIssue(issue: any): Issue {
  return {
    ...issue,
    issueType: issue.issue_type || issue.issueType,
    assigneeId: issue.assignee_id || issue.assigneeId,
    reporterId: issue.reporter_id || issue.reporterId,
    sprintId: issue.sprint_id || issue.sprintId,
    epicId: issue.epic_id || issue.epicId,
    parentId: issue.parent_id || issue.parentId,
    projectId: issue.project_id || issue.projectId,
    storyPoints: issue.story_points || issue.storyPoints,
    dueDate: issue.due_date || issue.dueDate,
    order: issue.order_index !== undefined ? issue.order_index : issue.order,
    createdAt: issue.created_at || issue.createdAt,
    updatedAt: issue.updated_at || issue.updatedAt,
  }
}

// API: Fetch issues
export async function fetchIssuesAPI(projectId: string, filters?: any): Promise<Issue[]> {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.sprintId) params.set('sprintId', filters.sprintId)
  if (filters?.assigneeId) params.set('assigneeId', filters.assigneeId)
  if (filters?.issueType) params.set('issueType', filters.issueType)
  if (filters?.epicId) params.set('epicId', filters.epicId)
  if (filters?.search) params.set('search', filters.search)

  const url = `/api/projects/${projectId}/issues?${params.toString()}`
  const response = await fetch(url)
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch issues')
  }
  
  return data.data.map(normalizeIssue)
}

// API: Create issue
export async function createIssueAPI(projectId: string, issue: Partial<Issue>): Promise<Issue> {
  const response = await fetch(`/api/projects/${projectId}/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: issue.title,
      description: issue.description,
      issue_type: issue.issueType || issue.issue_type || 'task',
      status: issue.status || 'backlog',
      priority: issue.priority || 'medium',
      assignee_id: issue.assigneeId || issue.assignee_id,
      sprint_id: issue.sprintId || issue.sprint_id,
      epic_id: issue.epicId || issue.epic_id,
      parent_id: issue.parentId || issue.parent_id,
      story_points: issue.storyPoints || issue.story_points,
      due_date: issue.dueDate || issue.due_date,
      labels: issue.labels || [],
    }),
  })
  
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to create issue')
  }
  
  return normalizeIssue(data.data)
}

// API: Update issue
export async function updateIssueAPI(projectId: string, issueId: string, updates: Partial<Issue>): Promise<Issue> {
  const payload: any = {}
  
  if (updates.title !== undefined) payload.title = updates.title
  if (updates.description !== undefined) payload.description = updates.description
  if (updates.status !== undefined) payload.status = updates.status
  if (updates.priority !== undefined) payload.priority = updates.priority
  if (updates.issueType !== undefined || updates.issue_type !== undefined) {
    payload.issue_type = updates.issueType || updates.issue_type
  }
  if (updates.assigneeId !== undefined || updates.assignee_id !== undefined) {
    payload.assignee_id = updates.assigneeId || updates.assignee_id
  }
  if (updates.sprintId !== undefined || updates.sprint_id !== undefined) {
    payload.sprint_id = updates.sprintId || updates.sprint_id
  }
  if (updates.epicId !== undefined || updates.epic_id !== undefined) {
    payload.epic_id = updates.epicId || updates.epic_id
  }
  if (updates.storyPoints !== undefined || updates.story_points !== undefined) {
    payload.story_points = updates.storyPoints || updates.story_points
  }
  if (updates.dueDate !== undefined || updates.due_date !== undefined) {
    payload.due_date = updates.dueDate || updates.due_date
  }
  if (updates.order !== undefined || updates.order_index !== undefined) {
    payload.order_index = updates.order !== undefined ? updates.order : updates.order_index
  }
  if (updates.labels !== undefined) payload.labels = updates.labels

  const response = await fetch(`/api/projects/${projectId}/issues/${issueId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to update issue')
  }
  
  return normalizeIssue(data.data)
}

// API: Delete issue
export async function deleteIssueAPI(projectId: string, issueId: string): Promise<void> {
  const response = await fetch(`/api/projects/${projectId}/issues/${issueId}`, {
    method: 'DELETE',
  })
  
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to delete issue')
  }
}

// API: Fetch labels
export async function fetchLabelsAPI(projectId: string): Promise<Label[]> {
  const response = await fetch(`/api/projects/${projectId}/labels`)
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch labels')
  }
  
  return data.data
}

// API: Create label
export async function createLabelAPI(projectId: string, name: string, color: string): Promise<Label> {
  const response = await fetch(`/api/projects/${projectId}/labels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  })
  
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to create label')
  }
  
  return data.data
}

// API: Fetch sprints
export async function fetchSprintsAPI(projectId: string, status?: string): Promise<Sprint[]> {
  const url = status 
    ? `/api/projects/${projectId}/sprints?status=${status}`
    : `/api/projects/${projectId}/sprints`
  
  const response = await fetch(url)
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch sprints')
  }
  
  return data.data.map((sprint: any) => ({
    ...sprint,
    startDate: sprint.start_date || sprint.startDate,
    endDate: sprint.end_date || sprint.endDate,
    projectId: sprint.project_id || sprint.projectId,
  }))
}

// API: Create sprint
export async function createSprintAPI(projectId: string, sprint: Omit<Sprint, 'id'>): Promise<Sprint> {
  const response = await fetch(`/api/projects/${projectId}/sprints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: sprint.name,
      goal: sprint.goal,
      start_date: sprint.startDate || sprint.start_date,
      end_date: sprint.endDate || sprint.end_date,
      status: sprint.status || 'planning',
    }),
  })
  
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to create sprint')
  }
  
  return {
    ...data.data,
    startDate: data.data.start_date,
    endDate: data.data.end_date,
    projectId: data.data.project_id,
  }
}

