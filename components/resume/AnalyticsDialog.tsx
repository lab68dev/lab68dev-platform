"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3, Globe, Copy, Check, Loader2, Users, Monitor, Smartphone, Tablet } from "lucide-react"
import { toast } from "sonner"

interface AnalyticsDialogProps {
  resumeId: string | null
  resumeTitle?: string
}

export function AnalyticsDialog({ resumeId, resumeTitle = "Portfolio" }: AnalyticsDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [customDomain, setCustomDomain] = useState("")
  const [domainSaving, setDomainSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/p/${resumeId}` : ''

  useEffect(() => {
    if (isOpen && resumeId) {
      fetchStats()
    }
  }, [isOpen, resumeId])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics/views?resumeId=${resumeId}`)
      const data = await res.json()
      if (data.stats) setStats(data.stats)
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Link copied!")
  }

  const handleSaveDomain = async () => {
    setDomainSaving(true)
    try {
      // Assuming we had a save domain endpoint, but for MVP we might just toast
      // A full implementation would hit \`/api/resumes/domain\`
      toast.success("Domain settings saved (not yet wired to DB).")
    } catch(e) {
      toast.error("Failed to save domain.")
    } finally {
      setDomainSaving(false)
    }
  }

  if (!resumeId) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all">
          <BarChart3 className="h-4 w-4 mr-2" />
          Publish & Stats
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-950 border-gray-800 text-gray-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-100">
            <Globe className="h-5 w-5 text-blue-400" />
            Publish & Analytics
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-2">
          {/* Link Sharing */}
          <div className="space-y-2">
            <Label className="text-gray-400 text-xs uppercase tracking-wider font-bold">Public Link</Label>
            <div className="flex items-center gap-2">
              <Input 
                value={publicUrl} 
                readOnly 
                className="bg-gray-900 border-gray-800 text-gray-300 h-9 font-mono text-xs" 
              />
              <Button size="icon" variant="outline" onClick={handleCopy} className="h-9 w-9 shrink-0 border-gray-700 bg-gray-800 hover:bg-gray-700">
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-gray-400" />}
              </Button>
            </div>
            <p className="text-[10px] text-gray-500">Anyone with this link can view your portfolio.</p>
          </div>

          {/* Stats Overview */}
          <div className="space-y-3">
             <Label className="text-gray-400 text-xs uppercase tracking-wider font-bold">Traffic Stats</Label>
             {loading ? (
                <div className="h-24 flex items-center justify-center bg-gray-900/50 rounded-lg border border-gray-800/50">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
             ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 flex flex-col items-center justify-center">
                    <Users className="h-5 w-5 text-emerald-400 mb-1" />
                    <span className="text-2xl font-bold text-gray-100">{stats?.total || 0}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Total Views</span>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 flex flex-col gap-2 justify-center">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-gray-400"><Monitor className="h-3 w-3" /> Desktop</span>
                      <span className="font-semibold text-gray-200">{stats?.devices?.desktop || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-gray-400"><Smartphone className="h-3 w-3" /> Mobile</span>
                      <span className="font-semibold text-gray-200">{stats?.devices?.mobile || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                       <span className="flex items-center gap-1.5 text-gray-400"><Tablet className="h-3 w-3" /> Tablet</span>
                      <span className="font-semibold text-gray-200">{stats?.devices?.tablet || 0}</span>
                    </div>
                  </div>
                </div>
             )}
          </div>

          {/* Custom Domain (Pro feature teaser or functional) */}
          <div className="space-y-2 pt-2 border-t border-gray-800/50">
             <Label className="text-gray-400 text-xs uppercase tracking-wider font-bold flex items-center gap-2">
                Custom Domain
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">Pro</span>
             </Label>
             <div className="flex items-center gap-2">
               <Input 
                 placeholder="e.g. johndoe.com" 
                 value={customDomain}
                 onChange={e => setCustomDomain(e.target.value)}
                 className="bg-gray-900 border-gray-800 text-gray-300 h-9" 
               />
               <Button size="sm" onClick={handleSaveDomain} disabled={domainSaving || !customDomain} className="h-9 bg-blue-600 hover:bg-blue-500 text-white">
                  {domainSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Link"}
               </Button>
             </div>
             <p className="text-[10px] text-gray-500">Configure your DNS CNAME record to point to <code className="text-gray-400">cname.lab68dev.com</code>.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
