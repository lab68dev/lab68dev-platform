import { NextRequest } from 'next/server'
import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'

// Store the io instance globally
let io: SocketIOServer | null = null

export async function GET(req: NextRequest) {
  if (!io) {
    console.log('⚡ Initializing Socket.io server...')
    
    // Get the HTTP server from Next.js
    const httpServer = (global as any).httpServer as HTTPServer
    
    if (!httpServer) {
      // In App Router, we need to create the server differently
      return new Response('Socket.io setup required', { status: 500 })
    }

    io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_APP_URL 
          : 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    })

    // Store active users and their rooms
    const activeUsers = new Map<string, { userId: string; email: string; name?: string; rooms: Set<string> }>()

    io.on('connection', (socket) => {
      console.log('✓ Client connected:', socket.id)

      // User joins with their info
      socket.on('user:join', (userData: { userId: string; email: string; name?: string }) => {
        activeUsers.set(socket.id, {
          ...userData,
          rooms: new Set(),
        })
        
        // Broadcast user online status
        io?.emit('user:status', {
          userId: userData.userId,
          email: userData.email,
          name: userData.name,
          status: 'online',
        })
        
        console.log(`✓ User joined: ${userData.email}`)
      })

      // Join a chat room
      socket.on('room:join', (roomId: string) => {
        socket.join(roomId)
        const user = activeUsers.get(socket.id)
        if (user) {
          user.rooms.add(roomId)
          
          // Notify room members
          socket.to(roomId).emit('user:joined-room', {
            userId: user.userId,
            email: user.email,
            name: user.name,
            roomId,
          })
        }
        console.log(`✓ Socket ${socket.id} joined room: ${roomId}`)
      })

      // Leave a chat room
      socket.on('room:leave', (roomId: string) => {
        socket.leave(roomId)
        const user = activeUsers.get(socket.id)
        if (user) {
          user.rooms.delete(roomId)
          
          // Notify room members
          socket.to(roomId).emit('user:left-room', {
            userId: user.userId,
            email: user.email,
            name: user.name,
            roomId,
          })
        }
        console.log(`✓ Socket ${socket.id} left room: ${roomId}`)
      })

      // Send message to room
      socket.on('message:send', (data: {
        roomId: string
        message: any
      }) => {
        console.log(`📨 Message sent to room ${data.roomId}`)
        
        // Broadcast to all clients in the room (including sender for confirmation)
        io?.to(data.roomId).emit('message:new', {
          roomId: data.roomId,
          message: data.message,
        })
      })

      // Edit message
      socket.on('message:edit', (data: {
        roomId: string
        messageId: string
        content: string
        updatedAt: string
      }) => {
        io?.to(data.roomId).emit('message:updated', data)
      })

      // Delete message
      socket.on('message:delete', (data: {
        roomId: string
        messageId: string
      }) => {
        io?.to(data.roomId).emit('message:deleted', data)
      })

      // Add reaction
      socket.on('message:react', (data: {
        roomId: string
        messageId: string
        reaction: string
        userId: string
      }) => {
        io?.to(data.roomId).emit('message:reaction', data)
      })

      // Typing indicator
      socket.on('typing:start', (data: { roomId: string; userId: string; email: string; name?: string }) => {
        socket.to(data.roomId).emit('user:typing', data)
      })

      socket.on('typing:stop', (data: { roomId: string; userId: string }) => {
        socket.to(data.roomId).emit('user:stopped-typing', data)
      })

      // Disconnect
      socket.on('disconnect', () => {
        const user = activeUsers.get(socket.id)
        if (user) {
          // Notify all rooms user was in
          user.rooms.forEach(roomId => {
            socket.to(roomId).emit('user:left-room', {
              userId: user.userId,
              email: user.email,
              name: user.name,
              roomId,
            })
          })
          
          // Broadcast user offline status
          io?.emit('user:status', {
            userId: user.userId,
            email: user.email,
            name: user.name,
            status: 'offline',
          })
          
          activeUsers.delete(socket.id)
        }
        console.log('✗ Client disconnected:', socket.id)
      })
    })

    console.log('✅ Socket.io server initialized')
  }
  
  return new Response('Socket.io is running', { status: 200 })
}

export const dynamic = 'force-dynamic'
