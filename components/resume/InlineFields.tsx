"use client"

import React from "react"

interface InlineFieldProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  className?: string
  style?: React.CSSProperties
}

export const InlineInput = ({ value, onChange, className, placeholder, style }: InlineFieldProps) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={style}
    className={`bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary/30 hover:bg-black/5 rounded px-1 transition-all text-black placeholder:text-gray-400 ${className}`}
  />
)

export const InlineTextarea = ({ value, onChange, className, placeholder, style }: InlineFieldProps) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={style}
    rows={1}
    className={`bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary/30 hover:bg-black/5 rounded px-1 transition-all w-full resize-none overflow-hidden text-black placeholder:text-gray-400 ${className}`}
    onInput={(e: any) => {
      e.target.style.height = 'auto'
      e.target.style.height = e.target.scrollHeight + 'px'
    }}
  />
)
