# Supabase Migration Guide

## Overview

This guide explains the migration from localStorage to Supabase for all Lab68 Dev Platform features.

## What's Changed

### ✅ Completed Infrastructure

1. **Database Schema** (`supabase-schema.sql`)
   - 17 tables covering all features
   - Row Level Security (RLS) policies
   - Automatic triggers for timestamps
   - Indexes for performance

2. **Database Utilities** (`lib/database.ts`)
   - Projects & Tasks (Kanban)
   - Files
   - Whiteboards
   - Todos
   - Wiki Articles
   - Meetings & Milestones
   - Discussions
   - Diagrams

3. **Chat System** (`lib/chat-supabase.ts`)
   - Chat rooms & members
   - Real-time messaging
   - Comments system
   - Reactions support
   - Realtime subscriptions

4. **Whiteboard** (`lib/whiteboard-supabase.ts`)
   - Drawing operations
   - Collaborator management
   - Real-time updates
   - Export functions

## Database Tables

### User & Auth

- **profiles** - User profiles with bio, avatar, settings

### Project Management

- **projects** - Project metadata
- **project_collaborators** - Team members and roles
- **tasks** - Kanban board tasks

### Content & Files

- **files** - File metadata and URLs
- **diagrams** - Diagram data
- **wiki_articles** - Knowledge base articles

### Collaboration

- **whiteboards** - Drawing canvas data
- **whiteboard_collaborators** - Shared access
- **chat_rooms** - Group and direct messaging
- **chat_room_members** - Room participants
- **messages** - Chat messages
- **comments** - Contextual comments on any resource

### Planning

- **meetings** - Meeting schedules
- **milestones** - Project milestones
- **todos** - Personal task list

### Community

- **discussions** - Community forum threads

## Step-by-Step Migration

### Step 1: Run Database Schema

1. Open Supabase dashboard
2. Go to **SQL Editor**
3. Copy entire contents of `supabase-schema.sql`
4. Click **Run**
5. Verify tables created: **Database** → **Tables**

You should see 17+ tables created.

### Step 2: Enable Realtime (Optional)

For real-time chat and whiteboard collaboration:

1. Go to **Database** → **Replication**
2. Enable replication for these tables:
   - `messages`
   - `comments`
   - `whiteboards`

### Step 3: Update Environment Variables

Your `.env.local` should already have:

```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### Step 4: Test Database Connection

```bash
pnpm dev
```

Try creating a new account to verify the `profiles` table trigger works.

## Migration Status by Feature

### ✅ Ready to Migrate

The following have Supabase implementations ready:

| Feature | Old Location | New Library | Status |
|---------|-------------|-------------|--------|
| **Projects** | localStorage | `lib/database.ts` | ✅ Functions ready |
| **Kanban Tasks** | localStorage | `lib/database.ts` | ✅ Functions ready |
| **Files** | localStorage | `lib/database.ts` | ✅ Functions ready |
| **Whiteboards** | `lib/whiteboard.ts` | `lib/whiteboard-supabase.ts` | ✅ With realtime |
| **Chat** | `lib/chat.ts` | `lib/chat-supabase.ts` | ✅ With realtime |
| **Comments** | `lib/chat.ts` | `lib/chat-supabase.ts` | ✅ With realtime |
| **Wiki** | localStorage | `lib/database.ts` | ✅ Functions ready |
| **Meetings** | localStorage | `lib/database.ts` | ✅ Functions ready |
| **Planning** | localStorage | `lib/database.ts` | ✅ Functions ready |
| **Todos** | localStorage | `lib/database.ts` | ✅ Functions ready |
| **Discussions** | localStorage | `lib/database.ts` | ✅ Functions ready |
| **Diagrams** | localStorage | `lib/database.ts` | ✅ Functions ready |

### 🔄 Next Steps: Update UI Components

Each dashboard page needs to be updated to use the new Supabase functions.

#### Example: Projects Page

**Before (localStorage):**

```typescript
const projects = JSON.parse(localStorage.getItem('lab68_projects') || '[]')
```

**After (Supabase):**

```typescript
import { getProjects } from '@/lib/database'

const [projects, setProjects] = useState([])

useEffect(() => {
  async function loadProjects() {
    const user = getCurrentUser()
    if (user) {
      const data = await getProjects(user.id)
      setProjects(data)
    }
  }
  loadProjects()
}, [])
```

#### Example: Chat with Realtime

```typescript
import { getMessages, subscribeToMessages, sendMessage } from '@/lib/chat-supabase'

