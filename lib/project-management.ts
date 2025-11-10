// ============================================
// PROJECT MANAGEMENT TYPES & UTILITIES
// ============================================

export interface Label {
  id: string
  name: string
  color: string
  projectId: string
}

export interface Sprint {
  id: string
  name: string
  goal: string
  startDate: string
  endDate: string
  status: 'planning' | 'active' | 'completed'
  projectId: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee?: string
  labels: string[] // Label IDs
  sprintId?: string
  projectId: string
  storyPoints?: number
  dueDate?: string
  order: number
  createdAt: string
  updatedAt: string
}

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
    if (task.labels.includes(labelId)) {
      task.labels = task.labels.filter(id => id !== labelId)
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
  
  const totalPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0)
  const completedPoints = tasks.filter(t => t.status === 'done').reduce((sum, t) => sum + (t.storyPoints || 0), 0)
  
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
