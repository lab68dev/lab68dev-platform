"use client"

import { useState, useEffect } from 'react'
import { validatePasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor, type PasswordStrength } from '@/lib/utils/password-validator'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'

interface PasswordStrengthIndicatorProps {
  password: string
  userInputs?: string[]
  showRequirements?: boolean
  className?: string
}

export function PasswordStrengthIndicator({
  password,
  userInputs = [],
  showRequirements = true,
  className = '',
}: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState<PasswordStrength | null>(null)

  useEffect(() => {
    if (password) {
      const result = validatePasswordStrength(password, userInputs)
      setStrength(result)
    } else {
      setStrength(null)
    }
  }, [password, userInputs])

  if (!password || !strength) {
    return null
  }

  const strengthLabel = getPasswordStrengthLabel(strength.score)
  const strengthColor = getPasswordStrengthColor(strength.score)

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Password strength:</span>
          <span
            className="font-medium"
            style={{ color: `var(--color-${strengthColor})` }}
          >
            {strengthLabel}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{
              width: `${(strength.score + 1) * 20}%`,
              backgroundColor: `var(--color-${strengthColor})`,
            }}
          />
        </div>
        {strength.crackTime && (
          <p className="text-xs text-muted-foreground">
            Time to crack: {strength.crackTime}
          </p>
        )}
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Password must contain:</p>
          <div className="grid grid-cols-1 gap-1.5">
            <RequirementItem
              met={strength.requirements.minLength}
              text="At least 12 characters"
            />
            <RequirementItem
              met={strength.requirements.hasUpperCase}
              text="One uppercase letter (A-Z)"
            />
            <RequirementItem
              met={strength.requirements.hasLowerCase}
              text="One lowercase letter (a-z)"
            />
            <RequirementItem
              met={strength.requirements.hasNumber}
              text="One number (0-9)"
            />
            <RequirementItem
              met={strength.requirements.hasSpecialChar}
              text="One special character (!@#$%...)"
            />
          </div>
        </div>
      )}

      {/* Feedback */}
      {strength.feedback.warning && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            ⚠️ {strength.feedback.warning}
          </p>
        </div>
      )}

      {strength.feedback.suggestions.length > 0 && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/50 rounded-lg">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
            💡 Suggestions:
          </p>
          <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
            {strength.feedback.suggestions.map((suggestion, index) => (
              <li key={index}>• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
      ) : (
        <XCircleIcon className="h-4 w-4 text-muted-foreground/30 flex-shrink-0" />
      )}
      <span
        className={`text-xs ${
          met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
        }`}
      >
        {text}
      </span>
    </div>
  )
}
