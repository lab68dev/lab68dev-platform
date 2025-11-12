# Advanced Features Implementation Guide

## Overview

This guide covers the advanced Jira-like features that have been implemented, including Sprint Planning, Advanced Filtering, and Epic Hierarchy views.

## Components Created

### 1. Sprint Planning Modal

**File**: `components/sprint-planning-modal.tsx`

A comprehensive sprint planning interface with drag-and-drop functionality.

#### Features

- **Dual-Column Layout**: Backlog on left, Sprint on right
- **Drag-and-Drop**: Move issues between backlog and sprint
- **Sprint Metrics Dashboard**:
  - Story Points (completed/total)
  - Issues (completed/total)
  - Velocity tracking
  - Progress percentage
- **Sprint Details Editing**:
  - Sprint name, goal, start/end dates
  - Edit mode (only for planning sprints)
- **Sprint Lifecycle Actions**:
  - Start Sprint (planning → active)
  - Complete Sprint (active → completed)
- **Real-time Progress Tracking**:
  - Progress bars with percentages
  - Days remaining indicator (with warning when < 3 days)
  - Color-coded status badges

#### Props

```typescript
interface SprintPlanningModalProps {
  sprint: Sprint                              // Sprint to plan
  projectId: string                           // Project ID
  backlogIssues: Task[]                       // Issues in backlog
  sprintIssues: Task[]                        // Issues in sprint
  isOpen: boolean                             // Modal visibility
  onClose: () => void                         // Close handler
  onUpdateSprint: (updates: Partial<Sprint>) => Promise<void>
  onMoveToSprint: (issueId: string) => Promise<void>
  onMoveToBacklog: (issueId: string) => Promise<void>
  onStartSprint: () => Promise<void>
  onCompleteSprint: () => Promise<void>
  useAPI?: boolean                            // API backend flag
}
```

#### Usage Example

```typescript
import { SprintPlanningModal } from '@/components/sprint-planning-modal'

const [showSprintPlanning, setShowSprintPlanning] = useState(false)
const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null)

// Open modal
const handleOpenSprintPlanning = (sprint: Sprint) => {
  setCurrentSprint(sprint)
  setShowSprintPlanning(true)
}

// Render modal
{currentSprint && (
  <SprintPlanningModal
    sprint={currentSprint}
    projectId={projectId}
    backlogIssues={backlogIssues}
    sprintIssues={sprintIssues.filter(i => i.sprint_id === currentSprint.id)}
    isOpen={showSprintPlanning}
    onClose={() => setShowSprintPlanning(false)}
    onUpdateSprint={async (updates) => {
      // Update sprint via API
      await updateSprintAPI(projectId, currentSprint.id, updates)
      await loadData()
    }}
    onMoveToSprint={async (issueId) => {
      // Move issue to sprint
      await updateIssueAPI(projectId, issueId, {
        sprint_id: currentSprint.id,
        status: 'todo'
      })
      await loadData()
    }}
    onMoveToBacklog={async (issueId) => {
      // Move issue back to backlog
      await updateIssueAPI(projectId, issueId, {
        sprint_id: null,
        status: 'backlog'
      })
      await loadData()
    }}
    onStartSprint={async () => {
      await updateSprintAPI(projectId, currentSprint.id, {
        status: 'active',
        start_date: new Date().toISOString()
      })
      await loadData()
    }}
    onCompleteSprint={async () => {
      await updateSprintAPI(projectId, currentSprint.id, {
        status: 'completed',
        end_date: new Date().toISOString()
      })
      await loadData()
    }}
    useAPI={useAPI}
  />
)}
```

#### Visual Features

- **Drag Indicators**: GripVertical icons on cards
- **Drop Zone Highlighting**: Border changes to primary color when dragging over
- **Status-based Coloring**: Different colors for sprint status (planning/active/completed)
- **Progress Visualization**: Green progress bars with smooth animations
- **Metric Cards**: Clean card layout for key metrics
- **Responsive Design**: Works on mobile and desktop

---

### 2. Advanced Filters

**File**: `components/advanced-filters.tsx`

A powerful filtering component with multi-select options and text search.

#### Features

- **Text Search**: Search across title, description, and issue key
- **Status Filter**: Multi-select checkboxes for all statuses
- **Priority Filter**: Multi-select for all priority levels
- **Type Filter**: Filter by issue type (story, task, bug, epic, subtask)
- **Assignee Filter**: Multi-select from available assignees
- **Label Filter**: Multi-select color-coded labels
- **Active Filter Count Badge**: Shows number of active filters
- **Collapsible Sections**: Expand/collapse each filter category
- **Clear All**: One-click clear all filters
- **URL Persistence Ready**: Filter state can be synced with URL params

#### Filter Options Interface

