"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Minimize2, Maximize2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"

interface Message {
  id: string
  text: string
  sender: "user" | "staff"
  timestamp: Date
  staffName?: string
}

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatId = useRef<string>("")

  useEffect(() => {
    // Generate unique chat session ID
    if (!chatId.current) {
      chatId.current = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    // Load chat history from localStorage
    const savedMessages = localStorage.getItem(`chat_${chatId.current}`)
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    } else {
      // Welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        text: "Hello! Welcome to Lab68 Dev Platform support. How can we help you today?",
        sender: "staff",
        timestamp: new Date(),
        staffName: "Support Team"
      }
      setMessages([welcomeMessage])
    }

    // Listen for new messages from staff (simulated with localStorage for now)
    const interval = setInterval(() => {
      checkForNewMessages()
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Save messages to localStorage
    if (messages.length > 0) {
      localStorage.setItem(`chat_${chatId.current}`, JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const checkForNewMessages = () => {
    // Check for staff responses (in production, this would be WebSocket or API polling)
    const staffResponse = localStorage.getItem(`staff_response_${chatId.current}`)
    if (staffResponse) {
      const response = JSON.parse(staffResponse)
      setMessages(prev => [...prev, response])
      localStorage.removeItem(`staff_response_${chatId.current}`)
      
      if (!isOpen || isMinimized) {
        setUnreadCount(prev => prev + 1)
      }
    }
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const user = getCurrentUser()
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage("")

    // Save to support queue (in production, this would send to your backend)
    const chatData = {
      chatId: chatId.current,
      userId: user?.id || "guest",
      userEmail: user?.email || "guest",
      message: newMessage,
      timestamp: new Date().toISOString()
    }
    
    const supportQueue = JSON.parse(localStorage.getItem("support_queue") || "[]")
    supportQueue.push(chatData)
    localStorage.setItem("support_queue", JSON.stringify(supportQueue))

    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      
      // Auto-response for common queries
      const lowerMessage = inputMessage.toLowerCase()
      if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
        const autoReply: Message = {
          id: `msg_${Date.now()}_auto`,
          text: "Hi there! A support agent will be with you shortly. In the meantime, you can check our documentation or FAQ.",
          sender: "staff",
          timestamp: new Date(),
          staffName: "Auto-Reply"
        }
        setMessages(prev => [...prev, autoReply])
      }
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setUnreadCount(0)
      setIsMinimized(false)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
    if (isMinimized) {
      setUnreadCount(0)
    }
  }

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div 
          className={`fixed bottom-20 right-4 sm:right-6 w-full sm:w-96 bg-background border-2 border-border shadow-2xl z-50 transition-all duration-300 ${
            isMinimized ? "h-14" : "h-[500px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Live Support</h3>
                <p className="text-xs opacity-90">We're here to help 24/7</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleMinimize}
                className="hover:bg-primary-foreground/20 p-1 rounded transition-colors"
                aria-label={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={toggleChat}
                className="hover:bg-primary-foreground/20 p-1 rounded transition-colors"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[360px] bg-muted/20">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border"
                      }`}
                    >
                      {message.sender === "staff" && message.staffName && (
                        <div className="flex items-center gap-2 mb-1">
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
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border rounded-lg p-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-background">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    size="sm"
                    className="px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 sm:right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform z-50 flex items-center justify-center"
        aria-label="Open live chat"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>
    </>
  )
}
