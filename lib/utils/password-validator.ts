import zxcvbn from 'zxcvbn'

export interface PasswordStrength {
  score: number // 0-4 (0: very weak, 4: very strong)
  feedback: {
    warning: string
    suggestions: string[]
  }
  crackTime: string
  isStrong: boolean
  requirements: {
    minLength: boolean
    hasUpperCase: boolean
    hasLowerCase: boolean
    hasNumber: boolean
    hasSpecialChar: boolean
  }
}

const MIN_PASSWORD_LENGTH = 12
const SPECIAL_CHARS = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/

/**
 * Comprehensive password strength validator
 * @param password - The password to validate
 * @param userInputs - Optional user inputs to check against (email, name, etc.)
 * @returns PasswordStrength object with detailed analysis
 */
export function validatePasswordStrength(
  password: string,
  userInputs: string[] = []
): PasswordStrength {
  // Use zxcvbn for comprehensive analysis
  const result = zxcvbn(password, userInputs)

  // Check requirements
  const requirements = {
    minLength: password.length >= MIN_PASSWORD_LENGTH,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: SPECIAL_CHARS.test(password),
  }

  // All requirements must be met for strong password
  const meetsAllRequirements = Object.values(requirements).every(Boolean)
  const isStrong = result.score >= 3 && meetsAllRequirements

  // Format crack time for display
  const crackTime = formatCrackTime(result.crack_times_display.offline_slow_hashing_1e4_per_second)

  return {
    score: result.score,
    feedback: {
      warning: result.feedback.warning || '',
      suggestions: result.feedback.suggestions || [],
    },
    crackTime,
    isStrong,
    requirements,
  }
}

/**
 * Format crack time to human-readable format
 */
function formatCrackTime(time: string): string {
  return time.replace('less than a second', 'instantly')
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(score: number): string {
  switch (score) {
    case 0:
      return 'Very Weak'
    case 1:
      return 'Weak'
    case 2:
      return 'Fair'
    case 3:
      return 'Strong'
    case 4:
      return 'Very Strong'
    default:
      return 'Unknown'
  }
}

/**
 * Get password strength color
 */
export function getPasswordStrengthColor(score: number): string {
  switch (score) {
    case 0:
      return 'red'
    case 1:
      return 'orange'
    case 2:
      return 'yellow'
    case 3:
      return 'lime'
    case 4:
      return 'green'
    default:
      return 'gray'
  }
}

/**
 * Check if password has been compromised (placeholder for future API integration)
 * In production, integrate with Have I Been Pwned API
 */
export async function checkPasswordBreach(password: string): Promise<boolean> {
  // TODO: Integrate with Have I Been Pwned API
  // https://haveibeenpwned.com/API/v3#PwnedPasswords
  // For now, return false (not breached)
  return false
}

/**
 * Validate password meets minimum requirements
 */
export function validatePasswordRequirements(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`)
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!SPECIAL_CHARS.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*...)')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
