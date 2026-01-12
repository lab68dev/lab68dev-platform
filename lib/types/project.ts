/**
 * Project Management Type Definitions
 */

import { Entity, CollaborativeEntity } from './common'
import { CollaboratorWithRole } from './team'

export interface Project extends CollaborativeEntity {
  name: string
  description: string
  status: 'active' | 'completed' | 'archived' | 'on-hold'
  priority: 'low' | 'medium' | 'high' | 'critical'
  tech: string[]
  tags?: string[]
  startDate?: string
  endDate?: string
  progress: number
}

export interface Task extends Entity {
  project_id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee?: string
  dueDate?: string
  estimatedHours?: number
  actualHours?: number
  tags?: string[]
}

export interface Milestone extends Entity {
  project_id: string
  name: string
  description?: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed'
  tasks?: string[]
}

export interface ProjectMetrics {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  overdueTasks: number
  progress: number
  velocity: number
}
