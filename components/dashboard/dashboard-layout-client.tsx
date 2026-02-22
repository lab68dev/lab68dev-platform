"use client"

import React, { useState, useEffect } from "react"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { createClient } from "@/lib/database/supabase-client"

interface DashboardLayoutClientProps {
  children: React.ReactNode
  showOnboarding: boolean
  userId: string
}

export function DashboardLayoutClient({ children, showOnboarding: initialShow, userId }: DashboardLayoutClientProps) {
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
      {children}
      {showOnboarding && (
        <OnboardingFlow 
          onComplete={handleComplete} 
          onSkip={handleComplete} 
        />
      )}
    </>
  )
}
