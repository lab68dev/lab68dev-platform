/**
 * Lab68 Platform - Library Index
 * 
 * Central export point for all library modules.
 * This provides a clean and organized API for importing functionality throughout the application.
 * 
 * @example
 * // Import from specific feature modules (RECOMMENDED)
 * import { getCurrentUser, login, logout } from '@/lib/features/auth'
 * import { getChatRooms, sendMessage } from '@/lib/features/chat'
 * 
 * // Import database utilities
 * import { createClient } from '@/lib/database'
 * 
 * // Import configuration
 * import { getTranslations, setTheme } from '@/lib/config'
 * 
 * // Import hooks
 * import { useAuth } from '@/lib/hooks'
 * 
 * // Import utilities
 * import { cn } from '@/lib/utils'
 */

// ============================================
// NOTE: To avoid conflicts during migration,
// import directly from the specific modules:
// - @/lib/features/auth
// - @/lib/features/chat  
// - @/lib/features/whiteboard
// - @/lib/features/team
// - @/lib/features/staff
// - @/lib/database
// - @/lib/services
// - @/lib/config
// - @/lib/hooks
// - @/lib/utils
//
// Once legacy files are removed, we can
// re-export everything from here.
// ============================================