```typescript
export interface FilterOptions {
  search: string
  statuses: Task['status'][]
  priorities: Task['priority'][]
  assignees: string[]
  labels: string[]
  types: Array<'story' | 'task' | 'bug' | 'epic' | 'subtask'>
}
```

#### Usage Example

```typescript
import { AdvancedFilters, applyFilters, type FilterOptions } from '@/components/advanced-filters'

const [filters, setFilters] = useState<FilterOptions>({
  search: '',
  statuses: [],
  priorities: [],
  assignees: [],
  labels: [],
  types: [],
})

// Apply filters to issues
const filteredIssues = applyFilters(allIssues, filters)

// Get unique assignees from issues
const availableAssignees = Array.from(
  new Set(allIssues.map(i => i.assignee).filter(Boolean))
) as string[]

// Render component
<AdvancedFilters
  filters={filters}
  availableLabels={labels}
  availableAssignees={availableAssignees}
  onFilterChange={setFilters}
  onClear={() => setFilters({
    search: '',
    statuses: [],
    priorities: [],
    assignees: [],
    labels: [],
    types: [],
  })}
/>

// Display filtered results
{filteredIssues.map(issue => (
  <IssueCard key={issue.id} issue={issue} />
))}
```

#### Helper Function

The component exports a `applyFilters` function that handles all filtering logic:

```typescript
export function applyFilters(issues: Task[], filters: FilterOptions): Task[]
```

This function:

- Filters by search text (case-insensitive, searches title/description/key)
- Filters by selected statuses (OR logic)
- Filters by selected priorities (OR logic)
- Filters by selected types (OR logic)
- Filters by selected assignees (OR logic)
- Filters by selected labels (OR logic - matches if issue has ANY selected label)

#### Visual Features

- **Expandable Sections**: Click section headers to expand/collapse
- **Active Count Badges**: Shows count of active filters per section
- **Color-Coded Options**: Status, priority, and labels use their respective colors
- **Max Height Scrolling**: Long lists (assignees, labels) have scrollable areas
- **Hover States**: Visual feedback on all interactive elements
- **Checkboxes**: Standard checkboxes for multi-select

---

### 3. Epic Hierarchy

**File**: `components/epic-hierarchy.tsx`

A hierarchical view of epics and their child issues with progress tracking.

#### Features

- **Expandable Epic Cards**: Click to expand/collapse epic details
- **Progress Visualization**:
  - Completion percentage bar
  - Issue completion count (completed/total)
  - Story points completion (completed/total)
- **Issue List**: All issues grouped under their parent epic
- **Status Indicators**: Check marks for completed, circles for in-progress
- **Click Handlers**: Separate handlers for epic and issue clicks
- **Empty State**: User-friendly message when no epics exist
- **Visual Hierarchy**: Clear parent-child relationship

#### Usage Example

```typescript
import { EpicHierarchy, groupIssuesByEpic } from '@/components/epic-hierarchy'

// Group issues by epic
const epics = groupIssuesByEpic(allIssues)

// Render component
<EpicHierarchy
  epics={epics}
  onEpicClick={(epicId) => {
    // Handle epic click (e.g., navigate to epic detail page)
    router.push(`/dashboard/projects/${projectId}/epics/${epicId}`)
  }}
  onIssueClick={(issue) => {
    // Handle issue click (e.g., open issue detail modal)
    setSelectedIssue(issue)
    setShowDetailModal(true)
  }}
/>
```

#### Helper Function

The component exports a `groupIssuesByEpic` function:

```typescript
export function groupIssuesByEpic(issues: Task[]): Epic[]
```

This function:

1. Identifies all epic-type issues
2. Groups child issues under their parent epics
3. Returns an array of Epic objects with nested issues

#### Epic Interface

```typescript
interface Epic {
  id: string
  title: string
  description: string
  issues: Task[]
}
```

#### Visual Features

- **Epic Header Card**: Highlighted background for epics
- **Progress Bar**: Animated green progress bar
- **Expand/Collapse Icons**: Chevron icons indicate state
- **Issue Cards**: Clean, bordered cards for issues
- **Status Badges**: Color-coded status pills
- **Priority Flags**: Color-coded priority indicators
- **Due Date Display**: Calendar icon with formatted date
- **Story Points Badges**: Gray badges for story point values

---

## Integration Patterns

### Adding to Kanban Page

