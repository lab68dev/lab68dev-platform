"use client"

import { useState, useEffect, useRef } from "react"
import { getTranslations } from "@/lib/config"
import { getCurrentUser } from "@/lib/features/auth"
import {
  getChatRooms,
  getMessages,
  sendMessage as sendSupabaseMessage,
  updateMessage,
  deleteMessage,
  addReaction,
  subscribeToMessages,
  subscribeToMessageUpdates,
  createChatRoom,
  addRoomMember,
  getOrCreateDirectChat,
  updateUserPresence,
  getAllUsersPresence,
  subscribeToPresence,
  type ChatRoom,
  type Message,
  type UserPresence,
} from "@/lib/features/chat"
import {
  initSocket,
  joinUserSocket,
  joinRoom,
  leaveRoom,
  sendMessage as sendSocketMessage,
  editMessage as editSocketMessage,
  deleteMessage as deleteSocketMessage,
  addReaction as addSocketReaction,
  startTyping,
  stopTyping,
  onNewMessage,
  onMessageUpdated,
  onMessageDeleted,
  onMessageReaction,
  onUserTyping,
  onUserStoppedTyping,
  onUserStatus,
  onConnect,
  onDisconnect,
  onConnectError,
  removeAllListeners,
  disconnectSocket,
} from "@/lib/features/chat/socket"

