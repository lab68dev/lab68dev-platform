"use client"

import { useState, useEffect, useRef } from "react"
import { getTranslations } from "@/lib/i18n"
import {
  getUserChatRooms,
  getRoomMessages,
  sendMessage,
  createChatRoom,
  setTyping,
  clearTyping,
  getRoomTypingUsers,
  addReaction,
  markRoomAsRead,
  getUnreadCount,
  parseMentions,
  type ChatRoom,
  type Message,
} from "@/lib/chat"

export default function ChatPage() {
  const t = getTranslations("en") // Default to English, make configurable if needed
  const [currentUser] = useState("user@example.com") // In real app, get from auth
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Load user's chat rooms
  useEffect(() => {
    loadRooms()
  }, [])

  // Load messages when room changes
  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id)
      markRoomAsRead(selectedRoom.id, currentUser)
    }
  }, [selectedRoom])

  // Poll for typing indicators
  useEffect(() => {
    if (!selectedRoom) return

    const interval = setInterval(() => {
      const typing = getRoomTypingUsers(selectedRoom.id, currentUser)
      setTypingUsers(typing)
    }, 1000)

    return () => clearInterval(interval)
  }, [selectedRoom, currentUser])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function loadRooms() {
    const userRooms = getUserChatRooms(currentUser)
    setRooms(userRooms)
  }

  function loadMessages(roomId: string) {
    const roomMessages = getRoomMessages(roomId, 100)
    setMessages(roomMessages.reverse()) // Show oldest first
  }

  function handleSendMessage() {
    if (!selectedRoom || !messageInput.trim()) return

    const mentions = parseMentions(messageInput)
    const newMessage = sendMessage(selectedRoom.id, currentUser, currentUser, messageInput, {
      mentions,
    })

    setMessages((prev) => [...prev, newMessage])
    setMessageInput("")
    clearTyping(selectedRoom.id, currentUser)
    loadRooms() // Refresh to update last message
  }

  function handleTyping() {
    if (!selectedRoom) return

    setTyping(selectedRoom.id, currentUser, currentUser)

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to clear typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      clearTyping(selectedRoom.id, currentUser)
    }, 3000)
  }

  function handleReaction(messageId: string, emoji: string) {
    addReaction(messageId, emoji, currentUser, currentUser)
    if (selectedRoom) {
      loadMessages(selectedRoom.id)
    }
  }

  function handleCreateRoom(name: string, members: string[]) {
    const room = createChatRoom("group", "group", currentUser, [currentUser, ...members])
    setRooms((prev) => [...prev, room])
    setSelectedRoom(room)
    setShowNewChatModal(false)
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
          <button
            onClick={() => setShowNewChatModal(true)}
            className="px-3 py-1 bg-primary text-primary-foreground text-sm hover:bg-primary/90"
          >
            {t.chat.newChat}
          </button>
        </div>

        <div className="space-y-2">
          {rooms.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t.chat.noMessages}
            </p>
          ) : (
            rooms.map((room) => {
              const unread = getUnreadCount(room.id, currentUser)
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
                      <h3 className="font-medium truncate">{room.name}</h3>
                      {room.lastMessage && (
                        <p className="text-sm text-muted-foreground truncate">
                          {room.lastMessage.content}
                        </p>
                      )}
                    </div>
                    {unread > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                        {unread}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {room.lastMessage && formatTime(room.lastMessage.createdAt)}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 border border-border bg-card flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-bold">{selectedRoom.name}</h2>
              <p className="text-sm text-muted-foreground">
                {selectedRoom.members.length} {t.chat.members}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.userId === currentUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] ${
                      msg.userId === currentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    } p-3 rounded`}
                  >
                    {msg.userId !== currentUser && (
                      <p className="text-xs font-medium mb-1">{msg.userName}</p>
                    )}
                    <p className="text-sm break-words">{msg.content}</p>
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <span className="text-xs opacity-70">
                        {formatTime(msg.createdAt)}
                        {msg.edited && ` ${t.chat.edited}`}
                      </span>
                      {msg.reactions.length > 0 && (
                        <div className="flex gap-1">
                          {msg.reactions.map((reaction, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleReaction(msg.id, reaction.emoji)}
                              className="text-sm hover:scale-110 transition-transform"
                              title={reaction.userName}
                            >
                              {reaction.emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Quick reactions */}
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
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />

              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="text-sm text-muted-foreground italic">
                  {typingUsers.join(", ")} {typingUsers.length === 1 ? t.chat.isTyping : t.chat.areTyping}
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
              <p className="text-xs text-muted-foreground mt-2">
                {t.comments.mentionSomeone}
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">{t.chat.noMessages}</p>
              <p className="text-sm">{t.chat.startConversation}</p>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">{t.chat.createRoom}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const roomName = formData.get("roomName") as string
                const members = (formData.get("members") as string).split(",").map((m) => m.trim())
                handleCreateRoom(roomName, members)
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.chat.roomName}</label>
                  <input
                    name="roomName"
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.chat.addMembers}</label>
                  <input
                    name="members"
                    type="text"
                    placeholder="email1@example.com, email2@example.com"
                    className="w-full px-4 py-2 border border-input bg-background"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Comma-separated emails</p>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {t.chat.createRoom}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  className="flex-1 px-4 py-2 border border-border hover:bg-muted"
                >
                  {t.chat.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
