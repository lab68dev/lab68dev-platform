"use client"

import { useEffect } from 'react'

export function AnalyticsTracker({ resumeId }: { resumeId: string }) {
  useEffect(() => {
    // Fire and forget
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeId })
    }).catch(() => {})
  }, [resumeId])

  return null
}
