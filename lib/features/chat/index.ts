/**
 * Chat Feature Module
 * 
 * This module provides chat functionality including:
 * - Real-time messaging with Supabase
 * - Local chat storage (legacy)
 * - Online presence tracking
 * - Individual and group chat support
 */

// Export everything from chat service (recommended)
export * from './chat-service'

// Legacy local storage implementation
export * from './chat-local'