export default function ChatPage() {
  const t = getTranslations("en")
  const user = getCurrentUser()
  
  // Ensure user is authenticated
  if (!user || !user.email) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-2">Please log in to use chat</p>
          <a href="/login" className="text-primary hover:underline">
            Go to login
          </a>
        </div>
      </div>
    )
  }
  
  const currentUser = user.email
  const currentUserId = user.email
  
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [chatType, setChatType] = useState<'direct' | 'group'>('direct')
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([])
  const [showCollaborators, setShowCollaborators] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [isLoadingRooms, setIsLoadingRooms] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSocketConnected, setIsSocketConnected] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const unsubscribeMessagesRef = useRef<(() => void) | null>(null)
  const unsubscribeUpdatesRef = useRef<(() => void) | null>(null)
  const unsubscribePresenceRef = useRef<(() => void) | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize Socket.io and set up presence
  useEffect(() => {
    loadRooms()
    loadOnlineUsers()
    
    // Initialize Socket.io connection
    initSocket()
    joinUserSocket(currentUserId, currentUser, user?.name)
    
    // Set initial connection status
    setIsSocketConnected(true)

    // Socket connection listeners
    onConnect(() => {
      console.log("Socket connected")
      setIsSocketConnected(true)
      // Re-join user room on reconnect
      joinUserSocket(currentUserId, currentUser, user?.name)
      if (selectedRoom) {
        joinRoom(selectedRoom.id)
      }
    })

    onDisconnect(() => {
      console.log("Socket disconnected")
      setIsSocketConnected(false)
    })

    onConnectError((err) => {
      console.error("Socket connection error:", err)
      setIsSocketConnected(false)
    })
    
    // Set user as online
    updateUserPresence(currentUserId, currentUser, user?.name, 'online')
    
    // Subscribe to presence changes
    unsubscribePresenceRef.current = subscribeToPresence((presence) => {
      setOnlineUsers(prev => {
        const filtered = prev.filter(p => p.user_id !== presence.user_id)
        return [...filtered, presence]
      })
    })
    
    // Set up Socket.io event listeners
    onUserStatus((data) => {
      setOnlineUsers(prev => {
        const filtered = prev.filter(p => p.user_id !== data.userId)
        if (data.status === 'online') {
          return [...filtered, {
            user_id: data.userId,
            email: data.email,
            name: data.name,
            status: data.status,
            last_seen: new Date().toISOString(),
          }]
        }
        return filtered
      })
    })
    
    // Set user as offline on unmount
    return () => {
      updateUserPresence(currentUserId, currentUser, user?.name, 'offline')
      unsubscribePresenceRef.current?.()
      removeAllListeners()
      disconnectSocket()
    }
  }, [currentUserId, currentUser, selectedRoom, user?.name]) // Added dependencies for reconnect logic

  // Load messages and set up Socket.io room listeners when room changes
  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id)
      
      // Leave previous room (this is handled by cleanup, comment for clarity)
      // The cleanup function will handle leaving the previous room
      
      // Join new room via Socket.io
      joinRoom(selectedRoom.id)
      
      // Unsubscribe from previous room
      unsubscribeMessagesRef.current?.()
      unsubscribeUpdatesRef.current?.()
      
      // Subscribe to Supabase (backup)
      unsubscribeMessagesRef.current = subscribeToMessages(selectedRoom.id, (newMessage) => {
        setMessages(prev => {
          // Avoid duplicates from Socket.io
          if (prev.some(msg => msg.id === newMessage.id)) return prev
          return [...prev, newMessage]
        })
        scrollToBottom()
      })
      
      unsubscribeUpdatesRef.current = subscribeToMessageUpdates(
        selectedRoom.id,
        (updatedMessage) => {
          setMessages(prev => prev.map(msg => 
            msg.id === updatedMessage.id ? updatedMessage : msg
          ))
        },
        (deletedId) => {
          setMessages(prev => prev.filter(msg => msg.id !== deletedId))
        }
      )
      
      // Socket.io listeners for this room
      onNewMessage((data) => {
        if (selectedRoom && data.roomId === selectedRoom.id) {
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(msg => msg.id === data.message.id)) return prev
            return [...prev, data.message]
          })
          scrollToBottom()
        }
      })
      
      onMessageUpdated((data) => {
        if (selectedRoom && data.roomId === selectedRoom.id) {
          setMessages(prev => prev.map(msg => 
            msg.id === data.messageId 
              ? { ...msg, content: data.content, updated_at: data.updatedAt }
              : msg
          ))
        }
      })
      
      onMessageDeleted((data) => {
        if (selectedRoom && data.roomId === selectedRoom.id) {
          setMessages(prev => prev.filter(msg => msg.id !== data.messageId))
        }
      })
      
      onMessageReaction((data) => {
        if (selectedRoom && data.roomId === selectedRoom.id) {
          setMessages(prev => prev.map(msg => {
            if (msg.id === data.messageId) {
              const reactions = msg.reactions || {}
              reactions[data.reaction] = [...(reactions[data.reaction] || []), data.userId]
              return { ...msg, reactions }
            }
            return msg
          }))
        }
      })
      
      onUserTyping((data) => {
        if (selectedRoom && data.roomId === selectedRoom.id && data.userId !== currentUserId) {
          setTypingUsers(prev => new Set(prev).add(data.userId))
        }
      })
      
      onUserStoppedTyping((data) => {
        if (selectedRoom && data.roomId === selectedRoom.id) {
          setTypingUsers(prev => {
            const updated = new Set(prev)
            updated.delete(data.userId)
            return updated
          })
        }
      })
    }
    
    return () => {
      if (selectedRoom) {
        leaveRoom(selectedRoom.id)
      }
      unsubscribeMessagesRef.current?.()
      unsubscribeUpdatesRef.current?.()
      setTypingUsers(new Set())
    }
  }, [selectedRoom])

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  async function loadRooms() {
    try {
      setIsLoadingRooms(true)
      const userRooms = await getChatRooms(currentUserId)
      setRooms(userRooms || [])
    } catch (error) {
      console.error("Failed to load rooms:", error)
      setRooms([]) // Ensure rooms is always an array
    } finally {
      setIsLoadingRooms(false)
    }
  }

  async function loadMessages(roomId: string) {
    try {
      setIsLoadingMessages(true)
      const roomMessages = await getMessages(roomId, 100)
      setMessages(roomMessages || [])
    } catch (error) {
      console.error("Failed to load messages:", error)
      setMessages([]) // Ensure messages is always an array
    } finally {
      setIsLoadingMessages(false)
    }
  }

  async function loadOnlineUsers() {
    try {
      const users = await getAllUsersPresence()
      setOnlineUsers(users || [])
    } catch (error) {
      console.error("Failed to load online users:", error)
      setOnlineUsers([]) // Ensure onlineUsers is always an array
    }
  }

  async function handleSendMessage() {
    if (!selectedRoom || !messageInput.trim()) return

    try {
      // Save to Supabase
      const newMessage = await sendSupabaseMessage({
        room_id: selectedRoom.id,
        user_id: currentUserId,
        content: messageInput,
        mentions: [],
        reactions: {}
      })

      // Broadcast via Socket.io for instant delivery
      sendSocketMessage(selectedRoom.id, newMessage)

      setMessageInput("")
      
      // Stop typing indicator
      stopTyping(selectedRoom.id, currentUserId)
      
      await loadRooms() // Refresh to update last message
    } catch (error) {
      console.error("Failed to send message:", error)
      alert("Failed to send message")
    }
  }

  async function handleCreateRoom(name: string, members: string[], type: 'direct' | 'group') {
    try {
      const room = await createChatRoom({
        name,
        type,
        created_by: currentUserId,
        description: type === 'group' ? `Group chat: ${name}` : undefined
      })

      // Add creator as member
      await addRoomMember(room.id, currentUserId)
      
      // Add other members
      for (const memberEmail of members) {
        await addRoomMember(room.id, memberEmail)
      }

      await loadRooms()
      setSelectedRoom(room)
      setShowNewChatModal(false)
    } catch (error) {
      console.error("Failed to create room:", error)
      alert("Failed to create chat room")
    }
  }

  async function handleStartDirectChat(userEmail: string) {
    try {
      const room = await getOrCreateDirectChat(currentUserId, userEmail)
      await loadRooms()
      setSelectedRoom(room)
      setShowCollaborators(false)
    } catch (error) {
      console.error("Failed to start direct chat:", error)
      alert("Failed to start chat")
    }
  }

  function handleStartEdit(messageId: string, content: string) {
    setEditingMessageId(messageId)
    setEditContent(content)
  }

  function handleCancelEdit() {
    setEditingMessageId(null)
    setEditContent("")
  }

  async function handleSaveEdit(messageId: string) {
    if (!editContent.trim() || !selectedRoom) return

    try {
      await updateMessage(messageId, editContent)
      
      // Broadcast via Socket.io
      editSocketMessage(selectedRoom.id, messageId, editContent)
      
      setEditingMessageId(null)
      setEditContent("")
    } catch (error) {
      console.error("Failed to update message:", error)
      alert("Failed to update message")
    }
  }

  async function handleDeleteMessage(messageId: string) {
    if (!confirm("Are you sure you want to delete this message?")) return
    if (!selectedRoom) return

    try {
      await deleteMessage(messageId)
      
      // Broadcast via Socket.io
      deleteSocketMessage(selectedRoom.id, messageId)
    } catch (error) {
      console.error("Failed to delete message:", error)
      alert("Failed to delete message")
    }
  }

  function handleTyping() {
    if (!selectedRoom) return
    
    // Start typing indicator
    startTyping(selectedRoom.id, currentUserId, currentUser, user?.name)
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    // Stop typing after 3 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(selectedRoom.id, currentUserId)
    }, 3000)
  }

  async function handleReaction(messageId: string, emoji: string) {
    if (!selectedRoom) return
    
    try {
      await addReaction(messageId, emoji, currentUserId)
      
      // Broadcast via Socket.io
      addSocketReaction(selectedRoom.id, messageId, emoji, currentUserId)
    } catch (error) {
      console.error("Failed to add reaction:", error)
    }
  }

  function formatTime(timestamp: string): string {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 86400000) { // Less than 24 hours
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString()
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-4">
      {/* Room List */}
      <div className="w-80 border border-border bg-card p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{t.chat.title}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCollaborators(!showCollaborators)}
              className="px-2 py-1 bg-secondary text-secondary-foreground text-xs hover:bg-secondary/80"
              title="Show Collaborators"
            >
              👥
            </button>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="px-3 py-1 bg-primary text-primary-foreground text-sm hover:bg-primary/90"
            >
              {t.chat.newChat}
            </button>
          </div>
        </div>
        
        {/* Connection Status Indicator */}
        {!isSocketConnected && (
          <div className="bg-destructive/10 text-destructive text-xs p-2 mb-2 rounded border border-destructive/20 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            Disconnected - Reconnecting...
          </div>
        )}

        <div className="space-y-2">
          {isLoadingRooms ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              Loading rooms...
            </div>
          ) : rooms.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t.chat.noMessages}
            </p>
          ) : (
            rooms.map((room) => {
              const isDirectChat = room.type === 'direct'
              const roomName = isDirectChat 
                ? room.name || 'Direct Chat'
                : room.name
              
              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full text-left p-3 border border-border hover:bg-muted transition-colors ${
                    selectedRoom?.id === room.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">
                          {isDirectChat ? '💬' : '👥'}
                        </span>
                        <h3 className="font-medium truncate">{roomName}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {isDirectChat ? 'Individual' : 'Group'} • {room.members?.length || 0} members
                      </p>
                      {room.last_message && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {room.last_message.content}
                        </p>
                      )}
                    </div>
                  </div>
                  {room.last_message && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatTime(room.last_message.created_at)}
                    </div>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Collaborators Sidebar */}
      {showCollaborators && (
        <div className="w-64 border border-border bg-card p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Collaborators</h3>
            <button
              onClick={() => setShowCollaborators(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2">
            {onlineUsers
              .filter(u => u.user_id !== currentUserId)
              .map((userPresence) => {
                const isOnline = userPresence.status === 'online'
                return (
                  <button
                    key={userPresence.user_id}
                    onClick={() => handleStartDirectChat(userPresence.user_id)}
                    className="w-full text-left p-2 border border-border hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {userPresence.name || userPresence.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </button>
                )
              })}
            
            {onlineUsers.filter(u => u.user_id !== currentUserId).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No collaborators found
              </p>
            )}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 border border-border bg-card flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">
                  {selectedRoom.type === 'direct' ? '💬' : '👥'}
                </span>
                <h2 className="text-lg font-bold">{selectedRoom.name}</h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  {selectedRoom.type === 'direct' ? 'Individual Chat' : 'Group Chat'}
                </span>
                <span>•</span>
                <span>{selectedRoom.members?.length || 0} {t.chat.members}</span>
                {selectedRoom.type === 'direct' && selectedRoom.members && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {(() => {
                        const otherMember = selectedRoom.members.find(m => m.user_id !== currentUserId)
                        if (!otherMember) return 'Unknown'
                        const presence = onlineUsers.find(p => p.user_id === otherMember.user_id)
                        const isOnline = presence?.status === 'online'
                        return (
                          <>
                            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                            {isOnline ? 'Online' : 'Offline'}
                          </>
                        )
                      })()}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoadingMessages ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.user_id === currentUserId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] ${
                      msg.user_id === currentUserId
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    } p-3 rounded`}
                  >
                    {msg.user_id !== currentUserId && (
                      <p className="text-xs font-medium mb-1">
                        {selectedRoom.members?.find(m => m.user_id === msg.user_id)?.user_name || msg.user_id}
                      </p>
                    )}
                    
                    {/* Edit mode */}
                    {editingMessageId === msg.id ? (
                      <div className="space-y-2">
                        <label htmlFor={`edit-${msg.id}`} className="sr-only">Edit message</label>
                        <textarea
                          id={`edit-${msg.id}`}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full text-sm bg-background text-foreground p-2 rounded border border-border"
                          rows={3}
                          placeholder="Edit your message..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(msg.id)}
                            className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded hover:bg-muted/80"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm break-words">{msg.content}</p>
                        
                        {/* Edit/Delete buttons for own messages */}
                        {msg.user_id === currentUserId && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleStartEdit(msg.id, msg.content)}
                              className="text-xs opacity-50 hover:opacity-100 transition-opacity"
                              title="Edit message"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="text-xs opacity-50 hover:opacity-100 transition-opacity"
                              title="Delete message"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                    
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <span className="text-xs opacity-70">
                        {formatTime(msg.created_at)}
                        {msg.updated_at && msg.updated_at !== msg.created_at && ` (edited)`}
                      </span>
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className="flex gap-1">
                          {Object.entries(msg.reactions).map(([emoji, userIds]) => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(msg.id, emoji)}
                              className="text-sm hover:scale-110 transition-transform px-1"
                              title={`${(userIds as string[]).length} reaction(s)`}
                            >
                              {emoji} {(userIds as string[]).length}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Quick reactions */}
                    {editingMessageId !== msg.id && (
                      <div className="flex gap-1 mt-2">
                        {['👍', '❤️', '😊', '🎉'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(msg.id, emoji)}
                            className="text-xs opacity-50 hover:opacity-100 transition-opacity"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )))}
              <div ref={messagesEndRef} />
              
              {/* Typing indicator */}
              {typingUsers.size > 0 && (
                <div className="px-4 py-2 text-sm text-muted-foreground italic">
                  {typingUsers.size === 1 
                    ? 'Someone is typing...' 
                    : `${typingUsers.size} people are typing...`}
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => {
                    setMessageInput(e.target.value)
                    handleTyping()
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder={t.chat.typeMessage}
                  className="flex-1 px-4 py-2 border border-input bg-background"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.chat.send}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">{t.chat.noMessages}</p>
              <p className="text-sm">Select a chat or start a new conversation</p>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Create New Chat</h3>
            
            {/* Chat Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Chat Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setChatType('direct')}
                  className={`flex-1 px-4 py-2 border ${
                    chatType === 'direct'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  💬 Individual
                </button>
                <button
                  onClick={() => setChatType('group')}
                  className={`flex-1 px-4 py-2 border ${
                    chatType === 'group'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  👥 Group
                </button>
              </div>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const roomName = formData.get("roomName") as string
                const membersInput = formData.get("members") as string
                const members = membersInput.split(",").map((m) => m.trim()).filter(m => m)
                
                if (chatType === 'direct' && members.length !== 1) {
                  alert("Individual chat requires exactly one member email")
                  return
                }
                
                handleCreateRoom(roomName, members, chatType)
              }}
            >
              <div className="space-y-4">
                {chatType === 'group' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Group Name</label>
                    <input
                      name="roomName"
                      type="text"
                      required
                      placeholder="Enter group name"
                      className="w-full px-4 py-2 border border-input bg-background"
                    />
                  </div>
                )}
                {chatType === 'direct' && (
                  <input
                    name="roomName"
                    type="hidden"
                    value="Direct Chat"
                  />
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {chatType === 'direct' ? 'Member Email' : 'Add Members'}
                  </label>
                  <input
                    name="members"
                    type="text"
                    required
                    placeholder={
                      chatType === 'direct'
                        ? "user@example.com"
                        : "email1@example.com, email2@example.com"
                    }
                    className="w-full px-4 py-2 border border-input bg-background"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {chatType === 'direct' ? 'Enter one email address' : 'Comma-separated emails'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Create Chat
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewChatModal(false)
                    setChatType('direct')
                  }}
                  className="flex-1 px-4 py-2 border border-border hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
