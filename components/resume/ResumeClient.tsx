"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ResumeToolbar } from "./ResumeToolbar"
import { ResumeA4 } from "./ResumeA4"
import { 
  ResumeData, 
  Template, 
  SectionType, 
  Experience, 
  Education, 
  Skill 
} from "@/lib/types/resume"
import { saveResumeAction } from "@/app/dashboard/resume/actions"

interface ResumeClientProps {
  initialData: ResumeData
  initialTitle: string
  initialId: string | null
}

const templates: { value: Template; label: string; description: string; hasPhoto: boolean }[] = [
  { value: 'harvard', label: 'Harvard (Main)', description: 'Elite professional standard', hasPhoto: false },
  { value: 'modern', label: 'Modern', description: 'Clean and contemporary design', hasPhoto: true },
  { value: 'professional', label: 'Professional', description: 'Executive style with photo', hasPhoto: true },
]

const fontOptions = [
  { value: 'Inter', label: 'Inter (Modern Sans-Serif)' },
  { value: 'Arial', label: 'Arial (Classic Sans-Serif)' },
  { value: 'Helvetica', label: 'Helvetica (Professional)' },
  { value: 'Georgia', label: 'Georgia (Elegant Serif)' },
  { value: 'Times New Roman', label: 'Times New Roman (Traditional)' },
]

