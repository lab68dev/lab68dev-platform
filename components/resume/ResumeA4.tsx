"use client"

import React from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Eye, EyeOff, GripVertical } from "lucide-react"
import { InlineInput } from "./InlineFields"
import { RichInput } from "./RichInput"
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

const formatDate = (dateStr: string) => {
  if (!dateStr) return ""
  const [year, month] = dateStr.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parseInt(month) - 1]}, ${year}`
}

export function ResumeA4({
  editorRef,
  resumeData,
  setResumeData,
  selectedTemplate,
  zoomLevel,
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

    // Harvard Classes (Enforced)
    const hTitleClass = "text-sm font-bold uppercase tracking-wider border-b border-black mb-2 mt-4 text-black"
    const hSubTitleClass = "font-bold text-sm text-black"
    const standardFontSize = resumeData.styleSettings.fontSize // e.g. "12"
    const fontSizeStyle = { fontSize: isNaN(Number(standardFontSize)) ? undefined : `${standardFontSize}pt` }
    const contentClass = isNaN(Number(standardFontSize)) ? getFontSizeClass() : "" 

    switch (sectionId) {
      case 'summary':
        return (
          <div className="mb-6 relative group/sec text-black">
            <h2 className={hTitleClass}>
              Professional Summary
            </h2>
            <RichInput
              value={resumeData.summary}
              onChange={(val: string) => setResumeData({...resumeData, summary: val})}
              placeholder="Enter your professional summary..."
              className={contentClass}
              style={fontSizeStyle}
              multiline
            />
          </div>
        )
      
      case 'experience':
        return (
          <div className="mb-6 relative group/sec text-black">
            <h2 className={hTitleClass}>
              Experience
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
                      className={hSubTitleClass}
                      style={fontSizeStyle}
                    />
                    <InlineInput
                      value={exp.position}
                      onChange={(val: string) => updateExperience(exp.id, 'position', val)}
                      placeholder="Position"
                      className="text-sm block italic"
                      style={fontSizeStyle}
                    />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-0.5" style={fontSizeStyle}>
                      <div className="relative">
                        <input type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="bg-transparent border-none text-xs w-[72px] focus:ring-0 p-0 h-auto text-right text-black print:hidden" />
                        <span className="hidden print:inline text-xs text-black">{formatDate(exp.startDate)}</span>
                      </div>
                      <span className="text-black">-</span>
                      {exp.current ? (
                        <span className="text-black text-xs font-medium ml-1">Present</span>
                      ) : (
                        <div className="relative">
                          <input type="month" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} className="bg-transparent border-none text-xs w-[72px] focus:ring-0 p-0 h-auto text-right text-black print:hidden" />
                          <span className="hidden print:inline text-xs text-black">{formatDate(exp.endDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <RichInput
                  value={exp.description}
                  onChange={(val: string) => updateExperience(exp.id, 'description', val)}
                  placeholder="Experience description..."
                  className={`text-sm leading-snug ${contentClass}`}
                  style={fontSizeStyle}
                  multiline
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
            <h2 className={hTitleClass}>
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
                    <InlineInput value={edu.school} onChange={(val: string) => updateEducation(edu.id, 'school', val)} placeholder="School" className={hSubTitleClass} style={fontSizeStyle} />
                    <div className="flex items-center gap-1">
                      <div className="flex-1">
                        <InlineInput 
                          value={edu.degree} 
                          onChange={(val: string) => updateEducation(edu.id, 'degree', val)} 
                          placeholder="Bachelor's Degree in (Major)" 
                          className="w-full italic" 
                          style={fontSizeStyle}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-black">
                    <div className="flex items-center gap-0.5 opacity-80" style={fontSizeStyle}>
                      <div className="relative">
                        <input type="month" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} className="bg-transparent border-none text-xs w-[72px] focus:ring-0 p-0 h-auto text-right text-black print:hidden" />
                        <span className="hidden print:inline text-xs text-black">{formatDate(edu.startDate)}</span>
                      </div>
                      <span>-</span>
                      {edu.current ? (
                        <span className="text-xs font-medium ml-1">Present</span>
                      ) : (
                        <div className="relative">
                          <input type="month" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} className="bg-transparent border-none text-xs w-[72px] focus:ring-0 p-0 h-auto text-right text-black print:hidden" />
                          <span className="hidden print:inline text-xs text-black">{formatDate(edu.endDate)}</span>
                        </div>
                      )}
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
          <div className="mb-4 relative group/sec text-black">
            <h2 className={hTitleClass}>
              Technical Skills
            </h2>
            <div className="flex flex-col gap-1">
              {resumeData.skills.map((skill) => (
                <div key={skill.id} className={`flex items-baseline gap-2 group/item ${contentClass}`} style={fontSizeStyle}>
                  <div className="min-w-[140px] font-bold text-sm shrink-0">
                    <InlineInput 
                      value={skill.category || ''} 
                      onChange={(val: string) => updateSkill(skill.id, 'category', val)} 
                      placeholder="Category" 
                      className="font-bold text-black"
                    />:
                  </div>
                  <div className="flex-1 relative">
                    <RichInput 
                      value={skill.items || ''} 
                      onChange={(val: string) => updateSkill(skill.id, 'items', val)} 
                      placeholder="Java, Python, C++..." 
                      className="text-black" 
                    />
                    <div className="absolute -right-6 top-0 opacity-0 group-hover/item:opacity-100 transition-opacity flex gap-1 no-print">
                      <Button size="icon" variant="ghost" className="h-4 w-4 text-red-500" onClick={() => removeSkill(skill.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={addSkill} className="w-full border-dashed border-2 opacity-0 group-hover/sec:opacity-100 transition-opacity mt-2 h-8 text-xs no-print text-black">
              <Plus className="h-3 w-3 mr-1" /> Add Category
            </Button>
          </div>
        )

      case 'certifications':
        return (
          <div className="mb-6 relative group/sec text-black">
            <h2 className={hTitleClass}>
              Certifications
            </h2>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className={`flex items-center gap-2 group/item ${contentClass}`} style={fontSizeStyle}>
                  <RichInput
                    value={cert}
                    onChange={(val: string) => updateCertification(index, val)}
                    placeholder="Certification name"
                    className="flex-1 min-w-[150px] text-black"
                  />
                  <Button size="icon" variant="ghost" className="h-4 w-4 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity no-print" onClick={() => removeCertification(index)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  {index < resumeData.certifications.length - 1 && <span className="opacity-50">•</span>}
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
           <div className="mb-8 pb-2 text-center border-b-2 border-black text-black">
            <InlineInput
              value={resumeData.personalInfo.fullName}
              onChange={(val: string) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, fullName: val}})}
              placeholder="Your Name"
              className="text-3xl font-extrabold uppercase tracking-tighter mb-2 text-center w-full text-black"
            />
            <div className="text-[11px] flex flex-wrap justify-center gap-x-3 text-black font-medium">
              <RichInput
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
               <span className="opacity-40 text-black">•</span>
              <RichInput
                value={resumeData.personalInfo.linkedin}
                onChange={(val: string) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, linkedin: val}})}
                placeholder="LinkedIn"
                className="w-auto min-w-[120px] text-black"
              />
            </div>
          </div>

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
