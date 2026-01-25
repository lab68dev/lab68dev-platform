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

// Get all users from localStorage (legacy - for migration)
export function getAllUsers(): User[] {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("lab68_users")
  return users ? JSON.parse(users) : []
}

// Synchronous version for immediate access (uses cached session)
// This is the default export that most components currently use
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const session = localStorage.getItem("lab68_session")
  return session ? JSON.parse(session) : null
}

// Async version that fetches from Supabase and updates cache
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
      return {
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        createdAt: authUser.created_at,
        language: 'en'
      }
    }

    return {
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
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Synchronous version for components that need immediate user data
// Uses localStorage cache - should be updated after auth state changes
export function getCurrentUserSync(): User | null {
  if (typeof window === "undefined") return null
  const session = localStorage.getItem("lab68_session")
  return session ? JSON.parse(session) : null
}

// Sign up a new user
export async function signUp(
  email: string,
  password: string,
  name: string,
  language?: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const supabase = createClient()

    // Sign up with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
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

    // Profile creation is handled by the database trigger 'on_auth_user_created'
    // This allows us to avoid race conditions and client-side RLS issues during signup

    const newUser: User = {
      id: authData.user.id,
      email,
      name,
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

// Sign in user
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

// Sign out user
export async function signOut(): Promise<void> {
  try {
    const supabase = createClient()
    await supabase.auth.signOut()
    localStorage.removeItem("lab68_session")
    localStorage.removeItem("lab68_remember")
  } catch (error) {
    console.error('Error signing out:', error)
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

export async function checkRememberMe(): Promise<User | null> {
  if (typeof window === "undefined") return null

  try {
    const remember = localStorage.getItem("lab68_remember")
    if (!remember) return null

    const supabase = createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) return null

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (!profile) return null

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

    // Restore session cache
    localStorage.setItem("lab68_session", JSON.stringify(user))
    return user
  } catch (error) {
    localStorage.removeItem("lab68_remember")
    return null
  }
}
