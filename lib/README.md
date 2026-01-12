# Library Structure Documentation

This document describes the professional organization of the `lib` folder following enterprise-grade best practices.

## 📁 Directory Structure

```
lib/
├── config/                    # Application configuration
│   ├── i18n.ts               # Internationalization settings
│   ├── theme.ts              # Theme management
│   └── index.ts              # Config exports
│
├── database/                  # Database connections and utilities
│   ├── supabase-client.ts    # Client-side Supabase connection
│   ├── supabase-server.ts    # Server-side Supabase connection
│   ├── connection.ts         # Database connection utilities
│   └── index.ts              # Database exports
│
├── features/                  # Feature modules (domain-driven design)
│   ├── auth/                 # Authentication feature
│   │   ├── auth-service.ts   # Auth business logic
│   │   └── index.ts          # Auth exports
│   │
│   ├── chat/                 # Chat feature
│   │   ├── chat-service.ts   # Real-time chat with Supabase
│   │   ├── chat-local.ts     # Local storage (legacy)
│   │   └── index.ts          # Chat exports
│   │
│   ├── staff/                # Staff portal feature
│   │   ├── email-service.ts  # Staff email functionality
│   │   ├── initialization.ts # Staff portal setup
│   │   ├── security-service.ts # Enhanced security
│   │   └── index.ts          # Staff exports
│   │
│   ├── team/                 # Team management feature
│   │   ├── team-service.ts   # Team & collaboration
│   │   └── index.ts          # Team exports
│   │
│   └── whiteboard/           # Whiteboard feature
│       ├── whiteboard-service.ts # Real-time whiteboard
│       ├── whiteboard-local.ts   # Local storage (legacy)
│       └── index.ts          # Whiteboard exports
│
├── hooks/                     # React custom hooks
│   ├── useAuth.ts            # Authentication hook
│   └── index.ts              # Hooks exports
│
├── services/                  # Business services
│   ├── project-management.ts # Project management logic
│   └── index.ts              # Services exports
│
├── types/                     # TypeScript type definitions
│   └── (type definition files)
│
├── utils/                     # Utility functions
│   ├── cn.ts                 # Class name utility (tailwind)
│   └── index.ts              # Utils exports
│
└── index.ts                   # Main library export

Legacy files (to be deprecated):
├── auth.ts                    → features/auth/auth-service.ts
├── chat.ts                    → features/chat/chat-local.ts
├── chat-supabase.ts           → features/chat/chat-service.ts
├── database.ts                → database/connection.ts
├── i18n.ts                    → config/i18n.ts
├── project-management.ts      → services/project-management.ts
├── staff-email.ts             → features/staff/email-service.ts
├── staff-init.ts              → features/staff/initialization.ts
├── staff-security.ts          → features/staff/security-service.ts
├── supabase.ts                → database/supabase-client.ts
├── supabase-server.ts         → database/supabase-server.ts
├── team.ts                    → features/team/team-service.ts
├── theme.ts                   → config/theme.ts
├── useAuth.ts                 → hooks/useAuth.ts
├── utils.ts                   → utils/cn.ts
├── whiteboard.ts              → features/whiteboard/whiteboard-local.ts
└── whiteboard-supabase.ts     → features/whiteboard/whiteboard-service.ts
```

## 🎯 Design Principles

### 1. **Feature-Based Organization**
Files are grouped by feature domain (auth, chat, whiteboard, etc.) rather than by technical layer. This follows Domain-Driven Design (DDD) principles.

