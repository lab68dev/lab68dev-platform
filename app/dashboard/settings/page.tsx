"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { User, Bell, Shield, Palette, Globe, Camera, Volume2, VolumeX } from "lucide-react"
import { getCurrentUser, updateUserProfile, type User as UserType } from "@/lib/features/auth"
import { getUserLanguage, setUserLanguage, getTranslations, getLanguageName, type Language } from "@/lib/config"
import { getTheme, setTheme, type Theme } from "@/lib/config"
import {
  getReminderPreferences,
  setReminderPreferences,
  requestNotificationPermission,
  canShowBrowserNotifications,
  getAvailableIntervals,
  playNotificationSound,
  type ReminderPreferences,
} from "@/lib/utils/meeting-notifications"

export default function SettingsPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [website, setWebsite] = useState("")
  const [avatar, setAvatar] = useState("")
  const [notifications, setNotifications] = useState(true)
  const [currentTheme, setCurrentTheme] = useState<Theme>("dark")
  const [language, setLanguage] = useState<Language>("en")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  // Meeting notification preferences
  const [meetingPrefs, setMeetingPrefs] = useState<ReminderPreferences>({
    enabled: true,
    intervals: [10],
    browserNotifications: false,
    soundEnabled: true,
    soundVolume: 0.5,
  })
  const availableIntervals = getAvailableIntervals()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
    } else {
      setUser(currentUser)
      setEmail(currentUser.email)
      setUsername(currentUser.name)
      setBio(currentUser.bio || "")
      setLocation(currentUser.location || "")
      setWebsite(currentUser.website || "")
      setAvatar(currentUser.avatar || "")
      const userLang = (currentUser.language as Language) || getUserLanguage()
      setLanguage(userLang)
      setCurrentTheme(getTheme())
      
      // Load meeting notification preferences
      setMeetingPrefs(getReminderPreferences())
    }
  }, [router])

  const t = getTranslations(language)

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang)
    setUserLanguage(newLang)
    if (user) {
      updateUserProfile(user.id, { language: newLang })
    }
    
    // Dispatch event for smooth transition
    try {
      const evt = new CustomEvent("lab68_language_change", { detail: { lang: newLang } })
      window.dispatchEvent(evt)
    } catch (e) {
      // ignore
    }
  }

  const handleThemeChange = (newTheme: Theme) => {
    setCurrentTheme(newTheme)
    setTheme(newTheme)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setAvatar(base64String)
        if (user) {
          updateUserProfile(user.id, { avatar: base64String })
          setUser({ ...user, avatar: base64String })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    if (user) {
      updateUserProfile(user.id, {
        name: username,
        bio,
        location,
        website,
        language,
        avatar,
      })
      alert("Profile updated successfully!")
    }
  }

  if (!user) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">{t.dashboard.loading}</p>
      </div>
    )
  }

  const languages: Language[] = ["en", "vi"]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-8">
        <h1 className="text-4xl font-bold mb-2">{t.settings.title}</h1>
        <p className="text-muted-foreground">{t.settings.subtitle}</p>
      </div>

      {/* Profile Settings */}
      <Card className="border-border p-6 bg-card space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <User className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">{t.settings.profile}</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t.settings.avatar || "Profile Picture"}</Label>
            <div className="flex items-center gap-4">
              {avatar ? (
                <img
                  src={avatar || "/placeholder.svg"}
                  alt="Avatar"
                  className="w-20 h-20 object-cover border border-border"
                />
              ) : (
                <div className="w-20 h-20 bg-primary flex items-center justify-center text-background font-bold text-2xl">
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  title="Upload profile picture"
                  aria-label="Upload profile picture"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  {t.settings.uploadAvatar || "Upload Photo"}
                </Button>
                {avatar && (
                  <Button
                    onClick={() => {
                      setAvatar("")
                      if (user) {
                        updateUserProfile(user.id, { avatar: "" })
                        setUser({ ...user, avatar: "" })
                      }
                    }}
                    variant="outline"
                  >
                    {t.settings.removeAvatar || "Remove"}
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">{t.settings.username}</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t.settings.email}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-border"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary min-h-[100px]"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-background border-border"
              placeholder="City, Country"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="bg-background border-border"
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div className="space-y-2">
            <Label>{t.settings.userId}</Label>
            <p className="text-sm text-muted-foreground font-mono">{user.id}</p>
          </div>
          <div className="space-y-2">
            <Label>{t.settings.memberSince}</Label>
            <p className="text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <Button onClick={handleSaveProfile}>{t.settings.saveChanges}</Button>
        </div>
      </Card>

      {/* Language Settings */}
      <Card className="border-border p-6 bg-card space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <Globe className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">{t.settings.language}</h2>
        </div>
        <div className="space-y-4">
          <Label>{t.settings.selectLanguage}</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`border p-4 transition-colors ${
                  language === lang ? "border-primary bg-secondary" : "border-border hover:border-primary"
                }`}
                title={`Switch to ${getLanguageName(lang)}`}
                aria-label={`Switch to ${getLanguageName(lang)}`}
              >
                <p className="font-medium">{getLanguageName(lang)}</p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="border-border p-6 bg-card space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <Bell className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">{t.settings.notifications}</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between border border-border p-4">
            <div>
              <p className="font-medium">{t.settings.emailNotifications}</p>
              <p className="text-sm text-muted-foreground">{t.settings.emailNotificationsDesc}</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 border border-border transition-colors ${
                notifications ? "bg-primary" : "bg-secondary"
              }`}
              title="Toggle email notifications"
              aria-label="Toggle email notifications"
            >
              <div
                className={`w-4 h-4 bg-background transition-transform ${
                  notifications ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between border border-border p-4">
            <div>
              <p className="font-medium">{t.settings.buildNotifications}</p>
              <p className="text-sm text-muted-foreground">{t.settings.buildNotificationsDesc}</p>
            </div>
            <button 
              className="w-12 h-6 border border-border bg-primary"
              title="Toggle build notifications"
              aria-label="Toggle build notifications"
            >
              <div className="w-4 h-4 bg-background translate-x-7" />
            </button>
          </div>
          
          {/* Meeting Notifications - Enhanced */}
          <div className="border border-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t.settings.meetingNotifications || "Meeting Notifications"}</p>
                <p className="text-sm text-muted-foreground">
                  {t.settings.meetingNotificationsDesc || "Get notified about upcoming meetings"}
                </p>
              </div>
              <button
                onClick={() => {
                  const newPrefs = { ...meetingPrefs, enabled: !meetingPrefs.enabled }
                  setMeetingPrefs(newPrefs)
                  setReminderPreferences(newPrefs)
                }}
                className={`w-12 h-6 border border-border transition-colors ${
                  meetingPrefs.enabled ? "bg-primary" : "bg-secondary"
                }`}
                title="Toggle meeting notifications"
                aria-label="Toggle meeting notifications"
              >
                <div
                  className={`w-4 h-4 bg-background transition-transform ${
                    meetingPrefs.enabled ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            
            {meetingPrefs.enabled && (
              <div className="space-y-4 pt-4 border-t border-border">
                {/* Reminder Intervals */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Reminder Times</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableIntervals.map((interval) => (
                      <button
                        key={interval.value}
                        onClick={() => {
                          const newIntervals = meetingPrefs.intervals.includes(interval.value)
                            ? meetingPrefs.intervals.filter(i => i !== interval.value)
                            : [...meetingPrefs.intervals, interval.value]
                          const newPrefs = { ...meetingPrefs, intervals: newIntervals }
                          setMeetingPrefs(newPrefs)
                          setReminderPreferences(newPrefs)
                        }}
                        className={`px-3 py-1.5 text-sm border transition-colors ${
                          meetingPrefs.intervals.includes(interval.value)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {interval.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Select when you want to be reminded before meetings
                  </p>
                </div>
                
                {/* Browser Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Browser Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      {canShowBrowserNotifications() 
                        ? "Show system notifications" 
                        : "Click to enable in browser"}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      if (!meetingPrefs.browserNotifications) {
                        const granted = await requestNotificationPermission()
                        if (granted) {
                          const newPrefs = { ...meetingPrefs, browserNotifications: true }
                          setMeetingPrefs(newPrefs)
                          setReminderPreferences(newPrefs)
                        }
                      } else {
                        const newPrefs = { ...meetingPrefs, browserNotifications: false }
                        setMeetingPrefs(newPrefs)
                        setReminderPreferences(newPrefs)
                      }
                    }}
                    className={`w-12 h-6 border border-border transition-colors ${
                      meetingPrefs.browserNotifications ? "bg-primary" : "bg-secondary"
                    }`}
                    title="Toggle browser notifications"
                    aria-label="Toggle browser notifications"
                  >
                    <div
                      className={`w-4 h-4 bg-background transition-transform ${
                        meetingPrefs.browserNotifications ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                
                {/* Sound Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {meetingPrefs.soundEnabled ? (
                      <Volume2 className="h-4 w-4 text-primary" />
                    ) : (
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Sound Alerts</p>
                      <p className="text-xs text-muted-foreground">Play sound when reminder triggers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playNotificationSound(meetingPrefs.soundVolume)}
                      className="text-xs text-primary hover:underline"
                      title="Test sound"
                    >
                      Test
                    </button>
                    <button
                      onClick={() => {
                        const newPrefs = { ...meetingPrefs, soundEnabled: !meetingPrefs.soundEnabled }
                        setMeetingPrefs(newPrefs)
                        setReminderPreferences(newPrefs)
                      }}
                      className={`w-12 h-6 border border-border transition-colors ${
                        meetingPrefs.soundEnabled ? "bg-primary" : "bg-secondary"
                      }`}
                      title="Toggle sound notifications"
                      aria-label="Toggle sound notifications"
                    >
                      <div
                        className={`w-4 h-4 bg-background transition-transform ${
                          meetingPrefs.soundEnabled ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </Card>

      {/* Security Settings */}
      <Card className="border-border p-6 bg-card space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">{t.settings.security}</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">{t.settings.currentPassword}</Label>
            <Input id="current-password" type="password" className="bg-background border-border" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">{t.settings.newPassword}</Label>
            <Input id="new-password" type="password" className="bg-background border-border" />
          </div>
          <Button>{t.settings.updatePassword}</Button>
        </div>
      </Card>

      {/* Appearance Settings */}
      <Card className="border-border p-6 bg-card space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <Palette className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">{t.settings.appearance}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">{t.settings.theme}</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleThemeChange("dark")}
                className={`border p-4 transition-colors ${
                  currentTheme === "dark" ? "border-primary bg-secondary" : "border-border hover:border-primary"
                }`}
                title="Switch to dark theme"
                aria-label="Switch to dark theme"
              >
                <p className="font-medium">{t.settings.darkMode}</p>
                {currentTheme === "dark" && <p className="text-xs text-muted-foreground">{t.settings.currentTheme}</p>}
              </button>
              <button
                onClick={() => handleThemeChange("light")}
                className={`border p-4 transition-colors ${
                  currentTheme === "light" ? "border-primary bg-secondary" : "border-border hover:border-primary"
                }`}
                title="Switch to light theme"
                aria-label="Switch to light theme"
              >
                <p className="font-medium">{t.settings.lightMode}</p>
                {currentTheme === "light" && <p className="text-xs text-muted-foreground">{t.settings.currentTheme}</p>}
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive p-6 bg-card space-y-4">
        <h2 className="text-2xl font-bold text-destructive">{t.settings.dangerZone}</h2>
        <p className="text-sm text-muted-foreground">{t.settings.dangerZoneDesc}</p>
        <Button variant="destructive">{t.settings.deleteAccount}</Button>
      </Card>
    </div>
  )
}
