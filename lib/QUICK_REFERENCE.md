# Quick Reference Card - Lib Structure

## 📂 Where to Find Things

| What You Need | Import From |
|---------------|-------------|
| Authentication (login, logout, getCurrentUser) | `@/lib/features/auth` |
| Chat (rooms, messages, presence) | `@/lib/features/chat` |
| Whiteboard (drawing, collaboration) | `@/lib/features/whiteboard` |
| Staff Portal (email, security) | `@/lib/features/staff` |
| Team Management (roles, permissions) | `@/lib/features/team` |
| Project Management | `@/lib/services` |
| Database Connection | `@/lib/database` |
| Translations, Theme | `@/lib/config` |
| React Hooks | `@/lib/hooks` |
| Utilities (cn, helpers) | `@/lib/utils` |
| TypeScript Types | `@/lib/types` |

## 🎯 Common Tasks

### Get Current User
```typescript
import { getCurrentUser } from '@/lib/features/auth'
const user = getCurrentUser()
```

### Send a Chat Message
```typescript
import { sendMessage } from '@/lib/features/chat'
await sendMessage({ room_id, user_id, content })
```

### Create Database Client
```typescript
import { createClient } from '@/lib/database'
const supabase = createClient()
```

### Change Theme
```typescript
import { setTheme } from '@/lib/config'
setTheme('dark')
```

### Use Tailwind Classes
```typescript
import { cn } from '@/lib/utils'
const classes = cn('text-lg', 'font-bold')
```

## 📁 Directory Quick View

```
lib/
├── config/          → App configuration
├── database/        → DB connections
├── features/        → Business features
│   ├── auth/       → Login, logout, users
│   ├── chat/       → Messaging, presence
│   ├── staff/      → Staff portal
│   ├── team/       → Collaboration
│   └── whiteboard/ → Drawing
├── hooks/           → React hooks
├── services/        → Business logic
├── types/           → TypeScript types
└── utils/           → Helper functions
```

## 🔄 Import Cheat Sheet

```typescript
// OLD (Don't use)
import { getCurrentUser } from '@/lib/auth'
import { getChatRooms } from '@/lib/chat-supabase'

// NEW (Use this)
import { getCurrentUser } from '@/lib/features/auth'
import { getChatRooms } from '@/lib/features/chat'

// BEST (Recommended)
import { getCurrentUser, getChatRooms } from '@/lib'
```

## 🚀 File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Service | `*-service.ts` | `auth-service.ts` |
| Hook | `use*.ts` | `useAuth.ts` |
| Config | Descriptive | `theme.ts`, `i18n.ts` |
| Utils | Descriptive | `cn.ts`, `validators.ts` |
| Types | Singular | `user.ts`, `project.ts` |

## 📦 Module Structure

Every feature follows this pattern:
```
features/[feature]/
├── [feature]-service.ts    # Main business logic
├── [feature]-local.ts      # Legacy (if exists)
├── index.ts                # Public exports
└── README.md              # Documentation (optional)
```

## 💡 Tips

1. **Always use index exports**
   ```typescript
   // Good
   import { login } from '@/lib/features/auth'
   
   // Avoid
   import { login } from '@/lib/features/auth/auth-service'
   ```

2. **Group related imports**
   ```typescript
   // Good
   import { 
     getCurrentUser, 
     login, 
     logout 
   } from '@/lib/features/auth'
   
   // Avoid multiple lines for same module
   ```

3. **Use type imports when possible**
   ```typescript
   import type { User, ChatRoom } from '@/lib/types'
   import { getCurrentUser } from '@/lib/features/auth'
   ```

## 🔍 Quick File Finder

| Looking for... | Check here |
|----------------|------------|
| User authentication | `features/auth/auth-service.ts` |
| Chat real-time | `features/chat/chat-service.ts` |
| Supabase client | `database/supabase-client.ts` |
| Translations | `config/i18n.ts` |
| Theme toggle | `config/theme.ts` |
| Project CRUD | `services/project-management.ts` |
| Team roles | `features/team/team-service.ts` |
| Type definitions | `types/*.ts` |

---

📖 **Full Documentation**: [lib/README.md](README.md)  
🔄 **Migration Guide**: [lib/RESTRUCTURE_GUIDE.md](RESTRUCTURE_GUIDE.md)
