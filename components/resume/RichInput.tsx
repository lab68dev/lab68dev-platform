"use client"

import React, { useState, useRef, useEffect } from "react"
import { Link2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface RichInputProps {
  value: string // HTML string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  style?: React.CSSProperties
  multiline?: boolean
}

export function RichInput({ value, onChange, placeholder, className, style, multiline = false }: RichInputProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [savedSelection, setSavedSelection] = useState<Range | null>(null)

  // Initialize content
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== value) {
      // Only update if the content is different to avoid cursor jumping
      // This approach is a bit naive for a full editor but works for simple updates
      // if the external value changes drastically.
      // For typed updates, we rely on the onInput to keep them in sync, 
      // avoiding re-render loop issues is tricky with contentEditable.
      // We'll trust the user's typing mostly.
      if (document.activeElement !== contentRef.current) {
         contentRef.current.innerHTML = value
      }
    }
  }, [value])

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML
    onChange(html)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        // Ensure the selection is within our editor
        if (contentRef.current?.contains(range.commonAncestorContainer)) {
           setSavedSelection(range.cloneRange())
           setShowLinkInput(true)
        }
      }
    }
  }

  const applyLink = () => {
    if (savedSelection && linkUrl) {
      // Restore selection
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(savedSelection)
        
        // Create link
        document.execCommand('createLink', false, linkUrl)
        
        // Trigger change
        if (contentRef.current) {
          onChange(contentRef.current.innerHTML)
        }
      }
    }
    closeLinkInput()
  }

  const closeLinkInput = () => {
    setShowLinkInput(false)
    setLinkUrl("")
    setSavedSelection(null)
    // Return focus
    setTimeout(() => contentRef.current?.focus(), 0)
  }

  return (
    <div className="relative group">
      <div
        ref={contentRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={`bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary/30 hover:bg-black/5 rounded px-1 transition-all text-black empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 cursor-text ${multiline ? 'w-full resize-none overflow-hidden block' : 'inline-block min-w-[20px]'} ${className}`}
        style={{ ...style, minHeight: multiline ? '1.5em' : undefined, display: multiline ? 'block' : 'inline-block' }}
        data-placeholder={placeholder}
        // Suppress React warning about contentEditable with children
        suppressContentEditableWarning={true}
      />
      
      {showLinkInput && (
        <Card className="absolute z-50 p-2 flex items-center gap-2 shadow-xl bg-white border border-gray-200 -top-12 left-0 min-w-[300px]">
          <Link2 className="h-4 w-4 text-gray-500" />
          <Input 
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Paste URL..."
            className="h-8 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyLink()
              if (e.key === 'Escape') closeLinkInput()
            }}
          />
          <Button size="sm" onClick={applyLink} className="h-8 px-3">Add</Button>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={closeLinkInput}>
            <X className="h-4 w-4" />
          </Button>
        </Card>
      )}
    </div>
  )
}
