# Enhanced UI Components - Implementation Guide

## Overview

This document describes the enhanced UI components built for the Jira-like project management system, specifically the IssueDetailModal component and its integration.

## IssueDetailModal Component

**File**: `components/issue-detail-modal.tsx`

### Features

#### 1. Details Tab

Comprehensive issue editing with inline forms:

- **Title**: Direct inline editing with auto-save
- **Description**: Multi-line textarea with markdown support (ready)
- **Status**: Dropdown selector with all status options
  - Backlog, To Do, In Progress, Review, Done, Closed, Blocked
  - Color-coded status badges
- **Priority**: Dropdown with priority levels
  - Lowest, Low, Medium, High, Urgent
  - Icon and color indicators
- **Assignee**: Email-based assignment
- **Due Date**: Date picker integration
- **Story Points**: Numeric input for estimation
- **Labels**: Color-coded label display

#### 2. Comments Tab

Full API integration for collaborative discussion:

- **Load Comments**: Fetches from `/api/projects/[id]/issues/[issueId]/comments`
- **Add Comment**: POST new comments with real-time updates
- **Author Display**: Shows comment author email and timestamp
- **Timestamp**: Relative time formatting (e.g., "2h ago", "just now")
- **Graceful Fallback**: Shows message when API is not available

**API Integration**:

```typescript
const loadComments = async () => {
  const response = await fetch(`/api/projects/${projectId}/issues/${issue.id}/comments`)
  const data = await response.json()
  if (data.success) {
    setComments(data.data)
  }
}

const handleAddComment = async () => {
  const response = await fetch(`/api/projects/${projectId}/issues/${issue.id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: newComment, is_internal: false }),
  })
  // Reload comments after successful add
  await loadComments()
}
```

#### 3. Attachments Tab

Placeholder for future file upload functionality:

- User-friendly placeholder message
- Ready for integration with file storage service
- Designed for future drag-and-drop upload

#### 4. Activity Log Tab

Timeline of all changes to the issue:

- **Field Changes**: Shows before/after values
- **Status Updates**: Highlighted status transitions
- **Creation Events**: Initial issue creation
- **User Attribution**: Shows who made each change
- **Timestamps**: Relative time display

**Activity Types**:

- `created` - Issue creation
- `updated` - General updates
- `status_changed` - Status transitions (special formatting)
- Custom field changes with `field_name`, `old_value`, `new_value`

### Component Props

```typescript
interface IssueDetailModalProps {
  issue: Task                          // The issue to display
  projectId: string                    // Project ID for API calls
  labels: LabelType[]                  // Available labels for display
  isOpen: boolean                      // Modal visibility state
  onClose: () => void                  // Close handler
  onUpdate: (updates: Partial<Task>) => Promise<void>  // Update handler
  onDelete: () => Promise<void>        // Delete handler
  useAPI?: boolean                     // API backend flag
}
```

### User Interactions

1. **Click anywhere on card** → Opens modal
2. **Edit button** → Enables inline editing
3. **Save Changes** → Calls onUpdate with modifications
4. **Delete Issue** → Confirms and calls onDelete
5. **Add Comment** → Posts comment and refreshes list
6. **Switch Tabs** → Navigate between Details, Comments, Attachments, Activity
7. **Close** (X button or Close button) → Calls onClose

### Event Handling

**Stop Propagation**: All action buttons (edit, delete, move to sprint) use `e.stopPropagation()` to prevent modal from opening when clicking buttons.

```typescript
<Button
  onClick={(e) => {
    e.stopPropagation()  // Prevent modal from opening
    handleDeleteTask(task.id)
  }}
>
```

## Integration in Kanban Page

**File**: `app/dashboard/projects/[id]/kanban/page.tsx`

### State Management

```typescript
const [showDetailModal, setShowDetailModal] = useState(false)
const [selectedTask, setSelectedTask] = useState<Task | null>(null)
```

### Card Click Handler

```typescript
<Card
  onClick={() => {
    setSelectedTask(task)
    setShowDetailModal(true)
  }}
  className="cursor-pointer hover:shadow-md"
