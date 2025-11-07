import { createClient } from './supabase'

// ============================================
// CHAT ROOMS
// ============================================

export interface ChatRoom {
  id: string
  name: string
  description?: string
  type: 'direct' | 'group'
  created_by?: string
  created_at: string
  updated_at: string
}

export async function createChatRoom(room: Omit<ChatRoom, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('chat_rooms')
    .insert(room)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getChatRooms(userId: string) {
  const supabase = createClient()
  
  // Get rooms where user is a member
  const { data, error } = await supabase
    .from('chat_room_members')
    .select('room_id')
    .eq('user_id', userId)
  
  if (error) throw error
  
  const roomIds = data?.map(m => m.room_id) || []
  
  if (roomIds.length === 0) return []
  
  const { data: rooms, error: roomsError } = await supabase
    .from('chat_rooms')
    .select('*')
    .in('id', roomIds)
    .order('updated_at', { ascending: false })
  
  if (roomsError) throw roomsError
  return rooms || []
}

export async function addRoomMember(roomId: string, userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('chat_room_members')
    .insert({ room_id: roomId, user_id: userId })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getRoomMembers(roomId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('chat_room_members')
    .select('user_id, joined_at')
    .eq('room_id', roomId)
  
  if (error) throw error
  return data || []
}

// ============================================
// MESSAGES
// ============================================

export interface Message {
  id: string
  room_id: string
  user_id: string
  content: string
  mentions?: string[]
  reactions?: Record<string, string[]> // emoji -> array of user IDs
  created_at: string
  updated_at: string
}

export async function sendMessage(message: Omit<Message, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getMessages(roomId: string, limit = 100) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data?.reverse() || []
}

export async function addReaction(messageId: string, emoji: string, userId: string) {
  const supabase = createClient()
  
  // Get current message
  const { data: message, error: fetchError } = await supabase
    .from('messages')
    .select('reactions')
    .eq('id', messageId)
    .single()
  
  if (fetchError) throw fetchError
  
  const reactions = message.reactions || {}
  if (!reactions[emoji]) {
    reactions[emoji] = []
  }
  
  if (!reactions[emoji].includes(userId)) {
    reactions[emoji].push(userId)
  }
  
  const { data, error } = await supabase
    .from('messages')
    .update({ reactions })
    .eq('id', messageId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function removeReaction(messageId: string, emoji: string, userId: string) {
  const supabase = createClient()
  
  // Get current message
  const { data: message, error: fetchError } = await supabase
    .from('messages')
    .select('reactions')
    .eq('id', messageId)
    .single()
  
  if (fetchError) throw fetchError
  
  const reactions = message.reactions || {}
  if (reactions[emoji]) {
    reactions[emoji] = reactions[emoji].filter((id: string) => id !== userId)
    if (reactions[emoji].length === 0) {
      delete reactions[emoji]
    }
  }
  
  const { data, error } = await supabase
    .from('messages')
    .update({ reactions })
    .eq('id', messageId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Subscribe to new messages in a room
export function subscribeToMessages(roomId: string, callback: (message: Message) => void) {
  const supabase = createClient()
  
  const subscription = supabase
    .channel(`room:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        callback(payload.new as Message)
      }
    )
    .subscribe()
  
  return () => {
    subscription.unsubscribe()
  }
}

// ============================================
// COMMENTS
// ============================================

export interface Comment {
  id: string
  user_id: string
  context_type: string
  context_id: string
  content: string
  parent_id?: string
  mentions?: string[]
  reactions?: Record<string, string[]>
  resolved: boolean
  created_at: string
  updated_at: string
}

export async function addComment(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getComments(contextType: string, contextId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('context_type', contextType)
    .eq('context_id', contextId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data || []
}

export async function updateComment(id: string, updates: Partial<Comment>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteComment(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function addCommentReaction(commentId: string, emoji: string, userId: string) {
  const supabase = createClient()
  
  const { data: comment, error: fetchError } = await supabase
    .from('comments')
    .select('reactions')
    .eq('id', commentId)
    .single()
  
  if (fetchError) throw fetchError
  
  const reactions = comment.reactions || {}
  if (!reactions[emoji]) {
    reactions[emoji] = []
  }
  
  if (!reactions[emoji].includes(userId)) {
    reactions[emoji].push(userId)
  }
  
  const { data, error } = await supabase
    .from('comments')
    .update({ reactions })
    .eq('id', commentId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function resolveComment(id: string, resolved: boolean) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .update({ resolved })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Subscribe to new comments
export function subscribeToComments(
  contextType: string,
  contextId: string,
  callback: (comment: Comment) => void
) {
  const supabase = createClient()
  
  const subscription = supabase
    .channel(`comments:${contextType}:${contextId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `context_type=eq.${contextType},context_id=eq.${contextId}`
      },
      (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          callback(payload.new as Comment)
        }
      }
    )
    .subscribe()
  
  return () => {
    subscription.unsubscribe()
  }
}
