# Library Restructuring - Complete Guide

## 🎯 Overview

The `lib` folder has been reorganized from a flat structure to a professional, enterprise-grade organization following industry best practices and Domain-Driven Design (DDD) principles.

## 📊 Before vs After

### Before (Flat Structure)
```
lib/
├── auth.ts
├── chat.ts
├── chat-supabase.ts
├── database.ts
├── i18n.ts
├── project-management.ts
├── staff-email.ts
├── staff-init.ts
├── staff-security.ts
├── supabase.ts
├── supabase-server.ts
├── team.ts
├── theme.ts
├── useAuth.ts
├── utils.ts
├── whiteboard.ts
└── whiteboard-supabase.ts

❌ Problems:
- Hard to find related files
- No clear organization
- Difficult to scale
- Poor discoverability
```

### After (Professional Structure)
```
lib/
├── 📁 config/                    # Application configuration
│   ├── i18n.ts                   # Internationalization
│   ├── theme.ts                  # Theme management
│   └── index.ts                  # Clean exports
│
├── 📁 database/                  # Database layer
│   ├── supabase-client.ts        # Client connection
│   ├── supabase-server.ts        # Server connection
│   ├── connection.ts             # Utilities
│   └── index.ts
│
├── 📁 features/                  # Business features (DDD)
│   ├── 📁 auth/                  # Authentication
│   │   ├── auth-service.ts
│   │   └── index.ts
│   │
│   ├── 📁 chat/                  # Real-time chat
│   │   ├── chat-service.ts       # Supabase implementation
│   │   ├── chat-local.ts         # Legacy local storage
│   │   └── index.ts
│   │
│   ├── 📁 staff/                 # Staff portal
│   │   ├── email-service.ts
│   │   ├── initialization.ts
│   │   ├── security-service.ts
│   │   └── index.ts
│   │
│   ├── 📁 team/                  # Team management
│   │   ├── team-service.ts
│   │   └── index.ts
│   │
│   └── 📁 whiteboard/            # Collaborative whiteboard
│       ├── whiteboard-service.ts
│       ├── whiteboard-local.ts
│       └── index.ts
│
├── 📁 hooks/                     # React hooks
│   ├── useAuth.ts
│   └── index.ts
│
├── 📁 services/                  # Business services
│   ├── project-management.ts
│   └── index.ts
│
├── 📁 types/                     # TypeScript types
│   ├── common.ts
│   ├── chat.ts
│   ├── team.ts
│   ├── project.ts
│   └── index.ts
│
├── 📁 utils/                     # Utilities
│   ├── cn.ts
│   └── index.ts
│
├── index.ts                      # Main export
├── README.md                     # Documentation
└── migrate-imports.js            # Migration tool

✅ Benefits:
- Clear feature boundaries
- Easy to navigate
- Scalable architecture
- Self-documenting
- Industry standard
```

## 🏗️ Architecture Patterns

### 1. Feature-Sliced Design
Each feature is a self-contained module with clear boundaries:

```
features/chat/
├── chat-service.ts       # Business logic
├── index.ts              # Public API
└── (future: tests/)      # Co-located tests
```

### 2. Layered Architecture

```
┌─────────────────────────────────────┐
│         Application Layer           │
│    (Components, Pages, Routes)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Features Layer              │
│  (auth, chat, whiteboard, team)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Services Layer              │
│   (project-management, etc.)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Database Layer              │
│     (Supabase connections)          │
└─────────────────────────────────────┘
```

### 3. Barrel Exports (Index Files)

Each module exports its public API through `index.ts`:

```typescript
// lib/features/chat/index.ts
export * from './chat-service'  // All public functions
export * from './chat-local'    // Legacy support

// Usage in components
import { getChatRooms, sendMessage } from '@/lib/features/chat'
```

## 📝 Import Patterns

### Old Pattern (Deprecated)
```typescript
import { getCurrentUser } from '@/lib/auth'
import { getChatRooms } from '@/lib/chat-supabase'
import { createClient } from '@/lib/supabase'
import { setTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'
```

### New Pattern (Recommended)
```typescript
import { getCurrentUser } from '@/lib/features/auth'
import { getChatRooms } from '@/lib/features/chat'
import { createClient } from '@/lib/database'
import { setTheme } from '@/lib/config'
import { cn } from '@/lib/utils'
```

### Best Pattern (Using main index)
```typescript
// Import everything from lib root
import {
  getCurrentUser,    // from features/auth
  getChatRooms,      // from features/chat
  createClient,      // from database
  setTheme,          // from config
  cn                 // from utils
} from '@/lib'
```

## 🚀 Migration Steps

### Automated Migration (Recommended)

1. **Preview changes:**
   ```bash
   node lib/migrate-imports.js --dry-run
   ```

2. **Apply changes:**
   ```bash
   node lib/migrate-imports.js --apply
   ```

### Manual Migration

1. **Update imports one file at a time:**
   ```typescript
   // Before
   import { getCurrentUser } from '@/lib/auth'
   
   // After
   import { getCurrentUser } from '@/lib/features/auth'
   ```

2. **Test the changes:**
   ```bash
   npm run build
   npm run test
   ```

