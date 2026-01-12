"use client"

import { useState, useEffect } from "react"
import { X, Check, ArrowRight, ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "./ui/button"

export interface OnboardingProps {
  onComplete: () => void
  onSkip: () => void
}

const steps = [
  {
    title: "Welcome to lab68dev Platform!",
    description: "Let's take a quick tour to help you get started with our developer platform.",
    illustration: (
      <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20">
        <Sparkles className="h-24 w-24 text-primary" />
      </div>
    ),
  },
  {
    title: "Create Your First Project",
    description: "Projects help you organize your work. Head to the Projects section to create one.",
    illustration: (
      <svg className="w-full h-48" viewBox="0 0 200 200" fill="none">
        <rect x="40" y="60" width="120" height="80" stroke="currentColor" strokeWidth="2" className="text-primary" fill="none" />
        <rect x="55" y="75" width="35" height="25" fill="currentColor" className="text-primary/30" />
        <rect x="100" y="75" width="45" height="25" fill="currentColor" className="text-primary/30" />
        <rect x="55" y="110" width="90" height="3" fill="currentColor" className="text-muted-foreground/30" />
      </svg>
    ),
  },
  {
    title: "Collaborate with Your Team",
    description: "Use Chat, Whiteboard, and Meetings to collaborate in real-time with your team members.",
    illustration: (
      <svg className="w-full h-48" viewBox="0 0 200 200" fill="none">
        <circle cx="70" cy="80" r="15" fill="currentColor" className="text-blue-500/30" />
        <circle cx="100" cy="80" r="15" fill="currentColor" className="text-green-500/30" />
        <circle cx="130" cy="80" r="15" fill="currentColor" className="text-purple-500/30" />
        <rect x="50" y="110" width="100" height="40" rx="5" stroke="currentColor" strokeWidth="2" className="text-primary" fill="none" />
      </svg>
    ),
  },
  {
    title: "Stay Organized with Todo & Planning",
    description: "Keep track of your tasks and plan your sprints with our built-in productivity tools.",
    illustration: (
      <svg className="w-full h-48" viewBox="0 0 200 200" fill="none">
        <rect x="60" y="50" width="80" height="12" rx="2" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" fill="none" />
        <rect x="60" y="70" width="80" height="12" rx="2" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" fill="none" />
        <rect x="60" y="90" width="80" height="12" rx="2" fill="currentColor" className="text-green-500/30" stroke="currentColor" strokeWidth="2" />
        <path d="M70 96 L75 101 L85 91" stroke="white" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    title: "You're All Set!",
    description: "Start building amazing things with lab68dev. Use Cmd/Ctrl + K anytime to quickly navigate.",
    illustration: (
      <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/20">
        <Check className="h-24 w-24 text-green-500" />
      </div>
    ),
  },
]

export function OnboardingFlow({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    setTimeout(() => onComplete(), 300)
  }

  const handleSkipOnboarding = () => {
    setIsVisible(false)
    setTimeout(() => onSkip(), 300)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-2xl border-2 border-primary bg-background shadow-2xl transform transition-transform duration-300">
        {/* Close Button */}
        <button
          onClick={handleSkipOnboarding}
          className="absolute top-4 right-4 p-2 hover:bg-muted transition-colors z-10"
          aria-label="Close onboarding"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-8 sm:p-12">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 transition-colors ${
                    index <= currentStep ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground text-right">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          {/* Illustration */}
          <div className="mb-8">{steps[currentStep].illustration}</div>

          {/* Text Content */}
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">
              {steps[currentStep].title}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <button
              onClick={handleSkipOnboarding}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip tour
            </button>

            <Button onClick={handleNext} className="gap-2">
              {currentStep === steps.length - 1 ? (
                <>
                  Get Started
                  <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
