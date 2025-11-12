# Jira-like Features Testing Guide

## Quick Start Testing

After applying the database schema and setting environment variables, follow this guide to test the Jira-like features.

## Prerequisites

1. ✅ Database schema applied (`database/jira-schema.sql` in Supabase)
2. ✅ Environment configured (`.env.local` with Supabase credentials)
3. ✅ Feature flag enabled (`NEXT_PUBLIC_USE_SUPABASE_BACKEND=true`)

## Testing Steps

### 1. Start Development Server

```bash
pnpm dev
```

Visit: `http://localhost:3000`

### 2. Login/Authentication

- Login to your account
- Navigate to **Dashboard → Projects**

### 3. Create or Select a Project

**Option A: Create New Project**

1. Click **"+ New Project"**
2. Fill in project details
3. Click **Create**

**Option B: Use Existing Project**

- Click on any existing project card

### 4. Test Kanban Board

Navigate to: `Dashboard → Projects → [Your Project] → Kanban`

**What to verify:**

- ✅ Page loads without errors
- ✅ Shows "(Supabase)" badge in header (indicates API backend is active)
- ✅ Four columns visible: To Do, In Progress, Review, Done

**Test: Create Task**

1. Click **"+ Add Task"** button on any column
2. Fill in:
   - Title: "Test API Integration"
   - Description: "Testing Supabase backend"
   - Priority: High
   - Story Points: 3
3. Click **Save**
4. **Verify**: Task appears in the column
5. **Verify in Supabase**:
   - Go to Supabase → Table Editor → `issues`
   - Should see new row with auto-generated `key` (e.g., "PROJ-1")

**Test: Update Task**

1. Click the ✏️ (edit) icon on a task
2. Change the title
3. Click **Save**
4. **Verify**: Changes appear immediately
5. **Verify in Supabase**: Row updated in `issues` table

**Test: Drag and Drop**

1. Drag a task from "To Do" to "In Progress"
2. **Verify**: Task moves visually
3. **Verify in Supabase**: `status` field updated

**Test: Delete Task**

1. Click the 🗑️ (delete) icon on a task
2. Confirm deletion
3. **Verify**: Task disappears
4. **Verify in Supabase**: Row deleted from `issues` table

**Test: Create Label**

1. Click **"Manage Labels"** button
2. Enter name: "Frontend"
3. Select color (e.g., blue)
4. Click **Save**
5. **Verify in Supabase**: New row in `labels` table

### 5. Test Backlog Page

Navigate to: `Dashboard → Projects → [Your Project] → Backlog`

**What to verify:**

- ✅ Page loads without errors
- ✅ Shows "(Supabase)" badge in header
- ✅ Backlog tasks listed

**Test: Create Backlog Task**

1. Click **"+ New Task"**
2. Fill in details
3. Click **Save**
4. **Verify**: Task appears in backlog
5. **Verify in Supabase**: `status` = 'backlog'

**Test: Move to Sprint** (requires active sprint)

1. Create a sprint first (via Supabase Table Editor or future UI)
2. Click **→** (move to sprint) icon on a task
3. **Verify**: Task moves to sprint
4. **Verify in Supabase**: `sprint_id` and `status` updated

### 6. Test Error Handling

**Test: Network Error**

1. Stop Supabase project or disconnect internet
2. Try to create a task
3. **Verify**: Error message displays at top of page
4. **Verify**: "Dismiss" button works

**Test: Invalid Data**

1. Try to create a task with empty title
2. **Verify**: Validation prevents submission

### 7. Test Fallback to localStorage

**Switch to localStorage Mode:**

1. Edit `.env.local`: `NEXT_PUBLIC_USE_SUPABASE_BACKEND=false`
2. Restart dev server: `pnpm dev`
3. **Verify**: "(Supabase)" badge disappears
4. **Verify**: Tasks are saved to browser's localStorage
5. **Verify**: Open DevTools → Application → Local Storage → `tasks` key exists

## API Endpoint Testing (Optional)

### Test with curl

