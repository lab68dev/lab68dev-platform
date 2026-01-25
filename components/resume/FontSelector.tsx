"use client"

import React, { useState, useRef, useEffect } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface FontSelectorProps {
  value: string
  onChange: (value: string) => void
  fonts: { value: string; label: string }[]
}

export function FontSelector({ value, onChange, fonts }: FontSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const wrapperRef = useRef<HTMLDivElement>(null)

  const filteredFonts = fonts.filter(font => 
    font.label.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={wrapperRef}>
      <Button
        variant="ghost"
        role="combobox"
        aria-expanded={open}
        className="w-[200px] justify-between text-left font-medium bg-gray-950 hover:bg-gray-900 border border-white/10 shadow-sm text-gray-300 h-9 rounded-lg focus:ring-1 focus:ring-blue-500/50"
        onClick={() => setOpen(!open)}
      >
        <span className="truncate">
          {value
            ? fonts.find((font) => font.value === value)?.label
            : "Select font..."}
        </span>
        <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-40 text-gray-500" />
      </Button>
      
      {open && (
        <Card className="absolute top-full mt-2 w-[200px] p-2 z-50 bg-white border shadow-md">
          <div className="flex items-center border-b px-2 pb-2 mb-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-6 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-black"
              placeholder="Search font..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {filteredFonts.length === 0 ? (
              <div className="py-6 text-center text-sm text-black">No font found.</div>
            ) : (
              <div className="space-y-1">
                {filteredFonts.map((font) => (
                  <div
                    key={font.value}
                    className={`
                      relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer text-black
                      ${value === font.value ? "bg-accent text-accent-foreground" : ""}
                    `}
                    onClick={() => {
                      onChange(font.value)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === font.value ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {font.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