export function ResumeClient({ initialData, initialTitle, initialId }: ResumeClientProps) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData)
  const [selectedTemplate, setSelectedTemplate] = useState<Template>('harvard')
  const [draggedSection, setDraggedSection] = useState<SectionType | null>(null)
  const [resumeTitle, setResumeTitle] = useState(initialTitle)
  const [resumeId, setResumeId] = useState<string | null>(initialId)
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100) // Percentage
  const editorRef = useRef<HTMLDivElement>(null!)
  // Ensure default skills exist if empty
  useEffect(() => {
    if (resumeData.skills.length === 0) {
      setResumeData(prev => ({
        ...prev,
        skills: [
          { id: '1', category: 'Languages', items: 'Java, Python, TypeScript, SQL, HTML/CSS' },
          { id: '2', category: 'Frameworks & Libraries', items: 'React, Next.js, Node.js, Tailwind CSS, PostgreSQL' },
          { id: '3', category: 'Tools & Infrastructure', items: 'Git, Docker, AWS, Vercel, Figma' },
          { id: '4', category: 'Concepts', items: 'REST APIs, Agile/Scrum, CI/CD, System Design' },
        ]
      }))
    }
  }, [])

  // Removed handleSave and handleDownload unchanged lines but keeping context... 

  // ... (keeping existing handlers)

  // Need to update the handlers or keep them as is?
  // I will just perform the targeted replacement for the state initialization and the zoom UI.
  // Wait, I need to be careful with the Replace tool limits.
  // I'll assume lines 39-48 are the state init.
  // And lines ~317-324 are the Zoom UI.
  
  // Let's do 2 chunks.

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await saveResumeAction({
        ...resumeData,
        title: resumeTitle,
        template: selectedTemplate
      }, resumeId)

      if (result.success) {
        toast.success("Resume saved successfully!")
        if (result.resume?.id) {
          setResumeId(result.resume.id)
        }
      } else {
        toast.error(result.error || "Failed to save resume")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = () => {
    setIsDownloading(true)
    try {
      if (!editorRef.current) return

      // Create a hidden iframe for printing
      const iframe = document.createElement('iframe')
      iframe.style.position = 'fixed'
      iframe.style.right = '0'
      iframe.style.bottom = '0'
      iframe.style.width = '0'
      iframe.style.height = '0'
      iframe.style.border = '0'
      document.body.appendChild(iframe)

      const doc = iframe.contentWindow?.document
      if (!doc) return

      // Extract styles from the main document to ensure fidelity
      const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map(style => style.outerHTML)
        .join('')

      const content = editorRef.current.innerHTML

      doc.open()
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${resumeTitle}</title>
            ${styles}
            <style>
              @page {
                size: A4;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                background: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .no-print {
                display: none !important;
              }
              /* Force white background for the card inside print */
              [class*="bg-white"], .bg-white, Card {
                background-color: white !important;
              }
              /* Reset transform for print */
              [style*="transform: scale"] {
                transform: none !important;
                margin-bottom: 0 !important;
              }
              /* Hide calendar picker indicator for print */
              input[type="month"]::-webkit-calendar-picker-indicator {
                display: none !important;
                -webkit-appearance: none;
              }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `)
      doc.close()

      // Wait for content and styles to load
      setTimeout(() => {
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(iframe)
          setIsDownloading(false)
        }, 1000)
      }, 500)

    } catch (error) {
      console.error('Error downloading resume:', error)
      toast.error("Failed to generate PDF")
      setIsDownloading(false)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setResumeData({
          ...resumeData,
          personalInfo: { ...resumeData.personalInfo, photoUrl: reader.result as string }
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    })
  }

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id)
    })
  }

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    }
    setResumeData({ ...resumeData, experience: [...resumeData.experience, newExp] })
  }

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    })
  }

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    })
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
    }
    setResumeData({ ...resumeData, education: [...resumeData.education, newEdu] })
  }

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map(skill => skill.id === id ? { ...skill, [field]: value } : skill)
    })
  }

  const removeSkill = (id: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter(skill => skill.id !== id)
    })
  }

  const addSkill = () => {
    const newSkill: Skill = { id: Date.now().toString(), category: "New Category", items: "" }
    setResumeData({ ...resumeData, skills: [...resumeData.skills, newSkill] })
  }

  const updateCertification = (index: number, val: string) => {
    const newCerts = [...resumeData.certifications]
    newCerts[index] = val
    setResumeData({ ...resumeData, certifications: newCerts })
  }

  const removeCertification = (index: number) => {
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.filter((_, i) => i !== index)
    })
  }

  const addCertification = () => {
    setResumeData({ ...resumeData, certifications: [...resumeData.certifications, ""] })
  }

  const toggleSectionVisibility = (sectionId: SectionType) => {
    setResumeData({
      ...resumeData,
      sectionOrder: resumeData.sectionOrder.map(s => s.id === sectionId ? { ...s, visible: !s.visible } : s)
    })
  }

  const handleDragStart = (sectionId: SectionType) => setDraggedSection(sectionId)
  const handleDragEnd = () => setDraggedSection(null)
  
  const handleDragOver = (e: React.DragEvent, targetSectionId: SectionType) => {
    e.preventDefault()
    if (!draggedSection || draggedSection === targetSectionId) return

    const newOrder = [...resumeData.sectionOrder]
    const draggedIndex = newOrder.findIndex(s => s.id === draggedSection)
    const targetIndex = newOrder.findIndex(s => s.id === targetSectionId)

    const [removed] = newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, removed)

    setResumeData({ ...resumeData, sectionOrder: newOrder })
  }

  const getFontSizeClass = () => {
    switch (resumeData.styleSettings.fontSize) {
      case 'small': return 'text-xs'
      case 'large': return 'text-base'
      default: return 'text-sm'
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <ResumeToolbar 
        resumeTitle={resumeTitle}
        setResumeTitle={setResumeTitle}
        isSaving={isSaving}
        handleSave={handleSave}
        isDownloading={isDownloading}
        handleDownload={handleDownload}
        resumeData={resumeData}
        setResumeData={setResumeData}
        fontOptions={fontOptions}
      />

      <div className="container mx-auto p-4 flex flex-col items-center">
         <div className="flex items-center justify-between w-full max-w-[210mm] mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Live Interactive Workspace</span>
            </div>
            <div className="flex items-center gap-3 no-print">
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Zoom (%)</span>
              <input 
                type="number" min="50" max="200" step="10" 
                value={zoomLevel} onChange={(e) => setZoomLevel(parseInt(e.target.value))}
                className="w-16 h-6 text-xs bg-muted rounded border-none text-center focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

        <ResumeA4 
          editorRef={editorRef}
          resumeData={resumeData}
          setResumeData={setResumeData}
          selectedTemplate={selectedTemplate}
          zoomLevel={zoomLevel / 100}
          showPhotoUpload={templates.find(t => t.value === selectedTemplate)?.hasPhoto || false}
          handlePhotoUpload={handlePhotoUpload}
          toggleSectionVisibility={toggleSectionVisibility}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDragEnd={handleDragEnd}
          updateExperience={updateExperience}
          removeExperience={removeExperience}
          addExperience={addExperience}
          updateEducation={updateEducation}
          removeEducation={removeEducation}
          addEducation={addEducation}
          updateSkill={updateSkill}
          removeSkill={removeSkill}
          addSkill={addSkill}
          updateCertification={updateCertification}
          removeCertification={removeCertification}
          addCertification={addCertification}
          getFontSizeClass={getFontSizeClass}
        />
      </div>
    </div>
  )
}