```bash
# Get all issues for a project
curl http://localhost:3000/api/projects/YOUR_PROJECT_ID/issues

# Create an issue
curl -X POST http://localhost:3000/api/projects/YOUR_PROJECT_ID/issues \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Issue from API",
    "description": "Testing direct API call",
    "status": "backlog",
    "priority": "high"
  }'

# Get issue details
curl http://localhost:3000/api/projects/YOUR_PROJECT_ID/issues/ISSUE_ID

# Update issue
curl -X PUT http://localhost:3000/api/projects/YOUR_PROJECT_ID/issues/ISSUE_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'

# Delete issue
curl -X DELETE http://localhost:3000/api/projects/YOUR_PROJECT_ID/issues/ISSUE_ID
```

### Test with Browser DevTools

1. Open **DevTools → Network** tab
2. Perform any action (create, update, delete task)
3. **Verify**:
   - API calls to `/api/projects/[id]/issues`
   - Status: 200 OK
   - Response contains `success: true`

## Database Verification

### Check in Supabase Table Editor

**Issues Table:**

```sql
SELECT * FROM issues 
WHERE project_id = 'your-project-id' 
ORDER BY created_at DESC;
```

**Expected Fields:**

- `id` - UUID
- `key` - Auto-generated (e.g., "PROJ-1")
- `title`, `description`
- `status` - backlog, todo, in-progress, review, done
- `priority` - lowest, low, medium, high, urgent
- `assignee_id`, `reporter_id`
- `sprint_id` - NULL for backlog tasks
- `created_at`, `updated_at`

**Activity Log:**

```sql
SELECT * FROM issue_activity 
WHERE issue_id = 'your-issue-id' 
ORDER BY created_at DESC;
```

Should show all changes (created, status_changed, etc.)

**Watchers:**

```sql
SELECT * FROM issue_watchers 
WHERE issue_id = 'your-issue-id';
```

Creator and assignee should be auto-added as watchers.

## Troubleshooting

### Issue: No tasks appearing

**Check:**

1. Supabase credentials correct in `.env.local`
2. Database schema applied successfully
3. User is authenticated (check cookies in DevTools)
4. RLS policies allow access (check Supabase logs)

**Fix:**

```sql
-- Manually add yourself as project collaborator
INSERT INTO project_collaborators (project_id, user_id, role)
VALUES ('your-project-id', 'your-user-id', 'owner');
```

### Issue: 401 Unauthorized

**Check:**

- User is logged in
- Supabase session is valid
- Check browser console for auth errors

### Issue: 500 Server Error

**Check:**

- Supabase logs: Dashboard → Logs → Postgres Logs
- Browser console for detailed error messages
- Server console (terminal running `pnpm dev`)

### Issue: Tasks not persisting

**Check:**

1. Feature flag: `NEXT_PUBLIC_USE_SUPABASE_BACKEND=true`
2. Restart dev server after changing `.env.local`
3. Clear browser cache and localStorage
4. Check Supabase connection in Supabase dashboard

## Performance Testing

### Load Test (Optional)

Create multiple tasks quickly:

```javascript
// In browser console
for (let i = 0; i < 10; i++) {
  // Use the UI to create tasks
  // Or make direct API calls
}
```

**Verify:**

- UI remains responsive
- No duplicate tasks created
- Database transactions are atomic

## Success Criteria

✅ Can create tasks via both Kanban and Backlog pages  
✅ Tasks persist in Supabase database  
✅ Drag-and-drop updates task status  
✅ Delete removes task from database  
✅ Auto-generated issue keys work (PROJ-1, PROJ-2, etc.)  
✅ Activity log tracks changes  
✅ Watchers auto-added (creator + assignee)  
✅ Error messages display properly  
✅ Loading states show during operations  
✅ Can switch between API and localStorage modes  

## Next Steps After Testing

Once all tests pass:

1. **Test with team members** - Multiple users, different roles
2. **Test sprint functionality** - Create sprints, move tasks
3. **Build issue detail modal** - View comments, attachments, activity
4. **Add real-time updates** - Supabase Realtime for live collaboration
5. **Implement notifications** - Email/in-app for watchers

## Report Issues

If you encounter bugs:

1. Check browser console for errors
2. Check Supabase logs
3. Note the exact steps to reproduce
4. Include error messages and screenshots
5. Check existing documentation in `docs/` folder

---

**Happy Testing! 🚀**
