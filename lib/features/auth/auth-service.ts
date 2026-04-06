// Supabase authentication
import { createClient } from "../../database/supabase-client"

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  language?: string
  bio?: string
  location?: string
  website?: string
  avatar?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Get current user from localStorage cache (for immediate UI rendering)
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const session = localStorage.getItem("lab68_session")
  return session ? JSON.parse(session) : null
}

// Get current user session from Supabase (authoritative source)
export async function getCurrentUserAsync(): Promise<User | null> {
  if (typeof window === "undefined") return null

  try {
    const supabase = createClient()
    const { data: { user: authUser }, error } = await supabase.auth.getUser()

    if (error || !authUser) return null

    // Fetch user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (profileError || !profile) {
      // Return basic user info if profile doesn't exist
      const user: User = {
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        createdAt: authUser.created_at,
        language: 'en'
      }
      localStorage.setItem("lab68_session", JSON.stringify(user))
      return user
    }

    const user: User = {
      id: profile.id,
      email: authUser.email || '',
      name: profile.name,
      createdAt: profile.created_at,
      language: profile.language,
      bio: profile.bio,
      location: profile.location,
      website: profile.website,
      avatar: profile.avatar
    }

    // Cache user in localStorage for immediate UI rendering
    localStorage.setItem("lab68_session", JSON.stringify(user))
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Sign up a new user with email and password
export async function signUp(
  email: string,
  password: string,
  name?: string,
  language?: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const supabase = createClient()
    const autoName = name || email.split('@')[0] || 'User';

    // Sign up with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: autoName,
          language: language || 'en'
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (signUpError) {
      return { success: false, error: signUpError.message }
    }

    if (!authData.user) {
      return { success: false, error: 'Sign up failed' }
    }

    const newUser: User = {
      id: authData.user.id,
      email,
      name: autoName,
      createdAt: new Date().toISOString(),
      language: language || 'en',
    }

    // Cache user in localStorage
    localStorage.setItem("lab68_session", JSON.stringify(newUser))

    return { success: true, user: newUser }
  } catch (error: any) {
    return { success: false, error: error.message || 'Sign up failed' }
  }
}

// Sign in user with email and password
export async function signIn(
  email: string,
  password: string,
  rememberMe = false,
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const supabase = createClient()

    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return { success: false, error: signInError.message }
    }

    if (!authData.user) {
      return { success: false, error: 'Sign in failed' }
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    const user: User = profile ? {
      id: profile.id,
      email: authData.user.email || '',
      name: profile.name,
      createdAt: profile.created_at,
      language: profile.language,
      bio: profile.bio,
      location: profile.location,
      website: profile.website,
      avatar: profile.avatar
    } : {
      id: authData.user.id,
      email: authData.user.email || '',
      name: authData.user.user_metadata?.name || authData.user.email?.split('@')[0] || 'User',
      createdAt: authData.user.created_at,
      language: 'en'
    }

    // Cache user in localStorage
    localStorage.setItem("lab68_session", JSON.stringify(user))

    if (rememberMe) {
      localStorage.setItem("lab68_remember", "true")
    } else {
      localStorage.removeItem("lab68_remember")
    }

    return { success: true, user }
  } catch (error: any) {
    return { success: false, error: error.message || 'Sign in failed' }
  }
}

// Passwordless authentication using magic link/OTP
// This sends a one-time password to the user's email
export async function signInWithOtp(
  email: string,
  rememberMe = true,
): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    const supabase = createClient()

    // Send OTP to user's email
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // Store remember me preference for after OTP verification
    if (rememberMe) {
      localStorage.setItem("lab68_remember", "true")
    }

    return {
      success: true,
      message: 'Check your email for the magic link to sign in.'
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to send login link' }
  }
}

// Verify OTP code
export async function verifyOtp(
  email: string,
  token: string,
  rememberMe = true
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const supabase = createClient()

    const { data: authData, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (error || !authData.user) {
      return { success: false, error: error?.message || 'Invalid or expired code' }
    }

    // Fetch or create user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    const user: User = profile ? {
      id: profile.id,
      email: authData.user.email || '',
      name: profile.name,
      createdAt: profile.created_at,
      language: profile.language,
      bio: profile.bio,
      location: profile.location,
      website: profile.website,
      avatar: profile.avatar
    } : {
      id: authData.user.id,
      email: authData.user.email || '',
      name: authData.user.user_metadata?.name || authData.user.email?.split('@')[0] || 'User',
      createdAt: authData.user.created_at,
      language: 'en'
    }

    // Cache user in localStorage
    localStorage.setItem("lab68_session", JSON.stringify(user))

    if (rememberMe) {
      localStorage.setItem("lab68_remember", "true")
    }

    return { success: true, user }
  } catch (error: any) {
    return { success: false, error: error.message || 'Verification failed' }
  }
}

// Legacy function kept for backwards compatibility
// DEPRECATED: Use signInWithOtp instead
export async function signInOrSignUpWithEmailOnly(
  email: string,
  rememberMe = true,
): Promise<{ success: boolean; error?: string; user?: User }> {
  // This now uses proper OTP-based authentication
  const result = await signInWithOtp(email, rememberMe)

  if (result.success) {
    // For this flow, we return success but the user needs to verify their email
    // The actual sign-in happens after clicking the magic link
    return {
      success: true,
      user: undefined // User not fully authenticated yet
    }
  }

  return { success: false, error: result.error }
}

// Sign out user
export async function signOut(): Promise<void> {
  try {
    const supabase = createClient()
    await supabase.auth.signOut()
    localStorage.removeItem("lab68_session")
    localStorage.removeItem("lab68_remember")
  } catch (error) {
    console.error('Error signing out:', error)
    // Still clear localStorage even if Supabase signout fails
    localStorage.removeItem("lab68_session")
    localStorage.removeItem("lab68_remember")
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return !!user
  } catch (error) {
    return false
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<User, "id" | "email" | "createdAt">>,
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const supabase = createClient()

    // Update profile in database
    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        language: updates.language,
        bio: updates.bio,
        location: updates.location,
        website: updates.website,
        avatar: updates.avatar
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Get updated user
    const currentUser = await getCurrentUserAsync()

    if (currentUser && currentUser.id === userId) {
      localStorage.setItem("lab68_session", JSON.stringify(currentUser))
    }

    return { success: true, user: currentUser || undefined }
  } catch (error: any) {
    return { success: false, error: error.message || 'Update failed' }
  }
}

// Check if user has a remembered session
export async function checkRememberMe(): Promise<User | null> {
  if (typeof window === "undefined") return null

  try {
    const remember = localStorage.getItem("lab68_remember")
    if (!remember) return null

    const user = await getCurrentUserAsync()
    return user
  } catch (error) {
    localStorage.removeItem("lab68_remember")
    return null
  }
}

// Clear all auth data (useful for debugging)
export function clearAuthData(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("lab68_session")
  localStorage.removeItem("lab68_remember")
}
