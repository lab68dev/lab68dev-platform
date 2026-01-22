const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Create Socket.io server
  const io = new Server(httpServer, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: dev ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_APP_URL,
      methods: ['GET', 'POST'],
    },
  })

  // Initialize Supabase Admin Client for server-side operations
  const { createClient } = require('@supabase/supabase-js')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
  
  let supabase = null
  if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    console.log('✓ Supabase Admin Client initialized for Presence Sync')
  } else {
    console.warn('⚠ Missing Supabase Service Key - Presence Sync will be local only')
  }

  // Store active users and their rooms
  const activeUsers = new Map()

  io.on('connection', (socket) => {
    console.log('✓ Client connected:', socket.id)

    // User joins with their info
    socket.on('user:join', async (userData) => {
      activeUsers.set(socket.id, {
        ...userData,
        rooms: new Set(),
      })
      
      // Update DB Presence if Supabase is available
      if (supabase && userData.userId) {
        try {
          await supabase.from('user_presence').upsert({
            user_id: userData.userId,
            email: userData.email,
            name: userData.name,
            status: 'online',
            last_seen: new Date().toISOString()
          })
        } catch (err) {
          console.error('Error updating presence:', err)
        }
      }

      // Broadcast user online status
      io.emit('user:status', {
        userId: userData.userId,
        email: userData.email,
        name: userData.name,
        status: 'online',
      })
      
      console.log(`✓ User joined: ${userData.email}`)
    })

    // Join a chat room
    socket.on('room:join', (roomId) => {
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
    socket.on('room:leave', (roomId) => {
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
    socket.on('message:send', (data) => {
      // Broadcast to all clients in the room
      io.to(data.roomId).emit('message:new', {
        roomId: data.roomId,
        message: data.message,
      })
    })

    // Edit message
    socket.on('message:edit', (data) => {
      io.to(data.roomId).emit('message:updated', data)
    })

    // Delete message
    socket.on('message:delete', (data) => {
      io.to(data.roomId).emit('message:deleted', data)
    })

    // Add reaction
    socket.on('message:react', (data) => {
      io.to(data.roomId).emit('message:reaction', data)
    })

    // Typing indicator
    socket.on('typing:start', (data) => {
      socket.to(data.roomId).emit('user:typing', data)
    })

    socket.on('typing:stop', (data) => {
      socket.to(data.roomId).emit('user:stopped-typing', data)
    })

    // Disconnect
    socket.on('disconnect', async () => {
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
        
        // Update DB Presence if Supabase is available
        if (supabase && user.userId) {
          try {
            await supabase.from('user_presence').upsert({
              user_id: user.userId,
              email: user.email,
              name: user.name,
              status: 'offline',
              last_seen: new Date().toISOString()
            })
          } catch (err) {
            console.error('Error updating presence override:', err)
          }
        }

        // Broadcast user offline status
        io.emit('user:status', {
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

  httpServer.once('error', (err) => {
    console.error(err)
    process.exit(1)
  })

  httpServer.listen(port, () => {
    console.log(`\n✅ Server ready on http://${hostname}:${port}`)
    console.log(`✅ Socket.io ready on path: /api/socket\n`)
  })
})
