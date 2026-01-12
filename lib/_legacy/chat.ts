// Chat and Messaging Types and Utilities

export interface Message {
  id: string
  roomId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  mentions: string[] // Array of user IDs mentioned
  attachments?: Attachment[]
  replyTo?: string // Message ID being replied to
  reactions: Reaction[]
  createdAt: string
  updatedAt?: string
  readBy: string[] // Array of user IDs who read the message
  edited: boolean
}

export interface Attachment {
  id: string
  name: string
  type: string // mime type
  size: number
  url: string
}

export interface Reaction {
  emoji: string
  userId: string
  userName: string
}

export interface ChatRoom {
  id: string
  name: string
  type: "direct" | "group" | "project"
  projectId?: string // If linked to a project
  members: RoomMember[]
  createdBy: string
  createdAt: string
  lastMessage?: Message
  unreadCount?: number
}

export interface RoomMember {
  userId: string
  userName: string
  userAvatar?: string
  role: "owner" | "admin" | "member"
  joinedAt: string
  lastRead?: string // Timestamp of last read message
  typing?: boolean
}

export interface Comment {
  id: string
  contextId: string // ID of task, diagram, project, etc.
  contextType: "project" | "task" | "diagram" | "file"
  userId: string
  userName: string
  userAvatar?: string
  content: string
  mentions: string[] // Array of user IDs mentioned
  replyTo?: string // Comment ID being replied to
  reactions: Reaction[]
  createdAt: string
  updatedAt?: string
  edited: boolean
  resolved?: boolean
}

export interface TypingIndicator {
  roomId: string
  userId: string
  userName: string
  timestamp: string
}

// Storage keys
const MESSAGES_KEY = "lab68_messages"
const ROOMS_KEY = "lab68_chat_rooms"
const COMMENTS_KEY = "lab68_comments"
const TYPING_KEY = "lab68_typing"

// ==================== CHAT ROOM FUNCTIONS ====================

export function createChatRoom(
  name: string,
  type: "direct" | "group" | "project",
  createdBy: string,
  members: string[],
  projectId?: string,
): ChatRoom {
  const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const room: ChatRoom = {
    id: roomId,
    name,
    type,
    projectId,
    members: members.map((userId) => ({
      userId,
      userName: userId, // In real app, fetch from user database
      role: userId === createdBy ? "owner" : "member",
      joinedAt: new Date().toISOString(),
    })),
    createdBy,
    createdAt: new Date().toISOString(),
  }

  // Save to storage
  const rooms = getAllChatRooms()
  rooms.push(room)
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms))

  return room
}

export function getAllChatRooms(): ChatRoom[] {
  const stored = localStorage.getItem(ROOMS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function getChatRoom(roomId: string): ChatRoom | null {
  const rooms = getAllChatRooms()
  return rooms.find((r) => r.id === roomId) || null
}

export function getUserChatRooms(userId: string): ChatRoom[] {
  const rooms = getAllChatRooms()
  return rooms.filter((room) => room.members.some((m) => m.userId === userId))
}

export function updateChatRoom(roomId: string, updates: Partial<ChatRoom>): ChatRoom | null {
  const rooms = getAllChatRooms()
  const index = rooms.findIndex((r) => r.id === roomId)
  
  if (index === -1) return null
  
  rooms[index] = { ...rooms[index], ...updates }
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms))
  
  return rooms[index]
}

// ==================== MESSAGE FUNCTIONS ====================

export function sendMessage(
  roomId: string,
  userId: string,
  userName: string,
  content: string,
  options?: {
    mentions?: string[]
    attachments?: Attachment[]
    replyTo?: string
  },
): Message {
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const message: Message = {
    id: messageId,
    roomId,
    userId,
    userName,
    content,
    mentions: options?.mentions || [],
    attachments: options?.attachments,
    replyTo: options?.replyTo,
    reactions: [],
    createdAt: new Date().toISOString(),
    readBy: [userId],
    edited: false,
  }

  // Save message
  const messages = getAllMessages()
  messages.unshift(message)
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages.slice(0, 10000)))

  // Update room's last message
  updateChatRoom(roomId, { lastMessage: message })

  // Trigger mention notifications
  if (message.mentions.length > 0) {
    triggerMentionNotifications(message)
  }

  return message
}

export function getAllMessages(): Message[] {
  const stored = localStorage.getItem(MESSAGES_KEY)
  return stored ? JSON.parse(stored) : []
}

export function getRoomMessages(roomId: string, limit: number = 100): Message[] {
  const messages = getAllMessages()
  return messages.filter((m) => m.roomId === roomId).slice(0, limit)
}

