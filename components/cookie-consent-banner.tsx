"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

const COOKIE_CONSENT_KEY = "lab68_cookie_consent"

type CookieConsent = "accepted" | "rejected" | null

export function CookieConsentBanner() {
  const [consent, setConsent] = useState<CookieConsent>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY)
      if (stored === "accepted" || stored === "rejected") {
        setConsent(stored)
      }
    } catch {
      // ignore storage failures
    } finally {
      setReady(true)
    }
  }, [])

  const updateConsent = (value: Exclude<CookieConsent, null>) => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, value)
    } catch {
      // ignore storage failures
    }
    setConsent(value)
  }

  if (!ready || consent) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70] w-[calc(100%-2rem)] max-w-sm rounded-[10px] border border-white/10 bg-[#0d0d0d]/96 p-4 text-white shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-bold text-white">Cookies</h2>
          <p className="mt-1 text-xs leading-6 text-zinc-300">
            We use essential cookies to keep the product working and optional analytics cookies to improve the experience.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => updateConsent("accepted")}
            className="rounded-[6px] border-[#ff7a00] bg-[#ff7a00] px-3 font-semibold text-black hover:bg-[#ff932e]"
          >
            Accept
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => updateConsent("rejected")}
            className="rounded-[6px] border-white/15 bg-transparent px-3 text-white hover:bg-white hover:text-black"
          >
            Reject
          </Button>
          <Button
            asChild
            type="button"
            size="sm"
            variant="ghost"
            className="rounded-[6px] px-3 text-zinc-300 hover:bg-white/10 hover:text-white"
          >
            <Link href="/cookies">Manage</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
