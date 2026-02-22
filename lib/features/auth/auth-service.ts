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

    // Profile creation is handled by the database trigger 'on_auth_user_created'
    // This allows us to avoid race conditions and client-side RLS issues during signup

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

// Instant Passwordless Authentication (Hidden Password)
// This orchestrates a seamless login/signup flow using just an email.
export async function signInOrSignUpWithEmailOnly(
  email: string,
  rememberMe = true,
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    // Generate a consistent, structurally strong "hidden" password
    // In a real production app, this should ideally use a pepper/HMAC on the backend, 
    // but for this instant-auth lab requirement we create it deterministically here.
    const hiddenPassword = `L@b68!${email.length}${email}SecureHash`;

    // 1. Attempt to sign in first (assuming the user already exists)
    const signInResult = await signIn(email, hiddenPassword, rememberMe);

    if (signInResult.success) {
      return signInResult; // Successfully logged in
    }

    // 2. If sign in fails due to "Invalid login credentials", the user might exist but with a different password.
    // We call our secure backend bypass to sync their password to the hidden instant auth password.
    if (signInResult.error && signInResult.error.toLowerCase().includes("invalid login credentials")) {
      try {
        const syncRes = await fetch('/api/auth/instant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: hiddenPassword })
        });

        if (syncRes.ok) {
          const syncData = await syncRes.json();
          if (syncData.success) {
            // Password successfully synced! Retry sign in.
            return await signIn(email, hiddenPassword, rememberMe);
          }
        }
      } catch (err) {
        console.error("Failed to sync instant auth password:", err);
      }
    }

    // 3. If sign in fails and sync didn't resolve it (likely because user doesn't exist), attempt to sign up
    const signUpResult = await signUp(email, hiddenPassword);

    if (signUpResult.success) {
      // Supabase signUp auto-logs you in if email confirmation is disabled,
      // but to ensure the `rememberMe` and cache states are identical to a normal login,
      // we'll run a clean signIn immediately after a successful signUp.
      return await signIn(email, hiddenPassword, rememberMe);
    }

    return { success: false, error: signUpResult.error || "Instant authentication failed" };
  } catch (error: any) {
    return { success: false, error: error.message || "Instant authentication encountered an error" };
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
