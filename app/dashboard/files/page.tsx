"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Plus,
  X,
  Trash2,
  Download,
  ExternalLink,
  FileText,
  Link2,
  Search,
  Filter,
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getTranslations, getUserLanguage, type Language } from "@/lib/i18n"
import { getFiles, createFile, deleteFile, type FileRecord } from "@/lib/database"
import { createClient } from "@/lib/supabase"

interface File {
  id: string
  name: string
  description: string
  type: "uploaded" | "link"
  url: string
  userId: string
  userEmail: string
  createdAt: string
  relatedTo: "project" | "task" | "meeting" | "design" | "documentation" | "planning" | "research" | "general"
  relatedId?: string
}

const FILE_CATEGORIES = ["project", "task", "meeting", "design", "documentation", "planning", "research", "general"] as const

export default function FilesPage() {
  const [files, setFiles] = useState<File[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"upload" | "link">("upload")
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    relatedTo: "general" as typeof FILE_CATEGORIES[number],
    relatedId: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "uploaded" | "link">("all")
  const [filterRelated, setFilterRelated] = useState<"all" | typeof FILE_CATEGORIES[number]>("all")
  const [language, setLanguage] = useState<Language>(getUserLanguage())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = getTranslations(language)

  const loadFiles = useCallback(async () => {
    const user = getCurrentUser()
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getFiles(user.id)
      
      // Transform Supabase data to match component interface
      const transformedFiles: File[] = data.map((f) => ({
        id: f.id,
        name: f.name,
        description: f.category || "",
        type: f.type === "link" ? "link" : "uploaded",
        url: f.url,
        userId: f.user_id,
        userEmail: user.email,
        createdAt: f.created_at,
        relatedTo: (f.category as typeof FILE_CATEGORIES[number]) || "general",
        relatedId: f.project_id || f.task_id,
      }))
      
      setFiles(transformedFiles)
    } catch (err) {
      console.error('Failed to load files:', err)
      setError('Failed to load files')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  const handleOpenModal = (type: "upload" | "link") => {
    setModalType(type)
    setShowModal(true)
    setSelectedFile(null)
    setFormData({
      name: "",
      description: "",
      url: "",
      relatedTo: "general",
      relatedId: "",
    })
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedFile(null)
    setFormData({
      name: "",
      description: "",
      url: "",
      relatedTo: "general",
      relatedId: "",
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB")
      return
    }

    setSelectedFile(file)
    // Auto-fill name from filename
    if (!formData.name) {
      setFormData((prev) => ({ ...prev, name: file.name }))
    }
  }

  const handleSave = useCallback(async () => {
    const user = getCurrentUser()
    if (!user) return

    if (modalType === "upload") {
      if (!selectedFile) {
        alert("Please select a file to upload")
        return
      }

      setUploading(true)

      try {
        const supabase = createClient()
        
        // Upload file to Supabase Storage
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('files')
          .upload(fileName, selectedFile)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('files')
          .getPublicUrl(fileName)

        // Create file record in database
        await createFile({
          user_id: user.id,
          name: formData.name || selectedFile.name,
          type: selectedFile.type || "application/octet-stream",
          size: selectedFile.size,
          url: publicUrl,
          storage_path: fileName,
          category: formData.relatedTo,
          project_id: formData.relatedTo === "project" ? formData.relatedId : undefined,
          task_id: formData.relatedTo === "task" ? formData.relatedId : undefined,
        })

        await loadFiles()
        setUploading(false)
        handleCloseModal()
      } catch (error) {
        console.error("Error uploading file:", error)
        alert("Error uploading file")
        setUploading(false)
      }
    } else {
      // Link type
      if (!formData.name || !formData.url) {
        alert("Please fill in name and URL")
        return
      }

      try {
        setLoading(true)
        setError(null)

        await createFile({
          user_id: user.id,
          name: formData.name,
          type: "link",
          url: formData.url,
          category: formData.relatedTo,
          project_id: formData.relatedTo === "project" ? formData.relatedId : undefined,
          task_id: formData.relatedTo === "task" ? formData.relatedId : undefined,
        })

        await loadFiles()
        handleCloseModal()
      } catch (error) {
        console.error("Error creating link:", error)
        alert("Error creating link")
      } finally {
        setLoading(false)
      }
    }
  }, [modalType, selectedFile, formData, loadFiles])

  const handleDelete = useCallback(async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    try {
      setLoading(true)
      setError(null)
      
      // Find the file to get storage path
      const file = files.find(f => f.id === fileId)
      
      // If it's an uploaded file, delete from storage
      if (file && file.type === "uploaded") {
        const supabase = createClient()
        const fileRecord = await supabase
          .from('files')
          .select('storage_path')
          .eq('id', fileId)
          .single()
        
        if (fileRecord.data?.storage_path) {
          await supabase.storage
            .from('files')
            .remove([fileRecord.data.storage_path])
        }
      }
      
      // Delete from database
      await deleteFile(fileId)
      await loadFiles()
    } catch (err) {
      console.error("Error deleting file:", err)
      setError("Failed to delete file")
    } finally {
      setLoading(false)
    }
  }, [files, loadFiles])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  // Filter files
  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || file.type === filterType
    const matchesRelated = filterRelated === "all" || file.relatedTo === filterRelated

    return matchesSearch && matchesType && matchesRelated
  })

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t.files.title}</h1>
          <p className="text-muted-foreground">{t.files.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleOpenModal("upload")} className="gap-2">
            <Plus className="h-4 w-4" />
            {t.files.uploadFile}
          </Button>
          <Button onClick={() => handleOpenModal("link")} variant="outline" className="gap-2">
            <Link2 className="h-4 w-4" />
            {t.files.addLink}
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
              placeholder="Search files and links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as "all" | "uploaded" | "link")}
            className="bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
            title="Filter by type"
          >
            <option value="all">All Types</option>
            <option value="uploaded">{t.files.uploaded}</option>
            <option value="link">{t.files.linked}</option>
          </select>
          <select
            value={filterRelated}
            onChange={(e) =>
              setFilterRelated(e.target.value as "all" | typeof FILE_CATEGORIES[number])
            }
            className="bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
            title="Filter by category"
          >
            <option value="all">All Categories</option>
            {FILE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {t.files[cat as keyof typeof t.files] as string}
              </option>
            ))}
          </select>
        </div>
        {(searchQuery || filterType !== "all" || filterRelated !== "all") && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              Showing {filteredFiles.length} of {files.length} items
            </span>
            <button
              onClick={() => {
                setSearchQuery("")
                setFilterType("all")
                setFilterRelated("all")
              }}
              className="text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Files Grid */}
      {filteredFiles.length === 0 ? (
        <div className="border border-border p-12 text-center space-y-4">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-xl font-bold mb-2">
              {searchQuery || filterType !== "all" || filterRelated !== "all"
                ? "No files found"
                : t.files.noFiles}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery || filterType !== "all" || filterRelated !== "all"
                ? "Try adjusting your search or filters"
                : t.files.startUploading}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="border-border p-6 bg-card hover:border-primary transition-colors">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    {file.type === "uploaded" ? (
                      <FileText className="h-5 w-5 text-primary" />
                    ) : (
                      <Link2 className="h-5 w-5 text-primary" />
                    )}
                    <h3 className="text-lg font-bold text-balance flex-1">{file.name}</h3>
                  </div>
                  <span className="text-xs border border-border px-2 py-1 text-muted-foreground capitalize">
                    {file.relatedTo}
                  </span>
                </div>

                {file.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {file.description}
                  </p>
                )}

                <div className="pt-2 border-t border-border space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {file.type === "uploaded" ? t.files.uploadedBy : t.files.linkedBy} {file.userEmail}
                  </p>
                  <p className="text-xs text-muted-foreground">{getTimeAgo(file.createdAt)}</p>

                  <div className="flex gap-2 pt-2">
                    {file.type === "uploaded" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.url, "_blank")}
                        className="flex-1 gap-2 border-primary text-primary hover:bg-primary hover:text-background"
                      >
                        <Download className="h-3 w-3" />
                        {t.files.download}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.url, "_blank")}
                        className="flex-1 gap-2 border-primary text-primary hover:bg-primary hover:text-background"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {t.files.openLink}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(file.id)}
                      className="flex-1 gap-2 border-destructive text-destructive hover:bg-destructive hover:text-background"
                    >
                      <Trash2 className="h-3 w-3" />
                      {t.files.delete}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md border border-border bg-background p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {modalType === "upload" ? t.files.uploadFile : t.files.addLink}
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
              {modalType === "upload" && (
                <div className="space-y-2">
                  <label htmlFor="file-upload" className="text-sm font-medium">
                    Select File
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileSelect}
                    className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer"
                    accept="*/*"
                    title="Choose file to upload"
                  />
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">Maximum file size: 10MB</p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {modalType === "upload" ? t.files.fileName : t.files.linkTitle}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={modalType === "upload" ? t.files.fileName : t.files.linkTitle}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.files.fileDescription}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t.files.fileDescription}
                  rows={3}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>
              {modalType === "link" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.files.linkUrl}</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder={t.files.linkUrl}
                    className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.files.relatedTo}</label>
                <select
                  value={formData.relatedTo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      relatedTo: e.target.value as typeof FILE_CATEGORIES[number],
                    })
                  }
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  title={t.files.relatedTo}
                >
                  {FILE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {t.files[cat as keyof typeof t.files] as string}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1" disabled={uploading}>
                  {uploading
                    ? "Uploading..."
                    : modalType === "upload"
                      ? t.files.upload
                      : t.files.addLinkButton}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1 border-foreground text-foreground hover:bg-foreground hover:text-background"
                  disabled={uploading}
                >
                  {t.files.cancel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
