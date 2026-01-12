"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, Send, User, Clock, CheckCircle2, XCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/features/auth"

interface SupportChat {
  chatId: string
  userId: string
  userEmail: string
  messages: Array<{
    id: string
    text: string
    sender: "user" | "staff"
    timestamp: Date
    staffName?: string
  }>
  status: "active" | "resolved" | "pending"
  lastActivity: string
}

export default function SupportDashboardPage() {
  const [chats, setChats] = useState<SupportChat[]>([])
  const [selectedChat, setSelectedChat] = useState<SupportChat | null>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [staffName, setStaffName] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get staff name from current user
    const user = getCurrentUser()
    if (user) {
      setStaffName(user.email || "Support Staff")
    }

    // Load support queue
    loadSupportQueue()

    // Poll for new messages every 3 seconds
    const interval = setInterval(() => {
      loadSupportQueue()
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedChat?.messages])

  const loadSupportQueue = () => {
    const queue = JSON.parse(localStorage.getItem("support_queue") || "[]")
    
    // Group messages by chatId
    const chatMap = new Map<string, SupportChat>()
    
    queue.forEach((item: any) => {
      if (!chatMap.has(item.chatId)) {
        // Load existing chat messages
        const savedMessages = localStorage.getItem(`chat_${item.chatId}`)
        const messages = savedMessages ? JSON.parse(savedMessages) : []
        
        chatMap.set(item.chatId, {
          chatId: item.chatId,
          userId: item.userId,
          userEmail: item.userEmail,
          messages: messages,
          status: "pending",
          lastActivity: item.timestamp
        })
      }
    })

    const chatList = Array.from(chatMap.values()).sort(
      (a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    )

    setChats(chatList)

    // Update selected chat if it exists
    if (selectedChat) {
      const updated = chatList.find(c => c.chatId === selectedChat.chatId)
      if (updated) {
        setSelectedChat(updated)
      }
    }
  }

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedChat) return

    const newMessage = {
      id: `msg_${Date.now()}`,
      text: replyMessage,
      sender: "staff" as const,
      timestamp: new Date(),
      staffName: staffName
    }

    // Update messages
    const updatedMessages = [...selectedChat.messages, newMessage]
    
    // Save to localStorage
    localStorage.setItem(`chat_${selectedChat.chatId}`, JSON.stringify(updatedMessages))
    localStorage.setItem(`staff_response_${selectedChat.chatId}`, JSON.stringify(newMessage))

    // Update state
    setSelectedChat({
      ...selectedChat,
      messages: updatedMessages
    })

    setReplyMessage("")
    loadSupportQueue()
  }

  const handleResolveChat = (chatId: string) => {
    // Remove from support queue
    const queue = JSON.parse(localStorage.getItem("support_queue") || "[]")
    const filtered = queue.filter((item: any) => item.chatId !== chatId)
    localStorage.setItem("support_queue", JSON.stringify(filtered))
    
    // Update status
    setChats(prev => prev.map(chat => 
      chat.chatId === chatId ? { ...chat, status: "resolved" } : chat
    ))
    
    if (selectedChat?.chatId === chatId) {
      setSelectedChat(null)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Live Support Dashboard</h1>
          <p className="text-muted-foreground">Manage customer support chats in real-time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Active Chats ({chats.length})
              </h2>
              
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {chats.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No active chats</p>
                  </div>
                ) : (
                  chats.map((chat) => (
                    <button
                      key={chat.chatId}
                      onClick={() => setSelectedChat(chat)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedChat?.chatId === chat.chatId
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card hover:bg-muted border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium text-sm">{chat.userEmail}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          chat.status === "pending" ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300" :
                          chat.status === "active" ? "bg-green-500/20 text-green-700 dark:text-green-300" :
                          "bg-gray-500/20 text-gray-700 dark:text-gray-300"
                        }`}>
                          {chat.status}
                        </span>
                      </div>
                      <p className="text-xs opacity-70 truncate">
                        {chat.messages[chat.messages.length - 1]?.text || "No messages"}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs opacity-60">
                        <Clock className="h-3 w-3" />
                        {new Date(chat.lastActivity).toLocaleString()}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            <Card className="p-0 h-[700px] flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {selectedChat.userEmail}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Chat ID: {selectedChat.chatId}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolveChat(selectedChat.chatId)}
                      className="gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Resolve
                    </Button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                    {selectedChat.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === "user"
                              ? "bg-card border border-border"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {message.sender === "staff" && message.staffName && (
                            <div className="flex items-center gap-2 mb-1 opacity-80">
                              <User className="h-3 w-3" />
                              <span className="text-xs font-medium">{message.staffName}</span>
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Reply Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendReply()}
                        placeholder="Type your reply..."
                        className="flex-1 px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
                      />
                      <Button
                        onClick={handleSendReply}
                        disabled={!replyMessage.trim()}
                        className="gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Send
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Select a chat to start</p>
                    <p className="text-sm">Choose a conversation from the list</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
