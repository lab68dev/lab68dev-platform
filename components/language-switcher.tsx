"use client"

import { useState, useEffect } from "react"
import { getUserLanguage, setUserLanguage, getLanguageName, type Language } from "@/lib/config"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<Language>("en")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setCurrentLang(getUserLanguage())
  }, [])

  const languages: Language[] = ["en", "es", "fr", "de", "zh", "ja", "pt", "ru", "vi"]

  const handleLanguageChange = (lang: Language) => {
    setUserLanguage(lang)
    setCurrentLang(lang)
    setIsOpen(false)
    // Notify other parts of the app in the same window to update without a full reload
    try {
      const evt = new CustomEvent("lab68_language_change", { detail: { lang } })
      window.dispatchEvent(evt)
    } catch (e) {
      // fallback to reload if CustomEvent isn't available
      window.location.reload()
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors border border-border px-3 py-2"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{getLanguageName(currentLang)}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 border border-border bg-background shadow-lg z-50">
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${
                    currentLang === lang ? "bg-secondary text-primary" : ""
                  }`}
                >
                  {getLanguageName(lang)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
