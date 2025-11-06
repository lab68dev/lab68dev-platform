# Collaborators Feature

## Overview
The Collaborators feature allows users to manage and view all team members they've invited across their projects from a centralized location.

## Features

### 1. Collaborators Dashboard (`/dashboard/collaborators`)
- **Stats Overview**: View total collaborators, shared projects, and registered users
- **Search**: Find collaborators by name or email
- **Comprehensive List**: See all collaborators with their project access
- **Quick Actions**: Remove collaborators from individual projects or all projects at once

### 2. Project-Level Collaboration (`/dashboard/projects`)
- **Add Collaborators**: Invite team members by email to specific projects
- **View Access**: See who has access to each project
- **Manage Permissions**: Remove collaborators when needed (owner only)

## User Interface Components

### Collaborators Page
Located at: `app/dashboard/collaborators/page.tsx`

**Key Components:**
- **Stats Cards**: Display metrics for total collaborators, shared projects, and registered users
- **Search Bar**: Filter collaborators by name or email
- **Collaborator Cards**: Show each collaborator with:
  - Profile information (name, email, registration status)
  - Number of projects they have access to
  - List of specific projects with quick remove actions
  - Button to remove from all projects

### Sidebar Navigation
Updated: `components/dashboard-sidebar.tsx`
- Added "Collaborators" link between "Projects" and "To Do"
- Uses `Users` icon for visual consistency
- Changed Community icon to `MessageSquare` to avoid icon duplication

## How It Works

### Data Structure
```typescript
interface Project {
  id: string
  name: string
  description: string
  status: string
  tech: string[]
  lastUpdated: string
  userId: string // Project owner
  collaborators?: string[] // Array of collaborator emails
}

interface CollaboratorInfo {
  email: string
  name?: string
  projectCount: number
  projects: { id: string; name: string }[]
  isRegistered: boolean
}
```

### Storage
- Projects and collaborators are stored in `localStorage` under key `lab68_projects`
- Each project maintains its own `collaborators` array
- User information is retrieved from `localStorage` under key `lab68_users`

### Access Control
- Only project owners can:
  - Add collaborators to their projects
  - Remove collaborators from their projects
  - Edit or delete their projects
- Collaborators can:
  - View projects they're invited to
  - Access the Kanban board for shared projects
  - Cannot edit or delete projects they don't own

## User Workflows

### Adding a Collaborator to a Project
1. Navigate to `/dashboard/projects`
2. Click the "Collaborators" button on a project card
3. Enter the collaborator's email address
4. Click "Invite"
5. System validates:
   - User exists in the system
   - User isn't the project owner
   - User isn't already a collaborator
6. Collaborator is added to the project

### Viewing All Collaborators
1. Navigate to `/dashboard/collaborators`
2. View stats dashboard showing:
   - Total number of collaborators
   - Total shared projects
   - Number of registered users
3. Browse or search through the collaborator list
4. Click on project names to navigate to Kanban boards
5. Remove collaborators from specific projects or all projects

### Removing a Collaborator
**From Specific Project:**
1. In the collaborators list, find the collaborator
2. In their project list, click "Remove" next to the project
3. Collaborator loses access to that project only

**From All Projects:**
1. Click the "X" button at the top right of a collaborator card
2. Confirm the action
3. Collaborator is removed from all your projects

## Integration Points

### Projects Page
- Project cards show collaborator count with Users icon
- Collaborators modal displays owner and all collaborators
- Add/remove functionality for project owners

### Kanban Board
- Collaborators can be assigned to cards (future enhancement)
- Access control ensures only authorized users can view boards

### Dashboard
- Can display collaborator statistics (future enhancement)
- Show recent collaborative activity

## Future Enhancements

1. **Email Invitations**: Send actual email invites to non-registered users
2. **Role-Based Permissions**: Add viewer, editor, admin roles
3. **Activity Feed**: Show recent collaborator actions
4. **Notifications**: Alert users when they're added to projects
5. **Collaboration Analytics**: Track team productivity metrics
6. **Real-time Collaboration**: WebSocket integration for live updates
7. **Comments & Mentions**: Communication within projects
8. **Access Logs**: Track who accessed what and when

## Technical Notes

### Filtering Logic
The page filters projects to show only those where the current user is:
- The owner (userId === user.email), OR
- Listed as a collaborator

### Performance Considerations
- Collaborator data is computed on-demand from the projects array
- Local storage is used for data persistence
- Future: Consider implementing pagination for large collaborator lists
- Future: Add caching layer for frequently accessed collaborator data

### Accessibility
- All buttons have proper title attributes
- Screen reader friendly with semantic HTML
- Keyboard navigation supported throughout

## Translations
The feature uses the existing i18n system with keys under `t.projects.*`:
- `collaborators` - "Collaborators"
- `addCollaborator` - "Add Collaborator"
- `inviteByEmail` - "Invite by email"
- `invite` - "Invite"
- `removeCollaborator` - "Remove"
- `owner` - "Owner"
- `noCollaborators` - "No collaborators yet"

All text is fully translatable across 9 languages (en, es, fr, de, zh, ja, pt, ru, vi).
