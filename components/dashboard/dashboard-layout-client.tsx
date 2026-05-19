"use client"

import { useState, useEffect } from "react"

import { GlobalSearch } from "@/components/global-search"
import { MeetingNotifier } from "@/components/meeting-notifier"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { createClient } from "@/lib/database/supabase-client"

interface DashboardLayoutClientProps {
  showOnboarding: boolean
  userId: string
}

export function DashboardLayoutClient({
  showOnboarding: initialShow,
  userId,
}: DashboardLayoutClientProps) {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Show onboarding if needed, with a slight delay for better UX
    if (initialShow) {
      const timer = setTimeout(() => setShowOnboarding(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [initialShow])

  const handleComplete = async () => {
    setShowOnboarding(false)
    
    // Update Supabase profiles table
    try {
      const supabase = createClient()
      await supabase.from('profiles').update({ onboarding_completed: true }).eq('id', userId)
    } catch (error) {
      console.error('Failed to update onboarding status:', error)
    }
  }

  return (
    <>
      <GlobalSearch />
      <MeetingNotifier />
      {showOnboarding && (
        <OnboardingFlow 
          onComplete={handleComplete} 
          onSkip={handleComplete} 
        />
      )}
    </>
  )
}
