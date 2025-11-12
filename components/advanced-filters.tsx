"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  X, 
  Search, 
  Filter,
  ChevronDown,
  Check,
} from "lucide-react"
import type { Task, Label as LabelType } from "@/lib/project-management"

export interface FilterOptions {
  search: string
  statuses: Task['status'][]
  priorities: Task['priority'][]
  assignees: string[]
  labels: string[]
  types: Array<'story' | 'task' | 'bug' | 'epic' | 'subtask'>
}

interface AdvancedFiltersProps {
  filters: FilterOptions
  availableLabels: LabelType[]
  availableAssignees: string[]
  onFilterChange: (filters: FilterOptions) => void
  onClear: () => void
}

const STATUS_OPTIONS: { value: Task['status']; label: string; color: string }[] = [
  { value: 'backlog', label: 'Backlog', color: 'bg-gray-100 text-gray-800' },
  { value: 'todo', label: 'To Do', color: 'bg-blue-100 text-blue-800' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'review', label: 'Review', color: 'bg-purple-100 text-purple-800' },
  { value: 'done', label: 'Done', color: 'bg-green-100 text-green-800' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800' },
  { value: 'blocked', label: 'Blocked', color: 'bg-red-100 text-red-800' },
]

const PRIORITY_OPTIONS: { value: Task['priority']; label: string; color: string }[] = [
  { value: 'urgent', label: 'Urgent', color: 'text-red-500' },
  { value: 'high', label: 'High', color: 'text-orange-500' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
  { value: 'low', label: 'Low', color: 'text-green-500' },
  { value: 'lowest', label: 'Lowest', color: 'text-gray-500' },
]

const TYPE_OPTIONS: { value: 'story' | 'task' | 'bug' | 'epic' | 'subtask'; label: string }[] = [
  { value: 'story', label: 'Story' },
  { value: 'task', label: 'Task' },
  { value: 'bug', label: 'Bug' },
  { value: 'epic', label: 'Epic' },
  { value: 'subtask', label: 'Subtask' },
]

export function AdvancedFilters({
  filters,
  availableLabels,
  availableAssignees,
  onFilterChange,
  onClear,
}: AdvancedFiltersProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filters, search })
  }

  const toggleStatus = (status: Task['status']) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status]
    onFilterChange({ ...filters, statuses: newStatuses })
  }

  const togglePriority = (priority: Task['priority']) => {
    const newPriorities = filters.priorities.includes(priority)
      ? filters.priorities.filter(p => p !== priority)
      : [...filters.priorities, priority]
    onFilterChange({ ...filters, priorities: newPriorities })
  }

  const toggleAssignee = (assignee: string) => {
    const newAssignees = filters.assignees.includes(assignee)
      ? filters.assignees.filter(a => a !== assignee)
      : [...filters.assignees, assignee]
    onFilterChange({ ...filters, assignees: newAssignees })
  }

  const toggleLabel = (labelId: string) => {
    const newLabels = filters.labels.includes(labelId)
      ? filters.labels.filter(l => l !== labelId)
      : [...filters.labels, labelId]
    onFilterChange({ ...filters, labels: newLabels })
  }

  const toggleType = (type: 'story' | 'task' | 'bug' | 'epic' | 'subtask') => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type]
    onFilterChange({ ...filters, types: newTypes })
  }

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.statuses.length > 0 ||
    filters.priorities.length > 0 ||
    filters.assignees.length > 0 ||
    filters.labels.length > 0 ||
    filters.types.length > 0

  const activeFilterCount = 
    (filters.search !== '' ? 1 : 0) +
    filters.statuses.length +
    filters.priorities.length +
    filters.assignees.length +
    filters.labels.length +
    filters.types.length

  return (
    <Card className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="font-semibold">Filters</h3>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-7 text-xs">
            Clear All
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search issues..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status Filter */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('status')}
          className="flex items-center justify-between w-full text-sm font-medium mb-2 hover:text-primary transition-colors"
        >
          <span>Status {filters.statuses.length > 0 && `(${filters.statuses.length})`}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === 'status' ? 'rotate-180' : ''}`} />
        </button>
        {expandedSection === 'status' && (
          <div className="space-y-1">
            {STATUS_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.statuses.includes(option.value)}
                  onChange={() => toggleStatus(option.value)}
                  className="rounded border-border"
                />
                <span className={`px-2 py-0.5 rounded text-xs ${option.color}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Priority Filter */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('priority')}
          className="flex items-center justify-between w-full text-sm font-medium mb-2 hover:text-primary transition-colors"
        >
          <span>Priority {filters.priorities.length > 0 && `(${filters.priorities.length})`}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === 'priority' ? 'rotate-180' : ''}`} />
        </button>
        {expandedSection === 'priority' && (
          <div className="space-y-1">
            {PRIORITY_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.priorities.includes(option.value)}
                  onChange={() => togglePriority(option.value)}
                  className="rounded border-border"
                />
                <span className={`font-medium ${option.color}`}>{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Type Filter */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('type')}
          className="flex items-center justify-between w-full text-sm font-medium mb-2 hover:text-primary transition-colors"
        >
          <span>Type {filters.types.length > 0 && `(${filters.types.length})`}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === 'type' ? 'rotate-180' : ''}`} />
        </button>
        {expandedSection === 'type' && (
          <div className="space-y-1">
            {TYPE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.types.includes(option.value)}
                  onChange={() => toggleType(option.value)}
                  className="rounded border-border"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Assignee Filter */}
      {availableAssignees.length > 0 && (
        <div className="border-t pt-4">
          <button
            onClick={() => toggleSection('assignee')}
            className="flex items-center justify-between w-full text-sm font-medium mb-2 hover:text-primary transition-colors"
          >
            <span>Assignee {filters.assignees.length > 0 && `(${filters.assignees.length})`}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === 'assignee' ? 'rotate-180' : ''}`} />
          </button>
          {expandedSection === 'assignee' && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {availableAssignees.map((assignee) => (
                <label
                  key={assignee}
                  className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.assignees.includes(assignee)}
                    onChange={() => toggleAssignee(assignee)}
                    className="rounded border-border"
                  />
                  <span className="text-sm">{assignee}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Label Filter */}
      {availableLabels.length > 0 && (
        <div className="border-t pt-4">
          <button
            onClick={() => toggleSection('labels')}
            className="flex items-center justify-between w-full text-sm font-medium mb-2 hover:text-primary transition-colors"
          >
            <span>Labels {filters.labels.length > 0 && `(${filters.labels.length})`}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === 'labels' ? 'rotate-180' : ''}`} />
          </button>
          {expandedSection === 'labels' && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {availableLabels.map((label) => (
                <label
                  key={label.id}
                  className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.labels.includes(label.id)}
                    onChange={() => toggleLabel(label.id)}
                    className="rounded border-border"
                  />
                  <span
                    className="px-2 py-0.5 text-xs rounded text-white"
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

// Helper function to apply filters to issues
export function applyFilters(issues: Task[], filters: FilterOptions): Task[] {
  return issues.filter(issue => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch = 
        issue.title.toLowerCase().includes(searchLower) ||
        (issue.description && issue.description.toLowerCase().includes(searchLower)) ||
        (issue.key && issue.key.toLowerCase().includes(searchLower))
      
      if (!matchesSearch) return false
    }

    // Status filter
    if (filters.statuses.length > 0 && !filters.statuses.includes(issue.status)) {
      return false
    }

    // Priority filter
    if (filters.priorities.length > 0 && !filters.priorities.includes(issue.priority)) {
      return false
    }

    // Type filter
    if (filters.types.length > 0) {
      const issueType = issue.issue_type || issue.issueType
      if (!issueType || !filters.types.includes(issueType)) {
        return false
      }
    }

    // Assignee filter
    if (filters.assignees.length > 0) {
      if (!issue.assignee || !filters.assignees.includes(issue.assignee)) {
        return false
      }
    }

    // Label filter
    if (filters.labels.length > 0) {
      const issueLabels = Array.isArray(issue.labels)
        ? issue.labels.map(l => typeof l === 'string' ? l : l.id)
        : []
      
      const hasMatchingLabel = filters.labels.some(labelId => 
        issueLabels.includes(labelId)
      )
      
      if (!hasMatchingLabel) return false
    }

    return true
  })
}
