"use client"

import { useEffect, useState } from 'react'
import { createClient } from './supabase'
import type { User } from './auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          // Fetch profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single()
          
          if (profile) {
            const userData: User = {
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
            setUser(userData)
            localStorage.setItem("lab68_session", JSON.stringify(userData))
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          const userData: User = {
            id: profile.id,
            email: session.user.email || '',
            name: profile.name,
            createdAt: profile.created_at,
            language: profile.language,
            bio: profile.bio,
            location: profile.location,
            website: profile.website,
            avatar: profile.avatar
          }
          setUser(userData)
          localStorage.setItem("lab68_session", JSON.stringify(userData))
        }
      } else {
        setUser(null)
        localStorage.removeItem("lab68_session")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return { user, loading, isAuthenticated: !!user }
}
