import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const initSocket = () => {
  if (!socket) {
    socket = io({
      path: '/api/socket',
      addTrailingSlash: false,
    })

    socket.on('connect', () => {
      console.log('✓ Socket.io connected:', socket?.id)
    })

    socket.on('disconnect', () => {
      console.log('✗ Socket.io disconnected')
    })

    socket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error)
    })
  }
  
  return socket
}

export const getSocket = (): Socket | null => {
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Helper functions for chat operations
export const joinUserSocket = (userId: string, email: string, name?: string) => {
  const sock = initSocket()
  sock.emit('user:join', { userId, email, name })
}

export const joinRoom = (roomId: string) => {
  const sock = getSocket()
  if (sock) {
    sock.emit('room:join', roomId)
  }
}

export const leaveRoom = (roomId: string) => {
  const sock = getSocket()
  if (sock) {
    sock.emit('room:leave', roomId)
  }
}

export const sendMessage = (roomId: string, message: any) => {
  const sock = getSocket()
  if (sock) {
    sock.emit('message:send', { roomId, message })
  }
}

export const editMessage = (roomId: string, messageId: string, content: string) => {
  const sock = getSocket()
  if (sock) {
    sock.emit('message:edit', {
      roomId,
      messageId,
      content,
      updatedAt: new Date().toISOString(),
    })
  }
}

export const deleteMessage = (roomId: string, messageId: string) => {
  const sock = getSocket()
  if (sock) {
    sock.emit('message:delete', { roomId, messageId })
  }
}

export const addReaction = (roomId: string, messageId: string, reaction: string, userId: string) => {
  const sock = getSocket()
  if (sock) {
    sock.emit('message:react', { roomId, messageId, reaction, userId })
  }
}

export const startTyping = (roomId: string, userId: string, email: string, name?: string) => {
  const sock = getSocket()
  if (sock) {
    sock.emit('typing:start', { roomId, userId, email, name })
  }
}

export const stopTyping = (roomId: string, userId: string) => {
  const sock = getSocket()
  if (sock) {
    sock.emit('typing:stop', { roomId, userId })
  }
}

// Event listeners
export const onNewMessage = (callback: (data: { roomId: string; message: any }) => void) => {
  const sock = getSocket()
  if (sock) {
    sock.on('message:new', callback)
  }
}

export const onMessageUpdated = (callback: (data: { roomId: string; messageId: string; content: string; updatedAt: string }) => void) => {
  const sock = getSocket()
  if (sock) {
    sock.on('message:updated', callback)
  }
}

export const onMessageDeleted = (callback: (data: { roomId: string; messageId: string }) => void) => {
  const sock = getSocket()
  if (sock) {
    sock.on('message:deleted', callback)
  }
}

export const onMessageReaction = (callback: (data: { roomId: string; messageId: string; reaction: string; userId: string }) => void) => {
  const sock = getSocket()
  if (sock) {
    sock.on('message:reaction', callback)
  }
}

export const onUserTyping = (callback: (data: { roomId: string; userId: string; email: string; name?: string }) => void) => {
  const sock = getSocket()
  if (sock) {
    sock.on('user:typing', callback)
  }
}

export const onUserStoppedTyping = (callback: (data: { roomId: string; userId: string }) => void) => {
  const sock = getSocket()
  if (sock) {
    sock.on('user:stopped-typing', callback)
  }
}

export const onUserStatus = (callback: (data: { userId: string; email: string; name?: string; status: 'online' | 'offline' }) => void) => {
  const sock = getSocket()
  if (sock) {
    sock.on('user:status', callback)
  }
}

export const onUserJoinedRoom = (callback: (data: { userId: string; email: string; name?: string; roomId: string }) => void) => {
  const sock = getSocket()
  if (sock) {
    sock.on('user:joined-room', callback)
  }
}

export const onUserLeftRoom = (callback: (data: { userId: string; email: string; name?: string; roomId: string }) => void) => {
  const sock = getSocket()
  if (sock) {
    sock.on('user:left-room', callback)
  }
}

// Cleanup function to remove all listeners
export const removeAllListeners = () => {
  const sock = getSocket()
  if (sock) {
    sock.removeAllListeners()
  }
}
