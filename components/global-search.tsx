"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, FileText, FolderKanban, MessageSquare, Calendar, CheckSquare, BookOpen, Palette, Users, Command, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SearchResult {
  id: string
  title: string
  description?: string
  category: "projects" | "files" | "chat" | "meeting" | "todo" | "wiki" | "pages"
  href: string
  icon?: React.ReactNode
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Search function
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    // Simulated search - in production, this would be an API call
    const allItems: SearchResult[] = [
      // Pages
      { id: "1", title: "Dashboard", category: "pages", href: "/dashboard", icon: <FileText className="h-4 w-4" /> },
      { id: "2", title: "Projects", category: "pages", href: "/dashboard/projects", icon: <FolderKanban className="h-4 w-4" /> },
      { id: "3", title: "Chat", category: "pages", href: "/dashboard/chat", icon: <MessageSquare className="h-4 w-4" /> },
      { id: "4", title: "Meetings", category: "pages", href: "/dashboard/meeting", icon: <Calendar className="h-4 w-4" /> },
      { id: "5", title: "To Do", category: "pages", href: "/dashboard/todo", icon: <CheckSquare className="h-4 w-4" /> },
      { id: "6", title: "Knowledge Base", category: "pages", href: "/dashboard/wiki", icon: <BookOpen className="h-4 w-4" /> },
      { id: "7", title: "Whiteboard", category: "pages", href: "/dashboard/whiteboard", icon: <Palette className="h-4 w-4" /> },
      { id: "8", title: "Collaborators", category: "pages", href: "/dashboard/collaborators", icon: <Users className="h-4 w-4" /> },
      { id: "9", title: "Planning", category: "pages", href: "/dashboard/planning", icon: <FileText className="h-4 w-4" /> },
      { id: "10", title: "Flow & Diagrams", category: "pages", href: "/dashboard/diagrams", icon: <FileText className="h-4 w-4" /> },
      { id: "11", title: "Files", category: "pages", href: "/dashboard/files", icon: <FileText className="h-4 w-4" /> },
      { id: "12", title: "Community", category: "pages", href: "/dashboard/community", icon: <Users className="h-4 w-4" /> },
      { id: "13", title: "Resume Editor", category: "pages", href: "/dashboard/resume", icon: <FileText className="h-4 w-4" /> },
      { id: "14", title: "AI Tools", category: "pages", href: "/dashboard/ai-tools", icon: <Bot className="h-4 w-4" /> },
      { id: "15", title: "Settings", category: "pages", href: "/dashboard/settings", icon: <FileText className="h-4 w-4" /> },
    ]

    const filtered = allItems.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setResults(filtered)
    setSelectedIndex(0)
  }, [])

  // Handle search input
  useEffect(() => {
    const debounce = setTimeout(() => {
      performSearch(query)
    }, 150)

    return () => clearTimeout(debounce)
  }, [query, performSearch])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % results.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    }
  }

  const handleSelect = (result: SearchResult) => {
    router.push(result.href)
    setIsOpen(false)
    setQuery("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Search Modal */}
      <div className="relative w-full max-w-2xl border border-border bg-background shadow-2xl">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for pages, projects, files..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <kbd className="px-2 py-1 border border-border bg-muted rounded text-[10px]">ESC</kbd>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query && results.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          )}

          {!query && (
            <div className="py-4 px-3 space-y-3">
              <div className="text-xs font-medium text-muted-foreground">Quick Actions</div>
              <div className="grid gap-2">
                <QuickAction
                  label="Create Project"
                  shortcut="⌘ P"
                  onClick={() => {
                    router.push("/dashboard/projects")
                    setIsOpen(false)
                  }}
                />
                <QuickAction
                  label="New Todo"
                  shortcut="⌘ T"
                  onClick={() => {
                    router.push("/dashboard/todo")
                    setIsOpen(false)
                  }}
                />
                <QuickAction
                  label="Schedule Meeting"
                  shortcut="⌘ M"
                  onClick={() => {
                    router.push("/dashboard/meeting")
                    setIsOpen(false)
                  }}
                />
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-1">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors",
                    index === selectedIndex
                      ? "bg-primary/10 border border-primary"
                      : "border border-transparent hover:bg-muted"
                  )}
                >
                  <div className="flex-shrink-0 text-muted-foreground">
                    {result.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{result.title}</div>
                    {result.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {result.description}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase">
                    {result.category}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 border border-border bg-muted rounded">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 border border-border bg-muted rounded">↵</kbd>
              Select
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Command className="h-3 w-3" />
            <span>K to search</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickAction({
  label,
  shortcut,
  onClick,
}: {
  label: string
  shortcut: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2 border border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm"
    >
      <span>{label}</span>
      <kbd className="px-2 py-1 border border-border bg-muted rounded text-xs">{shortcut}</kbd>
    </button>
  )
}
