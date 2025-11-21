"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Download, 
  Save,
  Plus,
  Trash2,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Camera,
  Upload,
  GripVertical,
  Palette,
  Type,
  EyeOff,
  Eye,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
  current: boolean
}

interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  current: boolean
}

interface Skill {
  id: string
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

type SectionType = 'summary' | 'experience' | 'education' | 'skills' | 'certifications'

interface SectionOrder {
  id: SectionType
  visible: boolean
}

interface StyleSettings {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  fontSize: 'small' | 'medium' | 'large'
}

interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    website: string
    linkedin: string
    github: string
    photoUrl: string
  }
  summary: string
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  certifications: string[]
  sectionOrder: SectionOrder[]
  styleSettings: StyleSettings
}

const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    photoUrl: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  sectionOrder: [
    { id: 'summary', visible: true },
    { id: 'experience', visible: true },
    { id: 'education', visible: true },
    { id: 'skills', visible: true },
    { id: 'certifications', visible: true },
  ],
  styleSettings: {
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    fontFamily: 'Inter',
    fontSize: 'medium',
  },
}

type Template = 'modern' | 'classic' | 'minimal' | 'creative' | 'professional'

const fontOptions = [
  { value: 'Inter', label: 'Inter (Modern)' },
  { value: 'Arial', label: 'Arial (Classic)' },
  { value: 'Georgia', label: 'Georgia (Elegant)' },
  { value: 'Roboto', label: 'Roboto (Clean)' },
  { value: 'Times New Roman', label: 'Times New Roman (Traditional)' },
  { value: 'Courier New', label: 'Courier New (Monospace)' },
]

