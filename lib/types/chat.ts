/**
 * Chat Feature Type Definitions
 */

import { Entity, UserEntity } from './common'

export interface ChatRoom extends Entity {
  name: string
  description?: string
  type: 'direct' | 'group'
  created_by?: string
  last_message?: Message
  members?: RoomMember[]
}

export interface RoomMember {
  room_id: string
  user_id: string
  user_email: string
  user_name?: string
  joined_at: string
  last_read_at?: string
}

export interface Message extends Entity {
  room_id: string
  user_id: string
  content: string
  mentions?: string[]
  reactions?: Record<string, string[]>
}

export interface UserPresence {
  user_id: string
  email: string
  name?: string
  status: 'online' | 'offline' | 'away'
  last_seen: string
}

export interface TypingIndicator {
  room_id: string
  user_id: string
  user_name: string
  timestamp: string
}