3. **Remove old files after migration:**
   ```bash
   # Only after ALL imports are updated
   rm lib/auth.ts
   rm lib/chat.ts
   # etc...
   ```

## 📚 Feature Modules

### Auth Module
```typescript
// lib/features/auth/index.ts
export {
  getCurrentUser,
  login,
  logout,
  signup,
  updateUserProfile
} from './auth-service'

// Usage
import { getCurrentUser, login } from '@/lib/features/auth'
```

### Chat Module
```typescript
// lib/features/chat/index.ts
export {
  getChatRooms,
  sendMessage,
  subscribeToMessages,
  updateUserPresence
} from './chat-service'

// Usage
import { getChatRooms, sendMessage } from '@/lib/features/chat'
```

### Team Module
```typescript
// lib/features/team/index.ts
export {
  getUserRole,
  hasPermission,
  addTeamMember,
  logActivity
} from './team-service'

// Usage
import { getUserRole, hasPermission } from '@/lib/features/team'
```

## 🎨 Code Examples

### Before: Scattered Imports
```typescript
// ❌ Old way - imports from many places
import { getCurrentUser } from '@/lib/auth'
import { getChatRooms } from '@/lib/chat-supabase'
import { createWhiteboard } from '@/lib/whiteboard-supabase'
import { getAllProjects } from '@/lib/project-management'
import { setTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

function MyComponent() {
  const user = getCurrentUser()
  const rooms = getChatRooms(user.id)
  // ...
}
```

### After: Organized Imports
```typescript
// ✅ New way - clear feature imports
import { getCurrentUser } from '@/lib/features/auth'
import { getChatRooms } from '@/lib/features/chat'
import { createWhiteboard } from '@/lib/features/whiteboard'
import { getAllProjects } from '@/lib/services'
import { setTheme } from '@/lib/config'
import { cn } from '@/lib/utils'

function MyComponent() {
  const user = getCurrentUser()
  const rooms = getChatRooms(user.id)
  // ...
}
```

### Best: Single Import Source
```typescript
// ⭐ Best way - import from lib root
import {
  // Auth
  getCurrentUser,
  
  // Chat
  getChatRooms,
  sendMessage,
  
  // Whiteboard
  createWhiteboard,
  
  // Services
  getAllProjects,
  
  // Config
  setTheme,
  
  // Utils
  cn
} from '@/lib'

function MyComponent() {
  const user = getCurrentUser()
  const rooms = getChatRooms(user.id)
  // ...
}
```

## 🧪 Testing Strategy

### Co-located Tests (Future)
```
lib/features/auth/
├── auth-service.ts
├── auth-service.test.ts      # Unit tests
├── auth-service.spec.ts      # Integration tests
└── index.ts
```

### Test Imports
```typescript
// Easy to test with new structure
import { getCurrentUser, login } from '@/lib/features/auth'

describe('Auth Service', () => {
  test('getCurrentUser returns user', () => {
    // Test implementation
  })
})
```

## 📦 Future Enhancements

### 1. Add Constants
```
lib/constants/
├── api-endpoints.ts
├── error-codes.ts
└── index.ts
```

### 2. Add Validators
```
lib/validators/
├── user-validator.ts
├── project-validator.ts
└── index.ts
```

### 3. Add Middleware
```
lib/middleware/
├── auth-middleware.ts
├── error-handler.ts
└── index.ts
```

## 🔒 Security Considerations

### Environment Separation
```
lib/database/
├── supabase-client.ts    # Client-side (browser)
├── supabase-server.ts    # Server-side (Node)
└── index.ts              # Exports both
```

### Usage
```typescript
// Client components
import { createClient } from '@/lib/database'

// Server components / API routes
import { createServerClient } from '@/lib/database'
```

## 📖 Documentation Standards

Each module should have:

1. **JSDoc comments** on exported functions
2. **README** for complex modules
3. **Type definitions** in types/
4. **Usage examples** in comments

Example:
```typescript
/**
 * Retrieves all chat rooms for a user
 * 
 * @param userId - The ID of the user
 * @returns Promise<ChatRoom[]> Array of chat rooms
 * 
 * @example
 * ```typescript
 * const rooms = await getChatRooms('user-123')
 * console.log(rooms[0].name) // "Team Chat"
 * ```
 */
export async function getChatRooms(userId: string): Promise<ChatRoom[]> {
  // Implementation
}
```

## ✅ Checklist

- [x] Create new directory structure
- [x] Move files to appropriate locations
- [x] Create index files for each module
- [x] Update import paths in moved files
- [x] Create main lib/index.ts
- [x] Add README documentation
- [x] Create migration script
- [x] Add TypeScript type definitions
- [ ] Update all component imports (gradual)
- [ ] Add unit tests
- [ ] Remove legacy files
- [ ] Update CI/CD scripts

## 🎯 Success Metrics

After migration:
- ✅ Faster file discovery
- ✅ Clear feature boundaries
- ✅ Easier onboarding for new developers
- ✅ Better IDE autocomplete
- ✅ Improved code maintainability
- ✅ Scalable architecture

---

**Need Help?** See [lib/README.md](README.md) for detailed documentation.
