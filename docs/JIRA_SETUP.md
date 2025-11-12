# Jira-like Project Management Setup Guide

This guide will help you set up the Jira-like project management features in the Lab68 Dev Platform.

## Overview

The platform now includes comprehensive Jira-like features including:

- **Issues** (Stories, Tasks, Bugs, Epics, Subtasks)
- **Sprints** (Planning, Active, Completed)
- **Labels** (Custom categorization)
- **Comments** (Team collaboration)
- **Attachments** (File uploads)
- **Activity Log** (Audit trail)
- **Watchers** (Notifications)
- **Issue Links** (Relationships between issues)
- **Custom Fields** (Extensible metadata)

## Prerequisites

- Supabase account ([sign up here](https://app.supabase.com))
- Existing Supabase project or create a new one

## Step 1: Database Setup

### 1.1 Access Supabase SQL Editor

1. Log in to your Supabase dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar

### 1.2 Run Database Schema

1. Open the file `database/jira-schema.sql` from this repository
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **Run** to execute

This will create:

- ✅ 13 tables (issues, sprints, labels, comments, etc.)
- ✅ Row Level Security (RLS) policies
- ✅ Database triggers (auto-generate issue keys, timestamps)
- ✅ Helper functions (sprint statistics)

### 1.3 Verify Installation

Run this query in SQL Editor to verify tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'issues', 'sprints', 'labels', 'issue_comments', 
    'issue_attachments', 'issue_labels', 'boards',
    'worklogs', 'issue_watchers', 'issue_activity',
    'issue_links', 'custom_fields', 'issue_custom_field_values'
  )
ORDER BY table_name;
```

You should see all 13 tables listed.

## Step 2: Environment Configuration

### 2.1 Copy Environment Template

```bash
cp .env.example .env.local
```

### 2.2 Configure Supabase Credentials

Update these values in `.env.local`:

```bash
# Get from: Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Enable Supabase backend for project management
NEXT_PUBLIC_USE_SUPABASE_BACKEND=true
```

**Where to find these:**

1. Go to your Supabase project dashboard
2. Click **Settings** (gear icon) → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2.3 Feature Flag (Important!)

Set this to **true** to use the new Jira-like backend:

```bash
NEXT_PUBLIC_USE_SUPABASE_BACKEND=true
```

When `false`, the app falls back to localStorage (for development/testing only).

## Step 3: Test the Setup

### 3.1 Start Development Server

```bash
pnpm dev
```

### 3.2 Verify API Endpoints

Test that the API is working:

```bash
# Replace with your project ID (create a project first)
curl http://localhost:3000/api/projects/YOUR_PROJECT_ID/issues
```

Expected response:

```json
{
  "success": true,
  "data": []
}
```

### 3.3 Create Your First Issue

Navigate to:

1. Dashboard → Projects
2. Select a project (or create one)
3. Go to **Kanban** or **Backlog** view
4. Click **+ Add Task**
5. Fill in the form and submit

Check Supabase Table Editor to verify the issue was created.

## API Documentation

### Issues API

#### List Issues

```http
GET /api/projects/[id]/issues
```

Query parameters:

- `status` - Filter by status (backlog, todo, in-progress, review, done)
- `sprint` - Filter by sprint ID
- `assignee` - Filter by assignee user ID
- `type` - Filter by issue type (story, task, bug, epic, subtask)
- `epic` - Filter by epic ID
- `search` - Search in title/description

#### Create Issue

```http
POST /api/projects/[id]/issues
```

Body:

```json
{
  "title": "Issue title",
  "description": "Detailed description",
  "issue_type": "story",
  "status": "backlog",
  "priority": "high",
  "assignee_id": "user-uuid",
  "sprint_id": "sprint-uuid",
  "epic_id": "epic-uuid",
  "story_points": 5,
  "labels": ["label-id-1", "label-id-2"]
}
```

#### Update Issue

```http
PUT /api/projects/[id]/issues/[issueId]
```

#### Delete Issue

```http
DELETE /api/projects/[id]/issues/[issueId]
```

### Sprints API

#### List Sprints

```http
GET /api/projects/[id]/sprints?status=active
```

#### Create Sprint

```http
POST /api/projects/[id]/sprints
```

Body:

```json
{
  "name": "Sprint 1",
  "goal": "Complete user authentication",
  "start_date": "2024-01-01",
  "end_date": "2024-01-14",
  "status": "planning"
}
```

### Labels API

#### List Labels

```http
GET /api/projects/[id]/labels
```

#### Create Label

```http
POST /api/projects/[id]/labels
```

Body:

```json
{
  "name": "Frontend",
  "color": "#3b82f6",
  "description": "Frontend-related tasks"
}
```

#### Update Label

```http
PUT /api/projects/[id]/labels?labelId=xxx
```

#### Delete Label

```http
DELETE /api/projects/[id]/labels?labelId=xxx
```

### Comments API

#### List Comments

```http
GET /api/projects/[id]/issues/[issueId]/comments
```

#### Add Comment

```http
POST /api/projects/[id]/issues/[issueId]/comments
```

Body:

```json
{
  "content": "This looks good!",
  "is_internal": false
}
```

## Data Migration (Optional)

If you have existing tasks in localStorage, you'll need to migrate them manually:

### Export from localStorage

```javascript
// In browser console
const projects = JSON.parse(localStorage.getItem('projects') || '[]')
console.log(JSON.stringify(projects, null, 2))
```

### Import to Supabase

Use the API endpoints to recreate the data, or use Supabase Table Editor to bulk insert.

## Security Features

### Row Level Security (RLS)

All tables have RLS policies enforcing:

- Users can only access issues in projects they're part of
- Project collaborators can view/edit based on their role
- Activity logs are read-only
- Watchers can only add/remove themselves

### Role-Based Access Control (RBAC)

Roles (in `project_collaborators` table):

- **Owner** - Full access, can delete project
- **Admin** - Manage sprints, labels, settings
- **Editor** - Create/edit issues, add comments
- **Viewer** - Read-only access

### Permission Checks

All API routes validate:

1. User is authenticated (Supabase JWT)
2. User is a project collaborator
3. User has required permission level

## Troubleshooting

### Issue: "Failed to fetch issues"

**Check:**

- Supabase credentials in `.env.local` are correct
- `NEXT_PUBLIC_USE_SUPABASE_BACKEND=true` is set
- Database schema was applied successfully
- User is logged in and has access to the project

**Debug:**

```bash
# Check Supabase logs
# Go to: Supabase Dashboard > Logs > Postgres Logs
```

### Issue: "Unauthorized" errors

**Check:**

- User is authenticated (check browser DevTools > Application > Cookies)
- User is added as a project collaborator
- RLS policies are enabled (they should be by default)

**Fix:**

```sql
-- Add yourself as project owner
INSERT INTO project_collaborators (project_id, user_id, role)
VALUES ('your-project-id', 'your-user-id', 'owner');
```

### Issue: TypeScript errors

**Run:**

```bash
pnpm tsc --noEmit
```

All errors should be resolved. If not, check that you're on the latest code.

### Issue: Auto-generated keys not working

**Verify trigger exists:**

```sql
SELECT trigger_name 
FROM information_schema.triggers 
WHERE event_object_table = 'issues';
```

Should show `set_issue_key_trigger`.

## Next Steps

### UI Integration (Pending)

The backend is complete, but UI pages still use localStorage. To wire them up:

1. **Update Kanban page** (`app/dashboard/projects/[id]/kanban/page.tsx`)
   - Replace `fetchTasks()` with `fetchIssuesAPI()`
   - Replace `createTask()` with `createIssueAPI()`
   - Add loading states and error handling

2. **Update Backlog page** (`app/dashboard/projects/[id]/backlog/page.tsx`)
   - Same as Kanban

3. **Build Issue Detail Modal**
   - Show comments, attachments, activity log
   - Allow editing all fields
   - Show related issues (links, subtasks)

4. **Sprint Planning UI**
   - Drag issues to/from sprint
   - Show sprint capacity and velocity
   - Burndown chart

5. **Epic View**
   - Roadmap timeline
   - Epic progress tracking

### Advanced Features (Future)

- [ ] Attachments upload (Supabase Storage)
- [ ] Real-time updates (Supabase Realtime)
- [ ] Email notifications (watch events)
- [ ] Advanced search/filtering
- [ ] Custom workflows
- [ ] Time tracking (worklogs)
- [ ] Reports and analytics
- [ ] Import/Export (JSON, CSV)

## Support

For issues or questions:

- Check existing documentation in `docs/` folder
- Review database schema in `database/jira-schema.sql`
- Check API route implementations in `app/api/projects/`

## License

This feature is part of the Lab68 Dev Platform and follows the same license.
