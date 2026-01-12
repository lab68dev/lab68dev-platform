/**
 * Team & Collaboration Type Definitions
 */

import { Entity } from './common'

export type Role = 'owner' | 'admin' | 'editor' | 'viewer'

export interface Permission {
  canEdit: boolean
  canDelete: boolean
  canInvite: boolean
  canManageRoles: boolean
  canViewActivity: boolean
}

export interface CollaboratorWithRole {
  email: string
  role: Role
  addedAt: string
  addedBy: string
  lastActive?: string
}

export interface Activity extends Entity {
  project_id: string
  user_id: string
  user_name: string
  action: string
  details?: string
}

export interface TeamMember {
  id: string
  email: string
  name?: string
  role: Role
  avatar?: string
  status: 'active' | 'invited' | 'inactive'
  joinedAt: string
}