export function getMessage(messageId: string): Message | null {
  const messages = getAllMessages()
  return messages.find((m) => m.id === messageId) || null
}

export function editMessage(messageId: string, newContent: string): Message | null {
  const messages = getAllMessages()
  const index = messages.findIndex((m) => m.id === messageId)
  
  if (index === -1) return null
  
  messages[index] = {
    ...messages[index],
    content: newContent,
    updatedAt: new Date().toISOString(),
    edited: true,
  }
  
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  return messages[index]
}

export function deleteMessage(messageId: string): boolean {
  const messages = getAllMessages()
  const filtered = messages.filter((m) => m.id !== messageId)
  
  if (filtered.length === messages.length) return false
  
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(filtered))
  return true
}

export function addReaction(messageId: string, emoji: string, userId: string, userName: string): Message | null {
  const messages = getAllMessages()
  const index = messages.findIndex((m) => m.id === messageId)
  
  if (index === -1) return null
  
  // Check if user already reacted with this emoji
  const existingReaction = messages[index].reactions.find(
    (r) => r.emoji === emoji && r.userId === userId
  )
  
  if (existingReaction) {
    // Remove reaction
    messages[index].reactions = messages[index].reactions.filter(
      (r) => !(r.emoji === emoji && r.userId === userId)
    )
  } else {
    // Add reaction
    messages[index].reactions.push({ emoji, userId, userName })
  }
  
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  return messages[index]
}

export function markMessageAsRead(messageId: string, userId: string): Message | null {
  const messages = getAllMessages()
  const index = messages.findIndex((m) => m.id === messageId)
  
  if (index === -1) return null
  
  if (!messages[index].readBy.includes(userId)) {
    messages[index].readBy.push(userId)
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  }
  
  return messages[index]
}

export function markRoomAsRead(roomId: string, userId: string): void {
  const messages = getRoomMessages(roomId)
  const allMessages = getAllMessages()
  
  messages.forEach((msg) => {
    const index = allMessages.findIndex((m) => m.id === msg.id)
    if (index !== -1 && !allMessages[index].readBy.includes(userId)) {
      allMessages[index].readBy.push(userId)
    }
  })
  
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages))
}

// ==================== COMMENT FUNCTIONS ====================

export function addComment(
  contextId: string,
  contextType: "project" | "task" | "diagram" | "file",
  userId: string,
  userName: string,
  content: string,
  options?: {
    mentions?: string[]
    replyTo?: string
  },
): Comment {
  const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const comment: Comment = {
    id: commentId,
    contextId,
    contextType,
    userId,
    userName,
    content,
    mentions: options?.mentions || [],
    replyTo: options?.replyTo,
    reactions: [],
    createdAt: new Date().toISOString(),
    edited: false,
    resolved: false,
  }

  // Save comment
  const comments = getAllComments()
  comments.unshift(comment)
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments.slice(0, 10000)))

  // Trigger mention notifications
  if (comment.mentions.length > 0) {
    triggerCommentMentionNotifications(comment)
  }

  return comment
}

export function getAllComments(): Comment[] {
  const stored = localStorage.getItem(COMMENTS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function getContextComments(contextId: string, contextType?: string): Comment[] {
  const comments = getAllComments()
  return comments.filter((c) => 
    c.contextId === contextId && 
    (!contextType || c.contextType === contextType)
  )
}

export function getComment(commentId: string): Comment | null {
  const comments = getAllComments()
  return comments.find((c) => c.id === commentId) || null
}

export function editComment(commentId: string, newContent: string): Comment | null {
  const comments = getAllComments()
  const index = comments.findIndex((c) => c.id === commentId)
  
  if (index === -1) return null
  
  comments[index] = {
    ...comments[index],
    content: newContent,
    updatedAt: new Date().toISOString(),
    edited: true,
  }
  
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments))
  return comments[index]
}

export function deleteComment(commentId: string): boolean {
  const comments = getAllComments()
  const filtered = comments.filter((c) => c.id !== commentId)
  
  if (filtered.length === comments.length) return false
  
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(filtered))
  return true
}

export function addCommentReaction(commentId: string, emoji: string, userId: string, userName: string): Comment | null {
  const comments = getAllComments()
  const index = comments.findIndex((c) => c.id === commentId)
  
  if (index === -1) return null
  
  const existingReaction = comments[index].reactions.find(
    (r) => r.emoji === emoji && r.userId === userId
  )
  
  if (existingReaction) {
    comments[index].reactions = comments[index].reactions.filter(
      (r) => !(r.emoji === emoji && r.userId === userId)
    )
  } else {
    comments[index].reactions.push({ emoji, userId, userName })
  }
  
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments))
  return comments[index]
}

