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

export interface UserPresence {
  user_id: string
  email: string
  name?: string
  status: 'online' | 'offline' | 'away'
  last_seen: string
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

// Create or get direct chat room between two users
export async function getOrCreateDirectChat(userId1: string, userId2: string) {
  const supabase = createClient()
  
  // Check if direct chat already exists between these users
  const { data: existingRooms, error: searchError } = await supabase
    .from('chat_room_members')
    .select('room_id, chat_rooms!inner(id, type, name)')
    .eq('user_id', userId1)
  
  if (searchError) throw searchError
  
  // Find a direct chat that includes both users
  for (const roomData of existingRooms || []) {
    const { data: members } = await supabase
      .from('chat_room_members')
      .select('user_id')
      .eq('room_id', roomData.room_id)
    
    const memberIds = members?.map(m => m.user_id) || []
    
    // Check if this is a direct chat with exactly these two users
    if (memberIds.length === 2 && 
        memberIds.includes(userId1) && 
        memberIds.includes(userId2) &&
        (roomData.chat_rooms as any).type === 'direct') {
      // Fetch full room data
      const { data: room } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('id', roomData.room_id)
        .single()
      
      return room
    }
  }
  
  // No existing direct chat, create one
  const { data: user2Data } = await supabase
    .from('users')
    .select('email, name')
    .eq('id', userId2)
    .single()
  
  const chatName = user2Data?.name || user2Data?.email || 'Direct Chat'
  
  const { data: newRoom, error: createError } = await supabase
    .from('chat_rooms')
    .insert({
      name: chatName,
      type: 'direct',
      created_by: userId1
    })
    .select()
    .single()
  
  if (createError) throw createError
  
  // Add both users as members
  await addRoomMember(newRoom.id, userId1)
  await addRoomMember(newRoom.id, userId2)
  
  return newRoom
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
    .select(`
      *,
      members:chat_room_members(user_id, user_email, user_name, joined_at, last_read_at)
    `)
    .in('id', roomIds)
    .order('updated_at', { ascending: false })
  
  if (roomsError) throw roomsError
  
  // Get last message for each room
  const roomsWithMessages = await Promise.all(
    (rooms || []).map(async (room) => {
      const { data: lastMsg } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', room.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      return {
        ...room,
        last_message: lastMsg || undefined
      }
    })
  )
  
  return roomsWithMessages
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

export async function updateMessage(id: string, content: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('messages')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteMessage(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id)
  
  if (error) throw error
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

// Subscribe to message updates (edits/deletes)
export function subscribeToMessageUpdates(roomId: string, onUpdate: (message: Message) => void, onDelete: (messageId: string) => void) {
  const supabase = createClient()
  
  const subscription = supabase
    .channel(`room_updates:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        onUpdate(payload.new as Message)
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        onDelete(payload.old.id)
      }
    )
    .subscribe()
  
  return () => {
    subscription.unsubscribe()
  }
}

// ============================================
// USER PRESENCE
// ============================================

export async function updateUserPresence(userId: string, email: string, name: string | undefined, status: 'online' | 'offline' | 'away') {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_presence')
    .upsert({
      user_id: userId,
      email,
      name,
      status,
      last_seen: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getUserPresence(userId: string): Promise<UserPresence | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_presence')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) return null
  return data
}

export async function getAllUsersPresence(): Promise<UserPresence[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_presence')
    .select('*')
    .order('email', { ascending: true })
  
  if (error) return []
  return data || []
}

export async function getCollaboratorsPresence(userIds: string[]): Promise<UserPresence[]> {
  const supabase = createClient()
  
  if (userIds.length === 0) return []
  
  const { data, error } = await supabase
    .from('user_presence')
    .select('*')
    .in('user_id', userIds)
  
  if (error) return []
  return data || []
}

// Subscribe to presence changes
export function subscribeToPresence(callback: (presence: UserPresence) => void) {
  const supabase = createClient()
  
  const subscription = supabase
    .channel('user_presence_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_presence'
      },
      (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          callback(payload.new as UserPresence)
        }
      }
    )
    .subscribe()
  
  return () => {
    subscription.unsubscribe()
  }
}

// Set user as online when they join
export async function setUserOnline(userId: string, email: string, name?: string) {
  return updateUserPresence(userId, email, name, 'online')
}

// Set user as offline when they leave
export async function setUserOffline(userId: string, email: string, name?: string) {
  return updateUserPresence(userId, email, name, 'offline')
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
