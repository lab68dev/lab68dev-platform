/**
 * Staff Portal Feature Module
 * 
 * This module provides staff-specific functionality including:
 * - Staff portal initialization
 * - Enhanced security for staff accounts
 * 
 * Note: email-service is NOT exported here as it's server-only (uses nodemailer).
 * Import directly in API routes only: 
 * import { sendEmail } from '@/lib/features/staff/email-service'
 */

// DO NOT export email-service - it's server-only and will break client builds
// export * from './email-service'

export * from './initialization'
export * from './security-service'
