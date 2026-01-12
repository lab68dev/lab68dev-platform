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

// Server-only exports are NOT re-exported here to prevent client bundle issues
// Import directly when needed:
// import { createServerClient, createRouteHandlerClient } from '@/lib/database/supabase-server'
