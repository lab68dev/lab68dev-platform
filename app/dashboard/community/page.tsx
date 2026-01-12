"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, X, Search, Filter } from "lucide-react"
import { getCurrentUser } from "@/lib/features/auth"
import { getTranslations, getUserLanguage, type Language } from "@/lib/config"

interface Discussion {
  id: string
  title: string
  content: string
  category: string
  author: string
  authorEmail: string
  replies: number
  createdAt: string
}

const PREDEFINED_CATEGORIES = ["general", "help", "showcase", "feedback", "announcements"]

export default function CommunityPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [showNewDiscussionModal, setShowNewDiscussionModal] = useState(false)
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    category: "",
    customCategory: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [language, setLanguage] = useState<Language>("en")
  const t = getTranslations(language)

  useEffect(() => {
    setLanguage(getUserLanguage())
    loadDiscussions()
  }, [])

  const loadDiscussions = () => {
    const saved = localStorage.getItem("lab68_discussions")
    if (saved) {
      setDiscussions(JSON.parse(saved))
    }
  }

  const saveDiscussions = (updatedDiscussions: Discussion[]) => {
    localStorage.setItem("lab68_discussions", JSON.stringify(updatedDiscussions))
    setDiscussions(updatedDiscussions)
  }

  const handleCreateDiscussion = () => {
    const user = getCurrentUser()
    if (!user) return

    const finalCategory = newDiscussion.category === "custom" ? newDiscussion.customCategory : newDiscussion.category

    if (!newDiscussion.title || !newDiscussion.content || !finalCategory) return

    const discussion: Discussion = {
      id: Date.now().toString(),
      title: newDiscussion.title,
      content: newDiscussion.content,
      category: finalCategory,
      author: user.name,
      authorEmail: user.email,
      replies: 0,
      createdAt: new Date().toISOString(),
    }

    saveDiscussions([discussion, ...discussions])
    setNewDiscussion({ title: "", content: "", category: "", customCategory: "" })
    setShowNewDiscussionModal(false)
  }

  const getCategoryDisplay = (category: string) => {
    if (PREDEFINED_CATEGORIES.includes(category)) {
      return t.community[category as keyof typeof t.community] as string
    }
    return category
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  // Filter discussions
  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = filterCategory === "all" || discussion.category === filterCategory

    return matchesSearch && matchesCategory
  })

  // Group discussions by category
  const discussionsByCategory = filteredDiscussions.reduce(
    (acc, discussion) => {
      if (!acc[discussion.category]) {
        acc[discussion.category] = []
      }
      acc[discussion.category].push(discussion)
      return acc
    },
    {} as Record<string, Discussion[]>,
  )

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t.community.title}</h1>
            <p className="text-muted-foreground">{t.community.subtitle}</p>
          </div>
          <Button onClick={() => setShowNewDiscussionModal(true)} className="gap-2">
            <MessageSquare className="h-4 w-4" />
            {t.community.newDiscussion}
          </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
            title="Filter by category"
          >
            <option value="all">All Categories</option>
            {PREDEFINED_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {t.community[cat as keyof typeof t.community] as string}
              </option>
            ))}
          </select>
        </div>
        {(searchQuery || filterCategory !== "all") && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              Showing {filteredDiscussions.length} of {discussions.length} discussions
            </span>
            <button
              onClick={() => {
                setSearchQuery("")
                setFilterCategory("all")
              }}
              className="text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Discussions by Category */}
      {filteredDiscussions.length === 0 ? (
        <div className="border border-border p-12 text-center space-y-4">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-xl font-bold mb-2">
              {searchQuery || filterCategory !== "all" ? "No discussions found" : t.community.noDiscussions}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery || filterCategory !== "all"
                ? "Try adjusting your search or filters"
                : t.community.startDiscussion}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(discussionsByCategory).map(([category, categoryDiscussions]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-2xl font-bold border-b border-primary pb-2">{getCategoryDisplay(category)}</h2>
              <div className="space-y-2">
                {categoryDiscussions.map((discussion) => (
                  <div key={discussion.id} className="border border-border p-4 hover:border-primary transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <h3 className="font-bold text-balance">{discussion.title}</h3>
                        <p className="text-sm text-muted-foreground">{discussion.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            {t.community.by} {discussion.author}
                          </span>
                          <span>•</span>
                          <span>
                            {discussion.replies} {t.community.replies}
                          </span>
                          <span>•</span>
                          <span>{getTimeAgo(discussion.createdAt)}</span>
                        </div>
                      </div>
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Discussion Modal */}
      {showNewDiscussionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md border border-border bg-background p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.community.newDiscussion}</h2>
              <button
                onClick={() => setShowNewDiscussionModal(false)}
                className="text-muted-foreground hover:text-foreground"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.community.discussionTitle}</label>
                <input
                  type="text"
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                  placeholder={t.community.discussionTitle}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.community.discussionContent}</label>
                <textarea
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                  placeholder={t.community.discussionContent}
                  rows={4}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.community.category}</label>
                <select
                  value={newDiscussion.category}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, category: e.target.value })}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  title={t.community.category}
                >
                  <option value="">{t.community.selectCategory}</option>
                  {PREDEFINED_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {t.community[cat as keyof typeof t.community] as string}
                    </option>
                  ))}
                  <option value="custom">{t.community.customCategory}</option>
                </select>
              </div>
              {newDiscussion.category === "custom" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.community.customCategory}</label>
                  <input
                    type="text"
                    value={newDiscussion.customCategory}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, customCategory: e.target.value })}
                    placeholder={t.community.customCategory}
                    className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={handleCreateDiscussion} className="flex-1">
                  {t.community.post}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewDiscussionModal(false)}
                  className="flex-1 border-foreground text-foreground hover:bg-foreground hover:text-background"
                >
                  {t.community.cancel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
