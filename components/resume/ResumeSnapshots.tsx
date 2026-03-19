"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { History, SaveAll, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { ResumeData } from "@/lib/types/resume"

interface ResumeSnapshotsProps {
  resumeId: string | null
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

export function ResumeSnapshots({ resumeId, resumeData, setResumeData }: ResumeSnapshotsProps) {
  const [snapshots, setSnapshots] = useState<{ id: string; snapshot_name: string; created_at: string }[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchSnapshots = async () => {
    if (!resumeId) return
    try {
      const res = await fetch(`/api/resumes/snapshots?resumeId=${resumeId}`)
      const data = await res.json()
      if (data.snapshots) {
        setSnapshots(data.snapshots)
      }
    } catch(e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchSnapshots()
  }, [resumeId])

  const handleSaveSnapshot = async () => {
    if (!resumeId) {
      toast.error("Save the resume first before creating a snapshot.")
      return
    }
    const name = window.prompt("Enter a name for this snapshot:")
    if (!name) return

    setIsSaving(true)
    try {
      const res = await fetch('/api/resumes/snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId, snapshotName: name, data: resumeData })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      toast.success("Snapshot created!")
      fetchSnapshots()
    } catch(e: any) {
      toast.error(e.message || "Failed to save snapshot")
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoadLatest = async () => {
    if (snapshots.length === 0) {
      toast.info("No snapshots available.")
      return
    }
    setIsLoading(true)
    try {
      const latest = snapshots[0]
      const res = await fetch(`/api/resumes/snapshots/${latest.id}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      if (data.snapshot?.data) {
        setResumeData(data.snapshot.data)
        toast.success(`Restored snapshot: ${latest.snapshot_name}`)
      }
    } catch(e: any) {
      toast.error(e.message || "Failed to load snapshot")
    } finally {
      setIsLoading(false)
    }
  }

  if (!resumeId) return null

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleLoadLatest}
        disabled={isLoading || snapshots.length === 0}
        className="h-10 border-white/10 text-gray-300 hover:bg-white/10"
        title={snapshots.length > 0 ? `Restore Latest: ${snapshots[0].snapshot_name}` : "No snapshots"}
      >
        {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <History className="h-4 w-4 mr-2" />}
        Restore Latest
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSaveSnapshot}
        disabled={isSaving}
        className="h-10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/50"
      >
        {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <SaveAll className="h-4 w-4 mr-2" />}
        Snapshot
      </Button>
    </div>
  )
}