>
```

### Modal Integration

```typescript
{selectedTask && (
  <IssueDetailModal
    issue={selectedTask}
    projectId={projectId}
    labels={labels}
    isOpen={showDetailModal}
    onClose={() => {
      setShowDetailModal(false)
      setSelectedTask(null)
    }}
    onUpdate={async (updates) => {
      if (useAPI) {
        await updateIssueAPI(projectId, selectedTask.id, {
          title: updates.title,
          description: updates.description,
          status: updates.status || selectedTask.status,
          priority: updates.priority,
          assignee: updates.assignee,
          due_date: updates.dueDate,
          story_points: updates.storyPoints,
        })
      } else {
        updateTask(projectId, selectedTask.id, {
          ...selectedTask,
          ...updates,
        })
      }
      await loadKanban()
      setShowDetailModal(false)
      setSelectedTask(null)
    }}
    onDelete={async () => {
      if (useAPI) {
        await deleteIssueAPI(projectId, selectedTask.id)
      } else {
        deleteTask(projectId, selectedTask.id)
      }
      await loadKanban()
      setShowDetailModal(false)
      setSelectedTask(null)
    }}
    useAPI={useAPI}
  />
)}
```

## Integration in Backlog Page

**File**: `app/dashboard/projects/[id]/backlog/page.tsx`

Same pattern as Kanban page:

- Card click opens modal
- Edit/Delete buttons use `stopPropagation()`
- Modal handles updates and deletes
- Refreshes parent data after changes

## TypeScript Safety

All components are fully type-safe:

- Zero TypeScript compilation errors
- Proper interface definitions
- Type guards for label filtering
- Async/await with proper error handling
- Accessibility attributes (aria-labels)

## Styling

- **Tailwind CSS**: Utility-first styling
- **Dark Mode Support**: All components support dark mode
- **Responsive Design**: Mobile-friendly tabs and layout
- **Hover States**: Visual feedback on interactive elements
- **Color Coding**: Priority and status colors
- **Smooth Transitions**: CSS transitions for better UX

## Accessibility

- Accessible form labels
- Keyboard navigation support
- ARIA labels on select elements
- Focus management
- Screen reader friendly

## Performance

- **Lazy Loading**: Modal only renders when `isOpen={true}`
- **Conditional API Calls**: Only loads comments/activity when tabs are active
- **Memoization Ready**: Component structure supports React.memo if needed
- **Optimistic Updates**: UI updates immediately while API call is in progress

## Future Enhancements

### Planned Features

1. **Attachments Upload**
   - Drag-and-drop file upload
   - Image preview
   - File type validation
   - Integration with Supabase Storage

2. **Markdown Support**
   - Rich text editor for description
   - Markdown preview
   - Code block syntax highlighting

3. **@Mentions**
   - Autocomplete for user mentions
   - Notification on mention
   - Link to user profiles

4. **Comment Editing/Deleting**
   - Edit own comments
   - Delete own comments (with permission check)
   - Edit history

5. **Real-time Updates**
   - Supabase Realtime subscriptions
   - Live comment updates
   - Activity log auto-refresh

6. **Watchers**
   - Add/remove watchers
   - Notification preferences
   - Watcher list display

## Testing Checklist

- [ ] Modal opens when clicking on task card
- [ ] Modal closes with X button and Close button
- [ ] Edit mode toggles correctly
- [ ] All form fields update the task
- [ ] Delete confirmation works
- [ ] Comments load from API
- [ ] Adding comments works and refreshes list
- [ ] Activity log displays correctly
- [ ] Tabs switch without issues
- [ ] Stop propagation works on action buttons
- [ ] API and localStorage modes both work
- [ ] Error states display properly
- [ ] Loading states show during operations

## Related Documentation

- [JIRA_SETUP.md](./JIRA_SETUP.md) - Backend setup
- [JIRA_IMPLEMENTATION_STATUS.md](./JIRA_IMPLEMENTATION_STATUS.md) - Overall progress
- [JIRA_TESTING_GUIDE.md](./JIRA_TESTING_GUIDE.md) - Testing instructions