```typescript
// Add state for sprint planning
const [showSprintPlanning, setShowSprintPlanning] = useState(false)
const [showFilters, setShowFilters] = useState(false)

// Add filters state
const [filters, setFilters] = useState<FilterOptions>({
  search: '',
  statuses: [],
  priorities: [],
  assignees: [],
  labels: [],
  types: [],
})

// Apply filters to tasks
const filteredTasks = applyFilters(tasks, filters)

// Add buttons to header
<Button onClick={() => setShowFilters(!showFilters)}>
  <Filter className="h-4 w-4 mr-2" />
  Filters
</Button>

// Render components
{showFilters && (
  <AdvancedFilters
    filters={filters}
    availableLabels={labels}
    availableAssignees={availableAssignees}
    onFilterChange={setFilters}
    onClear={clearFilters}
  />
)}
```

### Adding to Backlog Page

```typescript
// Similar pattern as Kanban
// Add epic view option
const [viewMode, setViewMode] = useState<'list' | 'epic'>('list')

{viewMode === 'epic' ? (
  <EpicHierarchy
    epics={groupIssuesByEpic(backlogTasks)}
    onEpicClick={handleEpicClick}
    onIssueClick={handleIssueClick}
  />
) : (
  <TaskList tasks={filteredTasks} />
)}
```

## Best Practices

### Performance Optimization

1. **Memoize Filtered Results**:

   ```typescript
   const filteredIssues = useMemo(
     () => applyFilters(issues, filters),
     [issues, filters]
   )
   ```

2. **Debounce Search Input**:

   ```typescript
   const debouncedSearch = useDebounce(filters.search, 300)
   ```

3. **Lazy Load Epic Details**: Only load issue details when epic is expanded

### State Management

1. **Persist Filters in URL**:

   ```typescript
   const searchParams = new URLSearchParams()
   if (filters.search) searchParams.set('search', filters.search)
   if (filters.statuses.length) searchParams.set('status', filters.statuses.join(','))
   router.push(`?${searchParams.toString()}`)
   ```

2. **Sync Sprint State**: Refresh sprint data after any sprint operation

### Error Handling

1. **Show Loading States**: Display spinners during drag operations
2. **Validate Sprint Dates**: Ensure end date is after start date
3. **Confirm Destructive Actions**: Confirm before completing/closing sprint

## API Integration

### Sprint Operations

```typescript
// Update sprint
PUT /api/projects/[id]/sprints/[sprintId]
Body: { name, goal, start_date, end_date, status }

// Move issue to sprint
PUT /api/projects/[id]/issues/[issueId]
Body: { sprint_id, status: 'todo' }

// Move issue to backlog
PUT /api/projects/[id]/issues/[issueId]
Body: { sprint_id: null, status: 'backlog' }
```

### Filtering with API

```typescript
// API supports server-side filtering
GET /api/projects/[id]/issues?status=todo,in-progress&priority=high,urgent&search=bug

// Or filter client-side with applyFilters()
const filtered = applyFilters(allIssues, filters)
```

## Testing Checklist

### Sprint Planning

- [ ] Drag issue from backlog to sprint
- [ ] Drag issue from sprint to backlog
- [ ] Arrow buttons work for moving issues
- [ ] Metrics update after moving issues
- [ ] Edit sprint details (name, goal, dates)
- [ ] Save sprint changes
- [ ] Start sprint changes status to 'active'
- [ ] Complete sprint changes status to 'completed'
- [ ] Cannot edit completed sprints
- [ ] Loading states show during operations

### Advanced Filters

- [ ] Search text filters issues
- [ ] Status checkboxes filter correctly
- [ ] Priority checkboxes filter correctly
- [ ] Type checkboxes filter correctly
- [ ] Assignee checkboxes filter correctly
- [ ] Label checkboxes filter correctly
- [ ] Multiple filters combine with AND logic
- [ ] Clear All button resets all filters
- [ ] Active filter count badge updates
- [ ] Sections expand/collapse correctly

### Epic Hierarchy

- [ ] Epics display with progress bars
- [ ] Issues grouped under correct epic
- [ ] Expand/collapse epic works
- [ ] Progress percentage calculates correctly
- [ ] Story points total correctly
- [ ] Epic click handler fires
- [ ] Issue click handler fires
- [ ] Status icons display correctly
- [ ] Empty state shows when no epics

## Future Enhancements

### Sprint Planning

- [ ] Capacity planning (team velocity vs sprint capacity)
- [ ] Burndown chart visualization
- [ ] Sprint retrospective notes
- [ ] Automatic sprint creation
- [ ] Sprint templates

### Advanced Filters

- [ ] Save filter presets
- [ ] Share filter URLs
- [ ] Date range filters (created, updated, due date)
- [ ] Custom field filters
- [ ] Quick filter buttons (My Issues, Recently Updated, etc.)

### Epic Hierarchy

- [ ] Epic roadmap timeline view
- [ ] Epic dependencies visualization
- [ ] Epic templates
- [ ] Bulk epic operations
- [ ] Epic archiving

---

**Implementation Status**: All 3 advanced components are complete and type-safe! ✅
