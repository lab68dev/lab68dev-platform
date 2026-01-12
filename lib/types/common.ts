/**
 * Shared Type Definitions
 * 
 * Common types used across multiple features.
 */

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  language?: string
  bio?: string
  location?: string
  website?: string
  avatar?: string
}

export interface UserProfile extends User {
  role?: 'user' | 'admin' | 'staff'
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
  emailUpdates: boolean
}

// ============================================
// AUTHENTICATION TYPES
// ============================================

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData extends LoginCredentials {
  name: string
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ============================================
// DATABASE TYPES
// ============================================

export interface DatabaseConfig {
  url: string
  key: string
}

export interface DatabaseError {
  code: string
  message: string
  details?: any
}

// ============================================
// COMMON ENTITY TYPES
// ============================================

export interface Entity {
  id: string
  created_at: string
  updated_at: string
}

export interface UserEntity extends Entity {
  user_id: string
}

export interface CollaborativeEntity extends Entity {
  created_by: string
  collaborators?: string[]
}

// ============================================
// UTILITY TYPES
// ============================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type WithoutId<T> = Omit<T, 'id'>

export type WithoutTimestamps<T> = Omit<T, 'created_at' | 'updated_at'>
