"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Plus,
  X,
  Trash2,
  Edit,
  BookOpen,
  Search,
  Filter,
  Tag,
} from "lucide-react"
import { getCurrentUser } from "@/lib/features/auth"
import { getTranslations, getUserLanguage, type Language } from "@/lib/config"
import { getWikiArticles, createWikiArticle, updateWikiArticle, deleteWikiArticle, type WikiArticle } from "@/lib/database"

interface Article {
  id: string
  title: string
  content: string
  category: "processes" | "bestPractices" | "projectSummaries" | "tutorials" | "documentation" | "guidelines" | "api" | "troubleshooting" | "faq" | "architecture"
  tags: string[]
  userId: string
  authorName: string
  createdAt: string
  updatedAt: string
}

const CATEGORIES = ["processes", "bestPractices", "projectSummaries", "tutorials", "documentation", "guidelines", "api", "troubleshooting", "faq", "architecture"] as const

export default function WikiPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "documentation" as typeof CATEGORIES[number],
    tags: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<"all" | typeof CATEGORIES[number]>("all")
  const [language, setLanguage] = useState<Language>(getUserLanguage())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = getTranslations(language)

  const loadArticles = useCallback(async () => {
    const user = getCurrentUser()
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getWikiArticles(user.id)
      
      // Transform Supabase data to match component interface
      const transformedArticles: Article[] = data.map((a) => ({
        id: a.id,
        title: a.title,
        content: a.content,
        category: a.category as typeof CATEGORIES[number],
        tags: a.tags || [],
        userId: a.user_id,
        authorName: user.name,
        createdAt: a.created_at,
        updatedAt: a.updated_at,
      }))
      
      setArticles(transformedArticles)
    } catch (err) {
      console.error('Failed to load articles:', err)
      setError('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadArticles()
  }, [loadArticles])

  const handleOpenModal = (article?: Article) => {
    if (article) {
      setEditingArticle(article)
      setFormData({
        title: article.title,
        content: article.content,
        category: article.category,
        tags: article.tags.join(", "),
      })
    } else {
      setEditingArticle(null)
      setFormData({
        title: "",
        content: "",
        category: "documentation",
        tags: "",
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingArticle(null)
    setFormData({
      title: "",
      content: "",
      category: "documentation",
      tags: "",
    })
  }

  const handleSave = useCallback(async () => {
    const user = getCurrentUser()
    if (!user || !formData.title || !formData.content) return

    const tags = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t)

    try {
      setLoading(true)
      setError(null)

      if (editingArticle) {
        await updateWikiArticle(editingArticle.id, {
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags,
        })
      } else {
        await createWikiArticle({
          user_id: user.id,
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags,
        })
      }

      await loadArticles()
      handleCloseModal()
    } catch (err) {
      console.error("Error saving article:", err)
      setError("Failed to save article")
    } finally {
      setLoading(false)
    }
  }, [formData, editingArticle, loadArticles])

  const handleDelete = useCallback(async (articleId: string) => {
    if (!confirm(t.wiki.confirmDelete)) return

    try {
      setLoading(true)
      setError(null)
      await deleteWikiArticle(articleId)
      
      if (selectedArticle?.id === articleId) {
        setSelectedArticle(null)
      }
      
      await loadArticles()
    } catch (err) {
      console.error("Error deleting article:", err)
      setError("Failed to delete article")
    } finally {
      setLoading(false)
    }
  }, [t.wiki.confirmDelete, selectedArticle, loadArticles])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = filterCategory === "all" || article.category === filterCategory

    return matchesSearch && matchesCategory
  })

  // Group articles by category
  const articlesByCategory = filteredArticles.reduce(
    (acc, article) => {
      if (!acc[article.category]) {
        acc[article.category] = []
      }
      acc[article.category].push(article)
      return acc
    },
    {} as Record<string, Article[]>
  )

  if (selectedArticle) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-8">
          <Button
            onClick={() => setSelectedArticle(null)}
            variant="outline"
            className="gap-2"
          >
            ← {t.wiki.backToList}
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={() => handleOpenModal(selectedArticle)}
              variant="outline"
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              {t.wiki.edit}
            </Button>
            <Button
              onClick={() => handleDelete(selectedArticle.id)}
              variant="outline"
              className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-background"
            >
              <Trash2 className="h-4 w-4" />
              {t.wiki.delete}
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">{selectedArticle.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>
                {t.wiki.author}: {selectedArticle.authorName}
              </span>
              <span>•</span>
              <span>
                {t.wiki.lastUpdated}: {getTimeAgo(selectedArticle.updatedAt)}
              </span>
              <span>•</span>
              <span className="capitalize">
                {t.wiki[selectedArticle.category as keyof typeof t.wiki] as string}
              </span>
            </div>
            {selectedArticle.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs border border-border px-2 py-1 text-muted-foreground flex items-center gap-1"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border pt-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {selectedArticle.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t.wiki.title}</h1>
          <p className="text-muted-foreground">{t.wiki.subtitle}</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" />
          {t.wiki.createArticle}
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) =>
              setFilterCategory(e.target.value as "all" | typeof CATEGORIES[number])
            }
            className="bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
            title="Filter by category"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {t.wiki[cat as keyof typeof t.wiki] as string}
              </option>
            ))}
          </select>
        </div>
        {(searchQuery || filterCategory !== "all") && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              Showing {filteredArticles.length} of {articles.length} articles
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

      {/* Articles List */}
      {filteredArticles.length === 0 ? (
        <div className="border border-border p-12 text-center space-y-4">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-xl font-bold mb-2">
              {searchQuery || filterCategory !== "all" ? "No articles found" : t.wiki.noArticles}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery || filterCategory !== "all"
                ? "Try adjusting your search or filters"
                : t.wiki.startWriting}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(articlesByCategory).map(([category, categoryArticles]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-2xl font-bold border-b border-primary pb-2">
                {t.wiki[category as keyof typeof t.wiki] as string} ({categoryArticles.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="border-border p-6 bg-card hover:border-primary transition-colors cursor-pointer"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-balance mb-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {article.content}
                        </p>
                      </div>

                      {article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs border border-border px-2 py-1 text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                          {article.tags.length > 3 && (
                            <span className="text-xs border border-border px-2 py-1 text-muted-foreground">
                              +{article.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="pt-2 border-t border-border space-y-1">
                        <p className="text-xs text-muted-foreground">
                          {t.wiki.author}: {article.authorName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.wiki.lastUpdated}: {getTimeAgo(article.updatedAt)}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedArticle(article)
                        }}
                        className="w-full gap-2 border-primary text-primary hover:bg-primary hover:text-background"
                      >
                        {t.wiki.readMore}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl border border-border bg-background p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingArticle ? t.wiki.edit : t.wiki.createArticle}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-muted-foreground hover:text-foreground"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.wiki.articleTitle}</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={t.wiki.articleTitle}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.wiki.articleContent}</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder={t.wiki.articleContent}
                  rows={12}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.wiki.category}</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as typeof CATEGORIES[number],
                    })
                  }
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  title={t.wiki.category}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {t.wiki[cat as keyof typeof t.wiki] as string}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.wiki.tags}</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder={t.wiki.tagsPlaceholder}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  {editingArticle ? t.wiki.save : t.wiki.create}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1 border-foreground text-foreground hover:bg-foreground hover:text-background"
                >
                  {t.wiki.cancel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
