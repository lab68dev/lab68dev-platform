"use client"

import { useState, useEffect } from "react"
import { getTranslations } from "@/lib/config"
import {
  getContextComments,
  addComment,
  editComment,
  deleteComment,
  addCommentReaction,
  resolveComment,
  parseMentions,
  type Comment,
} from "@/lib/features/chat"
import { getTimeAgo } from "@/lib/features/team"

interface CommentSectionProps {
  contextId: string
  contextType: "project" | "task" | "diagram" | "file"
  currentUser: string
  currentUserName: string
}

export default function CommentSection({
  contextId,
  contextType,
  currentUser,
  currentUserName,
}: CommentSectionProps) {
  const t = getTranslations("en") // Default to English, make configurable if needed
  const [comments, setComments] = useState<Comment[]>([])
  const [commentInput, setCommentInput] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [showResolved, setShowResolved] = useState(false)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "mostReplies">("newest")

  useEffect(() => {
    loadComments()
  }, [contextId, contextType])

  function loadComments() {
    const allComments = getContextComments(contextId, contextType)
    setComments(allComments)
  }

  function handleAddComment() {
    if (!commentInput.trim()) return

    const mentions = parseMentions(commentInput)
    addComment(contextId, contextType, currentUser, currentUserName, commentInput, {
      mentions,
      replyTo: replyingTo || undefined,
    })

    setCommentInput("")
    setReplyingTo(null)
    loadComments()
  }

  function handleEdit(commentId: string) {
    if (!editContent.trim()) return

    editComment(commentId, editContent)
    setEditingId(null)
    setEditContent("")
    loadComments()
  }

  function handleDelete(commentId: string) {
    if (confirm(t.comments.confirmDelete)) {
      deleteComment(commentId)
      loadComments()
    }
  }

  function handleReaction(commentId: string, emoji: string) {
    addCommentReaction(commentId, emoji, currentUser, currentUserName)
    loadComments()
  }

  function handleResolve(commentId: string) {
    resolveComment(commentId)
    loadComments()
  }

  function getFilteredAndSortedComments(): Comment[] {
    let filtered = comments

    // Filter by resolved status
    if (!showResolved) {
      filtered = filtered.filter((c) => !c.resolved)
    }

    // Sort
    switch (sortBy) {
      case "newest":
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case "oldest":
        return filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case "mostReplies":
        return filtered.sort((a, b) => {
          const aReplies = comments.filter((c) => c.replyTo === a.id).length
          const bReplies = comments.filter((c) => c.replyTo === b.id).length
          return bReplies - aReplies
        })
      default:
        return filtered
    }
  }

  function getReplies(commentId: string): Comment[] {
    return comments.filter((c) => c.replyTo === commentId)
  }

  function renderComment(comment: Comment, depth: number = 0) {
    const replies = getReplies(comment.id)
    const isEditing = editingId === comment.id

    return (
      <div key={comment.id} className={`${depth > 0 ? "ml-8 mt-2" : ""}`}>
        <div
          className={`border border-border p-4 ${
            comment.resolved ? "bg-muted/50 opacity-70" : "bg-card"
          }`}
        >
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="font-medium text-sm">{comment.userName}</span>
              <span className="text-xs text-muted-foreground ml-2">
                {getTimeAgo(comment.createdAt)}
              </span>
              {comment.edited && (
                <span className="text-xs text-muted-foreground ml-2">{t.comments.edited}</span>
              )}
              {comment.resolved && (
                <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-700 dark:text-green-400 text-xs rounded">
                  {t.comments.resolved}
                </span>
              )}
            </div>

            {/* Actions */}
            {comment.userId === currentUser && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(comment.id)
                    setEditContent(comment.content)
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {t.comments.edit}
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs text-destructive hover:text-destructive/80"
                >
                  {t.comments.delete}
                </button>
              </div>
            )}
          </div>

          {/* Comment Content */}
          {isEditing ? (
            <div className="space-y-2">
              <label htmlFor="edit-comment" className="sr-only">
                {t.comments.edit}
              </label>
              <textarea
                id="edit-comment"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background text-sm"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(comment.id)}
                  className="px-3 py-1 bg-primary text-primary-foreground text-sm hover:bg-primary/90"
                >
                  {t.comments.save}
                </button>
                <button
                  onClick={() => {
                    setEditingId(null)
                    setEditContent("")
                  }}
                  className="px-3 py-1 border border-border text-sm hover:bg-muted"
                >
                  {t.comments.cancel}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap break-words">{comment.content}</p>
          )}

          {/* Reactions */}
          {comment.reactions.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {comment.reactions.map((reaction, idx) => (
                <button
                  key={idx}
                  onClick={() => handleReaction(comment.id, reaction.emoji)}
                  className="px-2 py-1 bg-muted hover:bg-muted/70 rounded text-sm"
                  title={reaction.userName}
                >
                  {reaction.emoji} {comment.reactions.filter((r) => r.emoji === reaction.emoji).length}
                </button>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-3 text-xs">
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              {t.comments.reply}
            </button>
            <button
              onClick={() => handleReaction(comment.id, "👍")}
              className="text-muted-foreground hover:text-foreground"
            >
              {t.comments.react}
            </button>
            <button
              onClick={() => handleResolve(comment.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              {comment.resolved ? t.comments.unresolve : t.comments.resolve}
            </button>
            {replies.length > 0 && (
              <span className="text-muted-foreground">
                {replies.length} {t.comments.replies}
              </span>
            )}
          </div>

          {/* Reply Input */}
          {replyingTo === comment.id && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-muted-foreground">
                {t.comments.replyingTo} {comment.userName}
              </p>
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={t.comments.typeComment}
                className="w-full px-3 py-2 border border-input bg-background text-sm"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddComment}
                  className="px-3 py-1 bg-primary text-primary-foreground text-sm hover:bg-primary/90"
                >
                  {t.comments.post}
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null)
                    setCommentInput("")
                  }}
                  className="px-3 py-1 border border-border text-sm hover:bg-muted"
                >
                  {t.comments.cancel}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Render Replies */}
        {replies.length > 0 && (
          <div className="mt-2">
            {replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  const topLevelComments = getFilteredAndSortedComments().filter((c) => !c.replyTo)

  return (
    <div className="border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">{t.comments.title}</h3>
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setShowResolved(!showResolved)}
            className="px-3 py-1 border border-border hover:bg-muted"
          >
            {showResolved ? t.comments.hideResolved : t.comments.showResolved}
          </button>
          <label htmlFor="sort-comments" className="sr-only">
            {t.comments.sortBy}
          </label>
          <select
            id="sort-comments"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-input bg-background"
          >
            <option value="newest">{t.comments.newest}</option>
            <option value="oldest">{t.comments.oldest}</option>
            <option value="mostReplies">{t.comments.mostReplies}</option>
          </select>
        </div>
      </div>

      {/* Add Comment */}
      {!replyingTo && (
        <div className="mb-6 space-y-2">
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder={t.comments.typeComment}
            className="w-full px-4 py-2 border border-input bg-background"
            rows={3}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">{t.comments.mentionSomeone}</p>
            <button
              onClick={handleAddComment}
              disabled={!commentInput.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.comments.post}
            </button>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {topLevelComments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">{t.comments.noComments}</p>
            <p className="text-xs mt-1">{t.comments.startDiscussion}</p>
          </div>
        ) : (
          topLevelComments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  )
}
