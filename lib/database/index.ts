/**
 * Database Connection Utilities
 * 
 * This module provides database connection utilities for Supabase.
 * 
 * IMPORTANT: Only client-safe exports here!
 * For server-side clients, import directly:
 * import { createServerClient } from '@/lib/database/supabase-server'
 */

// Client-safe Supabase client
export { createClient } from './supabase-client'

// Core database operations (client-safe)
export * from './connection'

// Feature-specific operations (re-exported for compatibility)
export * from '@/lib/features/projects'
export * from '@/lib/features/todos'
export * from '@/lib/features/wiki'
export * from '@/lib/features/meetings'
export * from '@/lib/features/files'

// Server-only exports are NOT re-exported here to prevent client bundle issues
// Import directly when needed:
// import { createServerClient, createRouteHandlerClient } from '@/lib/database/supabase-server'