useEffect(() => {
  // Load initial messages
  async function loadMessages() {
    const data = await getMessages(roomId)
    setMessages(data)
  }
  loadMessages()

  // Subscribe to new messages
  const unsubscribe = subscribeToMessages(roomId, (newMessage) => {
    setMessages(prev => [...prev, newMessage])
  })

  return () => unsubscribe()
}, [roomId])
```

## API Reference

### Database Operations

All functions in `lib/database.ts` follow this pattern:

```typescript
// Create
await createProject({ user_id, title, description, ... })

// Read
await getProjects(userId)

// Update
await updateProject(id, { title: 'New Title' })

// Delete
await deleteProject(id)
```

### Chat Operations

```typescript
// Create room
await createChatRoom({ name, type: 'group', created_by })

// Send message
await sendMessage({ room_id, user_id, content })

// Subscribe to messages
const unsubscribe = subscribeToMessages(roomId, callback)
```

### Whiteboard Operations

```typescript
// Create whiteboard
await createWhiteboard(userId, title)

// Update drawing elements
await updateElements(whiteboardId, elements)

// Subscribe to changes
const unsubscribe = subscribeToWhiteboard(whiteboardId, callback)
```

## Error Handling

All Supabase functions throw errors. Wrap in try-catch:

```typescript
try {
  const projects = await getProjects(userId)
  setProjects(projects)
} catch (error) {
  console.error('Failed to load projects:', error)
  setError('Failed to load projects')
}
```

## Performance Considerations

### Indexes

All tables have indexes on frequently queried columns:

- `user_id` for user-owned resources
- `project_id` for project-related data
- `room_id` for messages
- `created_at` for time-based sorting

### Pagination

For large datasets, use limit and offset:

```typescript
const { data } = await supabase
  .from('messages')
  .select('*')
  .eq('room_id', roomId)
  .order('created_at', { ascending: false })
  .range(0, 49) // First 50 messages
```

### Realtime Limits

Supabase free tier has limits on realtime connections:

- Max 200 concurrent connections
- Max 2 million realtime messages/month

For production, consider:

- Polling for non-critical updates
- Connection pooling
- Upgrading Supabase plan

## Data Migration Tool

To migrate existing localStorage data to Supabase, run:

```typescript
// Coming soon: Migration utility
import { migrateLocalStorageToSupabase } from '@/lib/migrate'

await migrateLocalStorageToSupabase()
```

This will:

1. Read all localStorage data
2. Transform to Supabase format
3. Bulk insert into tables
4. Clear localStorage after confirmation

## Testing

Test each feature:

1. ✅ Create new item
2. ✅ View list of items
3. ✅ Edit existing item
4. ✅ Delete item
5. ✅ Search/filter (if applicable)
6. ✅ Real-time updates (chat/whiteboard)

## Rollback Plan

If issues occur, you can temporarily revert:

1. Keep old localStorage code commented out
2. Switch imports back to old libraries
3. Fix issues, then re-migrate

## Benefits of Supabase

### Before (localStorage)

- ❌ Data lost on browser clear
- ❌ No sync across devices
- ❌ No collaboration
- ❌ Limited to ~5-10MB
- ❌ No server-side validation

### After (Supabase)

- ✅ Persistent cloud storage
- ✅ Sync across devices
- ✅ Real-time collaboration
- ✅ Unlimited storage
- ✅ Row Level Security
- ✅ Built-in backup/restore
- ✅ SQL queries and analytics

## Common Issues

### "relation does not exist"

- Run `supabase-schema.sql` in SQL Editor

### "permission denied for table"

- Check RLS policies
- Ensure user is authenticated
- Verify `auth.uid()` matches `user_id`

### "Cannot read properties of null"

- Check if user is logged in
- Add null checks before queries

### Realtime not working

- Enable replication for table
- Check subscription filter syntax
- Verify channel name is unique

## Next Steps

1. Run database schema ✅
2. Test authentication ✅
3. Update one page at a time
4. Add loading states
5. Add error handling
6. Test realtime features
7. Migration tool (optional)
8. Deploy to production

## Support

If you encounter issues:

- Check Supabase logs: **Logs** → **Database**
- Test queries in SQL Editor
- Review RLS policies
- Check browser console for errors

For questions, refer to:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