### 2. **Clear Separation of Concerns**
- **config/** - Application-wide configuration
- **database/** - All database-related utilities
- **features/** - Business logic organized by domain
- **hooks/** - React-specific custom hooks
- **services/** - Cross-cutting business services
- **utils/** - Pure utility functions

### 3. **Index Files for Clean Imports**
Each directory has an `index.ts` that exports its public API, enabling clean imports:

```typescript
// ❌ Before (scattered imports)
import { getCurrentUser } from '@/lib/auth'
import { getChatRooms } from '@/lib/chat-supabase'
import { setTheme } from '@/lib/theme'

// ✅ After (organized imports)
import { getCurrentUser } from '@/lib/features/auth'
import { getChatRooms } from '@/lib/features/chat'
import { setTheme } from '@/lib/config'
```

### 4. **Consistent Naming Conventions**
- **Services**: `*-service.ts` (e.g., `auth-service.ts`, `chat-service.ts`)
- **Hooks**: `use*.ts` (e.g., `useAuth.ts`)
- **Config**: Descriptive names (e.g., `i18n.ts`, `theme.ts`)
- **Local storage**: `*-local.ts` (for legacy implementations)

## 📖 Usage Guide

### Importing from Features

```typescript
// Authentication
import { getCurrentUser, login, logout } from '@/lib/features/auth'

// Chat
import { getChatRooms, sendMessage, subscribeToMessages } from '@/lib/features/chat'

// Whiteboard
import { createWhiteboard, drawElement } from '@/lib/features/whiteboard'

// Staff
import { sendWelcomeEmail, initializeStaff } from '@/lib/features/staff'

// Team
import { getUserRole, hasPermission } from '@/lib/features/team'
```

### Importing Database Utilities

```typescript
// Client-side
import { createClient } from '@/lib/database'

// Server-side
import { createServerClient } from '@/lib/database'
```

### Importing Configuration

```typescript
import { getTranslations, setTheme, getTheme } from '@/lib/config'
```

### Importing Hooks

```typescript
import { useAuth } from '@/lib/hooks'
```

### Importing Utilities

```typescript
import { cn } from '@/lib/utils'
```

### Importing Services

```typescript
import { getAllProjects, createProject } from '@/lib/services'
```

## 🔄 Migration Guide

### For Developers

To migrate from old imports to new organized structure:

#### Step 1: Update Import Statements

```typescript
// Old imports
import { getCurrentUser } from '@/lib/auth'
import { getChatRooms } from '@/lib/chat-supabase'
import { createClient } from '@/lib/supabase'

// New imports
import { getCurrentUser } from '@/lib/features/auth'
import { getChatRooms } from '@/lib/features/chat'
import { createClient } from '@/lib/database'
```

#### Step 2: Use Index Exports

The index files provide convenient re-exports, so you can import from the feature root:

```typescript
// Both work the same way
import { getCurrentUser } from '@/lib/features/auth/auth-service'
import { getCurrentUser } from '@/lib/features/auth' // Recommended
```

#### Step 3: Remove Legacy File Imports

Once all code is migrated, the root-level files can be removed:
- `lib/auth.ts` → Use `lib/features/auth`
- `lib/chat-supabase.ts` → Use `lib/features/chat`
- etc.

## 🏗️ Adding New Features

### Creating a New Feature Module

1. Create a new directory under `features/`:
   ```bash
   mkdir lib/features/notifications
   ```

2. Add your service file:
   ```typescript
   // lib/features/notifications/notification-service.ts
   export function sendNotification() { ... }
   export function getNotifications() { ... }
   ```

3. Create an index file:
   ```typescript
   // lib/features/notifications/index.ts
   export * from './notification-service'
   ```

4. Export from main lib index:
   ```typescript
   // lib/index.ts
   export * from './features/notifications'
   ```

## 📊 Benefits of This Structure

### ✅ Maintainability
- Easy to find related code
- Clear boundaries between features
- Reduced coupling

### ✅ Scalability
- Add new features without affecting existing code
- Feature modules can grow independently
- Easy to split into micro-services later

### ✅ Developer Experience
- Intuitive file organization
- Self-documenting structure
- IDE autocomplete works better

### ✅ Testing
- Easy to test features in isolation
- Mock dependencies cleanly
- Better test organization

### ✅ Code Review
- Changes are localized to specific features
- Easier to review PRs
- Clear impact analysis

## 🔐 Best Practices

### 1. Keep Features Independent
Each feature should be as independent as possible. Avoid circular dependencies.

### 2. Use Index Files Wisely
Only export public APIs in index files. Keep internal utilities private.

### 3. Document Complex Logic
Add JSDoc comments for complex functions and types.

### 4. Consistent File Naming
Follow the established naming conventions for consistency.

### 5. Type Safety
Define types alongside the code that uses them or in the `types/` directory.

## 🚀 Next Steps

1. **Gradual Migration**: Update imports gradually, one feature at a time
2. **Remove Legacy Files**: Once all imports are updated, remove old root-level files
3. **Add Tests**: Create test files alongside each service (e.g., `auth-service.test.ts`)
4. **Documentation**: Keep this README updated as the structure evolves
5. **Type Definitions**: Move shared types to `types/` directory

## 📚 References

- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Last Updated**: January 13, 2026  
**Maintained By**: Lab68 Development Team
