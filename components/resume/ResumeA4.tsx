"use client"

import React from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Eye, EyeOff, GripVertical, Camera } from "lucide-react"
import { InlineInput, InlineTextarea } from "./InlineFields"
import { ResumeData, Template, SectionType, Experience, Education, Skill } from "@/lib/types/resume"

interface ResumeA4Props {
  editorRef: React.RefObject<HTMLDivElement>
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
  selectedTemplate: Template
  zoomLevel: number
  showPhotoUpload: boolean
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  toggleSectionVisibility: (id: SectionType) => void
  handleDragStart: (id: SectionType) => void
  handleDragOver: (e: React.DragEvent, id: SectionType) => void
  handleDragEnd: () => void
  updateExperience: (id: string, field: keyof Experience, value: any) => void
  removeExperience: (id: string) => void
  addExperience: () => void
  updateEducation: (id: string, field: keyof Education, value: any) => void
  removeEducation: (id: string) => void
  addEducation: () => void
  updateSkill: (id: string, field: keyof Skill, value: any) => void
  removeSkill: (id: string) => void
  addSkill: () => void
  updateCertification: (index: number, val: string) => void
  removeCertification: (index: number) => void
  addCertification: () => void
  getFontSizeClass: () => string
}

export function ResumeA4({
  editorRef,
  resumeData,
  setResumeData,
  selectedTemplate,
  zoomLevel,
  showPhotoUpload,
  handlePhotoUpload,
  toggleSectionVisibility,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  updateExperience,
  removeExperience,
  addExperience,
  updateEducation,
  removeEducation,
  addEducation,
  updateSkill,
  removeSkill,
  addSkill,
  updateCertification,
  removeCertification,
  addCertification,
  getFontSizeClass
}: ResumeA4Props) {

  const renderSection = (sectionId: SectionType) => {
    const section = resumeData.sectionOrder.find(s => s.id === sectionId)
    if (!section?.visible) return null

    // Shared Harvard Classes
    const isHarvard = selectedTemplate === 'harvard'
    const hTitleClass = "text-sm font-bold uppercase tracking-wider border-b border-black mb-2 mt-4 text-black"
    const hSubTitleClass = "font-bold text-sm text-black"

    switch (sectionId) {
      case 'summary':
        return (
          <div className="mb-6 relative group/sec text-black">
            <h2 className={isHarvard ? hTitleClass : "text-xl font-bold mb-2"} style={isHarvard ? {} : { color: resumeData.styleSettings.primaryColor, borderColor: resumeData.styleSettings.primaryColor }}>
              Professional Summary
            </h2>
            <InlineTextarea
              value={resumeData.summary}
              onChange={(val: string) => setResumeData({...resumeData, summary: val})}
              placeholder="Enter your professional summary..."
              className={getFontSizeClass()}
            />
          </div>
        )
      
      case 'experience':
        return (
          <div className="mb-6 relative group/sec text-black">
            <h2 className={isHarvard ? hTitleClass : "text-xl font-bold mb-3"} style={isHarvard ? {} : { color: resumeData.styleSettings.primaryColor }}>
              {isHarvard ? "Experience" : "Work Experience"}
            </h2>
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="mb-4 relative group/item">
                <div className="absolute -left-8 top-0 opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col gap-1 no-print">
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={() => removeExperience(exp.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <InlineInput
                      value={exp.company}
                      onChange={(val: string) => updateExperience(exp.id, 'company', val)}
                      placeholder="Company"
                      className={isHarvard ? hSubTitleClass : "font-bold text-lg w-full"}
                    />
                    <InlineInput
                      value={exp.position}
                      onChange={(val: string) => updateExperience(exp.id, 'position', val)}
                      placeholder="Position"
                      className={isHarvard ? "text-sm block italic" : `${getFontSizeClass()} font-medium w-full`}
                    />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className={`${getFontSizeClass()} px-3 py-1 rounded flex items-center gap-1`} style={isHarvard ? {} : { backgroundColor: `${resumeData.styleSettings.primaryColor}20`, color: resumeData.styleSettings.primaryColor }}>
                      <input type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className={`bg-transparent border-none text-xs w-24 focus:ring-0 p-0 h-auto ${isHarvard ? 'text-right' : ''}`} />
                      <span>-</span>
                      {exp.current ? 'Present' : <input type="month" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} className={`bg-transparent border-none text-xs w-24 focus:ring-0 p-0 h-auto ${isHarvard ? 'text-right' : ''}`} />}
                    </div>
                  </div>
                </div>
                <InlineTextarea
                  value={exp.description}
                  onChange={(val: string) => updateExperience(exp.id, 'description', val)}
                  placeholder="Experience description..."
                  className={isHarvard ? "text-sm leading-snug" : getFontSizeClass()}
                />
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={addExperience} className="w-full border-dashed border-2 opacity-0 group-hover/sec:opacity-100 transition-opacity mt-2 h-8 text-xs no-print text-black">
              <Plus className="h-3 w-3 mr-1" /> Add Experience
            </Button>
          </div>
        )
      
      case 'education':
        return (
          <div className="mb-6 relative group/sec text-black">
            <h2 className={isHarvard ? hTitleClass : "text-xl font-bold mb-3"} style={isHarvard ? {} : { color: resumeData.styleSettings.primaryColor }}>
              Education
            </h2>
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="mb-3 relative group/item">
                <div className="absolute -left-8 top-0 opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col gap-1 no-print">
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={() => removeEducation(edu.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex justify-between items-start">
                   <div className="flex-1">
                    <InlineInput value={edu.school} onChange={(val: string) => updateEducation(edu.id, 'school', val)} placeholder="School" className={isHarvard ? hSubTitleClass : "font-bold w-full"} />
                    <div className="flex items-center gap-1">
                      <InlineInput value={edu.degree} onChange={(val: string) => updateEducation(edu.id, 'degree', val)} placeholder="Degree" className="w-auto" />
                      <span>in</span>
                      <InlineInput value={edu.field} onChange={(val: string) => updateEducation(edu.id, 'field', val)} placeholder="Field of Study" className="flex-1" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-black">
                    <div className={`${getFontSizeClass()} flex items-center gap-1 opacity-80`}>
                      <input type="month" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} className="bg-transparent border-none text-xs w-24 focus:ring-0 p-0 h-auto text-right" />
                      <span>-</span>
                      {edu.current ? 'Present' : <input type="month" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} className="bg-transparent border-none text-xs w-24 focus:ring-0 p-0 h-auto text-right" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={addEducation} className="w-full border-dashed border-2 opacity-0 group-hover/sec:opacity-100 transition-opacity mt-2 h-8 text-xs no-print text-black">
              <Plus className="h-3 w-3 mr-1" /> Add Education
            </Button>
          </div>
        )
      
      case 'skills':
        return (
          <div className="mb-6 relative group/sec text-black">
            <h2 className={isHarvard ? hTitleClass : "text-xl font-bold mb-3"} style={isHarvard ? {} : { color: resumeData.styleSettings.primaryColor }}>
              {isHarvard ? "Skills & Interests" : "Skills"}
            </h2>
            <div className={isHarvard ? "flex flex-wrap gap-x-3 gap-y-1" : "grid grid-cols-2 gap-x-4 gap-y-2"}>
              {resumeData.skills.map((skill, index) => (
                <div key={skill.id} className={`flex items-center gap-2 group/item ${getFontSizeClass()}`}>
                  {isHarvard && <span className="font-bold">{index === 0 ? "Technical Skills: " : ""}</span>}
                  <InlineInput value={skill.name} onChange={(val: string) => updateSkill(skill.id, 'name', val)} placeholder="Skill" className="font-medium flex-1 text-black" />
                  {!isHarvard && (
                     <select
                        value={skill.level}
                        onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                        className="bg-transparent border-none text-[10px] opacity-70 focus:ring-0 p-0 h-auto cursor-pointer hover:opacity-100 text-black no-print"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Expert</option>
                      </select>
                  )}
                  <Button size="icon" variant="ghost" className="h-4 w-4 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity no-print" onClick={() => removeSkill(skill.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  {isHarvard && index < resumeData.skills.length - 1 && <span className="opacity-50">,</span>}
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={addSkill} className="w-full border-dashed border-2 opacity-0 group-hover/sec:opacity-100 transition-opacity mt-2 h-8 text-xs no-print text-black text-black">
              <Plus className="h-3 w-3 mr-1" /> Add Skill
            </Button>
          </div>
        )

      case 'certifications':
        return (
          <div className="mb-6 relative group/sec text-black">
            <h2 className={isHarvard ? hTitleClass : "text-xl font-bold mb-3"} style={isHarvard ? {} : { color: resumeData.styleSettings.primaryColor }}>
              Certifications
            </h2>
            <div className={isHarvard ? "flex flex-wrap gap-x-2 gap-y-1" : "space-y-1"}>
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className={`flex items-center gap-2 group/item ${getFontSizeClass()}`}>
                   {!isHarvard && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: resumeData.styleSettings.primaryColor }} />}
                  <InlineInput
                    value={cert}
                    onChange={(val: string) => updateCertification(index, val)}
                    placeholder="Certification name"
                    className="flex-1 min-w-[150px] text-black"
                  />
                  <Button size="icon" variant="ghost" className="h-4 w-4 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity no-print" onClick={() => removeCertification(index)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  {isHarvard && index < resumeData.certifications.length - 1 && <span className="opacity-50">•</span>}
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={addCertification} className="w-full border-dashed border-2 opacity-0 group-hover/sec:opacity-100 transition-opacity mt-2 h-8 text-xs no-print text-black">
              <Plus className="h-3 w-3 mr-1" /> Add Certification
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div 
      className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300 ring-1 ring-black/5"
      style={{
        width: '210mm',
        minHeight: '297mm',
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'top center',
        marginBottom: `-${(1 - zoomLevel) * 297}mm`
      }}
    >
      <Card className="p-0 border-0 rounded-none h-full min-h-[297mm] bg-white text-black" ref={editorRef}>
        <div 
          className="text-black h-full p-[15mm] md:p-[20mm]"
          style={{ fontFamily: resumeData.styleSettings.fontFamily }}
        >
          {/* Header */}
          {selectedTemplate === 'harvard' ? (
             <div className="mb-8 pb-2 text-center border-b-2 border-black text-black">
              <InlineInput
                value={resumeData.personalInfo.fullName}
                onChange={(val: string) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, fullName: val}})}
                placeholder="Your Name"
                className="text-3xl font-extrabold uppercase tracking-tighter mb-2 text-center w-full text-black"
              />
              <div className="text-[11px] flex flex-wrap justify-center gap-x-3 text-black font-medium">
                <InlineInput
                  value={resumeData.personalInfo.email}
                  onChange={(val: string) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, email: val}})}
                  placeholder="Email"
                  className="w-auto min-w-[120px] text-black"
                />
                <span className="opacity-40 text-black">•</span>
                <InlineInput
                  value={resumeData.personalInfo.phone}
                  onChange={(val: string) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, phone: val}})}
                  placeholder="Phone"
                  className="w-auto min-w-[100px] text-black"
                />
                <span className="opacity-40 text-black">•</span>
                <InlineInput
                  value={resumeData.personalInfo.location}
                  onChange={(val: string) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, location: val}})}
                  placeholder="Location"
                  className="w-auto min-w-[120px] text-black"
                />
              </div>
            </div>
          ) : (
             <div className="mb-10 pb-6 text-black" style={{ borderBottom: `2px solid ${resumeData.styleSettings.primaryColor}` }}>
              <div className="flex gap-8 items-start">
                {showPhotoUpload && (
                  <div className={`relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 group cursor-pointer ring-4 ring-offset-2 ring-primary/20 ${!resumeData.personalInfo.photoUrl ? 'no-print' : ''}`} style={{ border: `4px solid ${resumeData.styleSettings.primaryColor}` }}>
                    {resumeData.personalInfo.photoUrl ? (
                      <>
                        <Image 
                          src={resumeData.personalInfo.photoUrl} 
                          alt="Profile" 
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 no-print">
                          <Label htmlFor="photo-change" className="cursor-pointer text-white text-[10px] font-bold uppercase tracking-wider p-2 hover:text-primary transition-colors">Change</Label>
                          <button onClick={() => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, photoUrl: ''}})} className="text-red-400 text-[10px] font-bold uppercase tracking-wider p-2 hover:text-red-300">Remove</button>
                        </div>
                      </>
                    ) : (
                      <Label htmlFor="photo-upload" className="absolute inset-0 flex flex-col items-center justify-center bg-muted hover:bg-muted/80 transition-colors cursor-pointer text-muted-foreground group no-print">
                        <Camera className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase">Add Photo</span>
                      </Label>
                    )}
                    <input id="photo-change" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </div>
                )}
                <div className="flex-1 space-y-4">
                  <InlineInput
                    value={resumeData.personalInfo.fullName}
                    onChange={(val: string) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, fullName: val}})}
                    placeholder="Your Name"
                    style={{ color: resumeData.styleSettings.primaryColor }}
                    className="text-4xl font-black tracking-tight mb-2 w-full"
                  />
                  <div className={`${getFontSizeClass()} grid grid-cols-2 gap-x-6 gap-y-2 text-black font-medium`}>
                    <div className="flex items-center gap-2 hover:text-primary transition-colors">
                      <span className="opacity-50 text-[10px] uppercase font-bold tracking-widest">Email</span>
                      <InlineInput value={resumeData.personalInfo.email} onChange={(val: string) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, email: val}})} placeholder="Email" className="flex-1 text-black" />
                    </div>
                     <div className="flex items-center gap-2 hover:text-primary transition-colors">
                      <span className="opacity-50 text-[10px] uppercase font-bold tracking-widest">Phone</span>
                      <InlineInput value={resumeData.personalInfo.phone} onChange={(val: string) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, phone: val}})} placeholder="Phone" className="flex-1 text-black" />
                    </div>
                     <div className="flex items-center gap-2 hover:text-primary transition-colors">
                      <span className="opacity-50 text-[10px] uppercase font-bold tracking-widest">Location</span>
                      <InlineInput value={resumeData.personalInfo.location} onChange={(val: string) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, location: val}})} placeholder="Location" className="flex-1 text-black" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sections */}
          <div className="space-y-8">
            {resumeData.sectionOrder.map((section) => (
              <div key={section.id} className="relative group/section-wrap">
                <div className="absolute -left-12 top-0 bottom-0 w-10 opacity-0 group-hover/section-wrap:opacity-100 transition-opacity flex flex-col items-center gap-2 pt-1 no-print">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary"
                    onClick={() => toggleSectionVisibility(section.id)}
                  >
                    {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary cursor-grab active:cursor-grabbing text-black"
                    draggable
                    onDragStart={() => handleDragStart(section.id)}
                    onDragOver={(e) => handleDragOver(e, section.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <GripVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className={section.visible ? "opacity-100" : "opacity-20 pointer-events-none grayscale"}>
                  {renderSection(section.id)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