export default function ResumeEditorPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData)
  const [selectedTemplate, setSelectedTemplate] = useState<Template>('modern')
  const [draggedSection, setDraggedSection] = useState<SectionType | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  const templates: { value: Template; label: string; description: string; hasPhoto: boolean }[] = [
    { value: 'modern', label: 'Modern', description: 'Clean and contemporary design', hasPhoto: true },
    { value: 'classic', label: 'Classic', description: 'Traditional professional look', hasPhoto: false },
    { value: 'minimal', label: 'Minimal', description: 'Simple and elegant', hasPhoto: false },
    { value: 'creative', label: 'Creative', description: 'Bold and eye-catching', hasPhoto: true },
    { value: 'professional', label: 'Professional', description: 'Executive style with photo', hasPhoto: true },
  ]

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

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id),
    })
  }

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
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

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id),
    })
  }

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    })
  }

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      level: 'Intermediate',
    }
    setResumeData({ ...resumeData, skills: [...resumeData.skills, newSkill] })
  }

  const removeSkill = (id: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter(skill => skill.id !== id),
    })
  }

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    })
  }

  const addCertification = () => {
    setResumeData({ ...resumeData, certifications: [...resumeData.certifications, ""] })
  }

  const removeCertification = (index: number) => {
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.filter((_, i) => i !== index),
    })
  }

  const updateCertification = (index: number, value: string) => {
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.map((cert, i) =>
        i === index ? value : cert
      ),
    })
  }

  const handleSave = () => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData))
    alert('Resume saved successfully!')
  }

  const handleDownload = () => {
    alert('Download feature coming soon! Currently saves to localStorage.')
    handleSave()
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

  const selectedTemplateData = templates.find(t => t.value === selectedTemplate)
  const showPhotoUpload = selectedTemplateData?.hasPhoto

  const handleDragStart = (sectionId: SectionType) => {
    setDraggedSection(sectionId)
  }

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

  const handleDragEnd = () => {
    setDraggedSection(null)
  }

  const toggleSectionVisibility = (sectionId: SectionType) => {
    setResumeData({
      ...resumeData,
      sectionOrder: resumeData.sectionOrder.map(s =>
        s.id === sectionId ? { ...s, visible: !s.visible } : s
      ),
    })
  }

  const getFontSizeClass = () => {
    switch (resumeData.styleSettings.fontSize) {
      case 'small': return 'text-xs'
      case 'large': return 'text-base'
      default: return 'text-sm'
    }
  }

  const renderSection = (sectionId: SectionType) => {
    const section = resumeData.sectionOrder.find(s => s.id === sectionId)
    if (!section?.visible) return null

    switch (sectionId) {
      case 'summary':
        return resumeData.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2" style={{ color: resumeData.styleSettings.primaryColor, borderColor: resumeData.styleSettings.primaryColor }}>
              Professional Summary
            </h2>
            <p className={getFontSizeClass()}>{resumeData.summary}</p>
          </div>
        )
      
      case 'experience':
        return resumeData.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3" style={{ color: resumeData.styleSettings.primaryColor }}>
              Work Experience
            </h2>
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-lg">{exp.position}</h3>
                    <div className={`${getFontSizeClass()} font-medium`}>{exp.company}</div>
                  </div>
                  <div className={`${getFontSizeClass()} px-3 py-1 rounded`} style={{ backgroundColor: `${resumeData.styleSettings.primaryColor}20`, color: resumeData.styleSettings.primaryColor }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                {exp.description && <p className={getFontSizeClass()}>{exp.description}</p>}
              </div>
            ))}
          </div>
        )
      
      case 'education':
        return resumeData.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3" style={{ color: resumeData.styleSettings.primaryColor }}>
              Education
            </h2>
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                    <div className={getFontSizeClass()}>{edu.school}</div>
                  </div>
                  <div className={getFontSizeClass()} style={{ color: resumeData.styleSettings.secondaryColor }}>
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'skills':
        return resumeData.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3" style={{ color: resumeData.styleSettings.primaryColor }}>
              Skills
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {resumeData.skills.map((skill) => (
                <div key={skill.id} className={getFontSizeClass()}>
                  <span className="font-medium">{skill.name}</span> - {skill.level}
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'certifications':
        return resumeData.certifications.filter(c => c).length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3" style={{ color: resumeData.styleSettings.primaryColor }}>
              Certifications
            </h2>
            <ul className={`list-none ${getFontSizeClass()} space-y-1`}>
              {resumeData.certifications.filter(c => c).map((cert, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: resumeData.styleSettings.primaryColor }} />
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Live Resume Editor
              </h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Style Settings */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Colors & Font
              </h3>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Primary Color</Label>
                  <div className="flex gap-2 items-center mt-1">
                    <input
                      type="color"
                      value={resumeData.styleSettings.primaryColor}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        styleSettings: { ...resumeData.styleSettings, primaryColor: e.target.value }
                      })}
                      className="w-10 h-8 rounded border cursor-pointer"
                      aria-label="Primary color picker"
                    />
                    <Input
                      value={resumeData.styleSettings.primaryColor}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        styleSettings: { ...resumeData.styleSettings, primaryColor: e.target.value }
                      })}
                      className="flex-1 text-xs h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs flex items-center gap-1">
                    <Type className="h-3 w-3" />
                    Font
                  </Label>
                  <select
                    value={resumeData.styleSettings.fontFamily}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      styleSettings: { ...resumeData.styleSettings, fontFamily: e.target.value }
                    })}
                    className="w-full mt-1 px-2 py-1.5 bg-background text-foreground border border-border rounded-md text-xs"
                    aria-label="Font family"
                  >
                    {fontOptions.map(font => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-xs">Size</Label>
                  <div className="flex gap-1 mt-1">
                    {(['small', 'medium', 'large'] as const).map(size => (
                      <button
                        key={size}
                        onClick={() => setResumeData({
                          ...resumeData,
                          styleSettings: { ...resumeData.styleSettings, fontSize: size }
                        })}
                        className={`flex-1 px-2 py-1 text-xs rounded border transition-colors ${
                          resumeData.styleSettings.fontSize === size
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:bg-accent'
                        }`}
                      >
                        {size[0].toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Template */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">Template</h3>
              <div className="space-y-1.5">
                {templates.map(template => (
                  <button
                    key={template.value}
                    onClick={() => setSelectedTemplate(template.value)}
                    className={`w-full p-2 border rounded text-left transition-all text-xs ${
                      selectedTemplate === template.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    {template.label}
                    {template.hasPhoto && <span className="ml-1 text-primary">📷</span>}
                  </button>
                ))}
              </div>
            </Card>

            {/* Section Order */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                <GripVertical className="h-4 w-4" />
                Sections
              </h3>
              <div className="space-y-1">
                {resumeData.sectionOrder.map((section) => (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={() => handleDragStart(section.id)}
                    onDragOver={(e) => handleDragOver(e, section.id)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-2 p-2 border rounded cursor-move transition-colors text-xs ${
                      draggedSection === section.id ? 'opacity-50' : ''
                    } ${section.visible ? 'bg-background' : 'bg-muted'}`}
                  >
                    <GripVertical className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="flex-1 capitalize">{section.id}</span>
                    <button
                      onClick={() => toggleSectionVisibility(section.id)}
                      className="p-1 hover:bg-accent rounded"
                      aria-label={`Toggle ${section.id} visibility`}
                    >
                      {section.visible ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Drag to reorder</p>
            </Card>

            {/* Photo Upload */}
            {showPhotoUpload && (
              <Card className="p-4">
                <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Photo
                </h3>
                {resumeData.personalInfo.photoUrl ? (
                  <div className="space-y-2">
                    <div className="relative w-full aspect-square rounded overflow-hidden border">
                      <Image 
                        src={resumeData.personalInfo.photoUrl} 
                        alt="Profile" 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, photoUrl: '' }
                      })}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Label htmlFor="photo" className="cursor-pointer">
                    <div className="w-full aspect-square border-2 border-dashed rounded flex flex-col items-center justify-center gap-2 hover:bg-accent transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Upload Photo</span>
                    </div>
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      aria-label="Upload photo"
                    />
                  </Label>
                )}
              </Card>
            )}
          </div>

          {/* Center - Form Editor */}
          <div className="lg:col-span-1.5 space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Personal Info
              </h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Full Name</Label>
                  <Input
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, fullName: e.target.value }
                    })}
                    placeholder="John Doe"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Email</Label>
                    <Input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                      })}
                      placeholder="email@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Phone</Label>
                    <Input
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                      })}
                      placeholder="+1 234 567 8900"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Location</Label>
                  <Input
                    value={resumeData.personalInfo.location}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                    })}
                    placeholder="City, Country"
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm">Summary</h3>
              <textarea
                value={resumeData.summary}
                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                placeholder="Brief professional summary..."
                className="w-full min-h-[80px] p-2 text-sm border border-border rounded-md bg-background"
              />
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Experience
                </h3>
                <Button onClick={addExperience} size="sm" variant="outline">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-3">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <Input
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                        placeholder="Position"
                        className="flex-1 mr-2 text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="Company"
                      className="text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        className="text-xs"
                      />
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className="text-xs"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                      />
                      Currently working here
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      placeholder="Description..."
                      className="w-full min-h-[60px] p-2 text-xs border border-border rounded bg-background"
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Education
                </h3>
                <Button onClick={addEducation} size="sm" variant="outline">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-3">
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="Degree"
                        className="flex-1 mr-2 text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(edu.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <Input
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                      placeholder="School"
                      className="text-sm"
                    />
                    <Input
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                      placeholder="Field of Study"
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Skills
                </h3>
                <Button onClick={addSkill} size="sm" variant="outline">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {resumeData.skills.map((skill) => (
                  <div key={skill.id} className="flex gap-2">
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                      placeholder="Skill"
                      className="flex-1 text-sm"
                    />
                    <select
                      value={skill.level}
                      onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                      className="px-2 py-1 bg-background border border-border rounded text-xs"
                      aria-label="Skill level"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Expert</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(skill.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Certifications
                </h3>
                <Button onClick={addCertification} size="sm" variant="outline">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {resumeData.certifications.map((cert, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={cert}
                      onChange={(e) => updateCertification(index, e.target.value)}
                      placeholder="Certification name"
                      className="flex-1 text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertification(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right - Live Preview */}
          <div className="lg:col-span-1.5">
            <div className="sticky top-4">
              <Card className="p-8 bg-white" ref={editorRef}>
                <div 
                  className="text-black"
                  style={{ fontFamily: resumeData.styleSettings.fontFamily }}
                >
                  {/* Header */}
                  <div className="mb-6 pb-4" style={{ borderBottom: `2px solid ${resumeData.styleSettings.primaryColor}` }}>
                    <div className="flex gap-4 items-start">
                      {resumeData.personalInfo.photoUrl && showPhotoUpload && (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0" style={{ border: `3px solid ${resumeData.styleSettings.primaryColor}` }}>
                          <Image 
                            src={resumeData.personalInfo.photoUrl} 
                            alt="Profile" 
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2" style={{ color: resumeData.styleSettings.primaryColor }}>
                          {resumeData.personalInfo.fullName || 'Your Name'}
                        </h1>
                        <div className={`${getFontSizeClass()} space-y-0.5`}>
                          {resumeData.personalInfo.email && <div>✉ {resumeData.personalInfo.email}</div>}
                          {resumeData.personalInfo.phone && <div>📱 {resumeData.personalInfo.phone}</div>}
                          {resumeData.personalInfo.location && <div>📍 {resumeData.personalInfo.location}</div>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Sections based on order */}
                  {resumeData.sectionOrder.map((section) => (
                    <div key={section.id}>
                      {renderSection(section.id)}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