export function resolveComment(commentId: string): Comment | null {
  const comments = getAllComments()
  const index = comments.findIndex((c) => c.id === commentId)
  
  if (index === -1) return null
  
  comments[index].resolved = !comments[index].resolved
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments))
  
  return comments[index]
}

// ==================== TYPING INDICATORS ====================

export function setTyping(roomId: string, userId: string, userName: string): void {
  const indicators = getTypingIndicators()
  const existing = indicators.findIndex((i) => i.roomId === roomId && i.userId === userId)
  
  const indicator: TypingIndicator = {
    roomId,
    userId,
    userName,
    timestamp: new Date().toISOString(),
  }
  
  if (existing !== -1) {
    indicators[existing] = indicator
  } else {
    indicators.push(indicator)
  }
  
  localStorage.setItem(TYPING_KEY, JSON.stringify(indicators))
}

export function clearTyping(roomId: string, userId: string): void {
  const indicators = getTypingIndicators()
  const filtered = indicators.filter((i) => !(i.roomId === roomId && i.userId === userId))
  localStorage.setItem(TYPING_KEY, JSON.stringify(filtered))
}

export function getTypingIndicators(): TypingIndicator[] {
  const stored = localStorage.getItem(TYPING_KEY)
  return stored ? JSON.parse(stored) : []
}

export function getRoomTypingUsers(roomId: string, currentUserId: string): string[] {
  const indicators = getTypingIndicators()
  const now = new Date().getTime()
  
  // Filter out stale indicators (older than 5 seconds) and current user
  return indicators
    .filter((i) => {
      if (i.roomId !== roomId || i.userId === currentUserId) return false
      const timestamp = new Date(i.timestamp).getTime()
      return now - timestamp < 5000
    })
    .map((i) => i.userName)
}

// ==================== MENTION UTILITIES ====================

export function parseMentions(content: string): string[] {
  const mentionRegex = /@(\w+)/g
  const mentions: string[] = []
  let match
  
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1])
  }
  
  return mentions
}

export function highlightMentions(content: string): string {
  return content.replace(/@(\w+)/g, '<span class="mention">@$1</span>')
}

// ==================== NOTIFICATION HELPERS ====================

function triggerMentionNotifications(message: Message): void {
  // In a real app, this would send notifications to mentioned users
  console.log(`Mention notification for message ${message.id}:`, message.mentions)
  
  // Store notification
  const notifications = JSON.parse(localStorage.getItem("lab68_mention_notifications") || "[]")
  message.mentions.forEach((userId) => {
    notifications.unshift({
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "message_mention",
      userId,
      fromUser: message.userName,
      content: message.content.substring(0, 100),
      roomId: message.roomId,
      messageId: message.id,
      createdAt: new Date().toISOString(),
      read: false,
    })
  })
  localStorage.setItem("lab68_mention_notifications", JSON.stringify(notifications.slice(0, 100)))
}

function triggerCommentMentionNotifications(comment: Comment): void {
  console.log(`Comment mention notification for ${comment.id}:`, comment.mentions)
  
  const notifications = JSON.parse(localStorage.getItem("lab68_mention_notifications") || "[]")
  comment.mentions.forEach((userId) => {
    notifications.unshift({
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "comment_mention",
      userId,
      fromUser: comment.userName,
      content: comment.content.substring(0, 100),
      contextId: comment.contextId,
      contextType: comment.contextType,
      commentId: comment.id,
      createdAt: new Date().toISOString(),
      read: false,
    })
  })
  localStorage.setItem("lab68_mention_notifications", JSON.stringify(notifications.slice(0, 100)))
}

export function getMentionNotifications(userId: string): any[] {
  const notifications = JSON.parse(localStorage.getItem("lab68_mention_notifications") || "[]")
  return notifications.filter((n: any) => n.userId === userId)
}

export function markNotificationAsRead(notificationId: string): void {
  const notifications = JSON.parse(localStorage.getItem("lab68_mention_notifications") || "[]")
  const index = notifications.findIndex((n: any) => n.id === notificationId)
  
  if (index !== -1) {
    notifications[index].read = true
    localStorage.setItem("lab68_mention_notifications", JSON.stringify(notifications))
  }
}

// ==================== UNREAD COUNT ====================

export function getUnreadCount(roomId: string, userId: string): number {
  const messages = getRoomMessages(roomId)
  return messages.filter((m) => !m.readBy.includes(userId) && m.userId !== userId).length
}

export function getTotalUnreadCount(userId: string): number {
  const rooms = getUserChatRooms(userId)
  return rooms.reduce((total, room) => total + getUnreadCount(room.id, userId), 0)
}
