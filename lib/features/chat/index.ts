export type CommentContextType = "project" | "task" | "diagram" | "file"

export interface CommentReaction {
  emoji: string
  userId: string
  userName: string
}

export interface Comment {
  id: string
  contextId: string
  contextType: CommentContextType
  userId: string
  userName: string
  content: string
  createdAt: string
  updatedAt: string
  edited: boolean
  resolved: boolean
  replyTo?: string
  mentions: string[]
  reactions: CommentReaction[]
}

interface AddCommentOptions {
  mentions?: string[]
  replyTo?: string
}

const COMMENTS_STORAGE_KEY = "lab68_comments"

function readComments(): Comment[] {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const raw = localStorage.getItem(COMMENTS_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeComments(comments: Comment[]): void {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments))
}

function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export function parseMentions(content: string): string[] {
  const mentionPattern = /@([A-Za-z0-9._-]+)/g
  const mentions = new Set<string>()

  let match = mentionPattern.exec(content)
  while (match) {
    mentions.add(match[1].toLowerCase())
    match = mentionPattern.exec(content)
  }

  return Array.from(mentions)
}

export function getContextComments(contextId: string, contextType: CommentContextType): Comment[] {
  return readComments()
    .filter((comment) => comment.contextId === contextId && comment.contextType === contextType)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

export function addComment(
  contextId: string,
  contextType: CommentContextType,
  userId: string,
  userName: string,
  content: string,
  options: AddCommentOptions = {}
): Comment {
  const now = new Date().toISOString()
  const comments = readComments()

  const comment: Comment = {
    id: createId("comment"),
    contextId,
    contextType,
    userId,
    userName,
    content: content.trim(),
    createdAt: now,
    updatedAt: now,
    edited: false,
    resolved: false,
    replyTo: options.replyTo,
    mentions: options.mentions || [],
    reactions: [],
  }

  comments.push(comment)
  writeComments(comments)

  return comment
}

export function editComment(commentId: string, content: string): Comment | null {
  const comments = readComments()
  const index = comments.findIndex((comment) => comment.id === commentId)

  if (index === -1) {
    return null
  }

  comments[index] = {
    ...comments[index],
    content: content.trim(),
    updatedAt: new Date().toISOString(),
    edited: true,
    mentions: parseMentions(content),
  }

  writeComments(comments)
  return comments[index]
}

function collectThreadIds(comments: Comment[], parentId: string, target: Set<string>): void {
  target.add(parentId)

  const children = comments.filter((comment) => comment.replyTo === parentId)
  children.forEach((child) => collectThreadIds(comments, child.id, target))
}

export function deleteComment(commentId: string): void {
  const comments = readComments()
  const idsToDelete = new Set<string>()

  collectThreadIds(comments, commentId, idsToDelete)

  const remaining = comments.filter((comment) => !idsToDelete.has(comment.id))
  writeComments(remaining)
}

export function addCommentReaction(
  commentId: string,
  emoji: string,
  userId: string,
  userName: string
): Comment | null {
  const comments = readComments()
  const index = comments.findIndex((comment) => comment.id === commentId)

  if (index === -1) {
    return null
  }

  const existingReactionIndex = comments[index].reactions.findIndex(
    (reaction) => reaction.emoji === emoji && reaction.userId === userId
  )

  if (existingReactionIndex >= 0) {
    comments[index].reactions.splice(existingReactionIndex, 1)
  } else {
    comments[index].reactions.push({
      emoji,
      userId,
      userName,
    })
  }

  comments[index].updatedAt = new Date().toISOString()
  writeComments(comments)

  return comments[index]
}

export function resolveComment(commentId: string): Comment | null {
  const comments = readComments()
  const index = comments.findIndex((comment) => comment.id === commentId)

  if (index === -1) {
    return null
  }

  comments[index].resolved = !comments[index].resolved
  comments[index].updatedAt = new Date().toISOString()
  writeComments(comments)

  return comments[index]
}
