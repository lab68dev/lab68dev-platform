"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Save, Download, Loader2, Palette, Type } from "lucide-react"
import { Template, StyleSettings, ResumeData } from "@/lib/types/resume"

interface ResumeToolbarProps {
  resumeTitle: string
  setResumeTitle: (val: string) => void
  isSaving: boolean
  handleSave: () => void
  isDownloading: boolean
  handleDownload: () => void
  templates: any[]
  selectedTemplate: Template
  setSelectedTemplate: (val: Template) => void
  resumeData: ResumeData
  setResumeData: (val: ResumeData) => void
  fontOptions: any[]
}

export function ResumeToolbar({
  resumeTitle,
  setResumeTitle,
  isSaving,
  handleSave,
  isDownloading,
  handleDownload,
  templates,
  selectedTemplate,
  setSelectedTemplate,
  resumeData,
  setResumeData,
  fontOptions
}: ResumeToolbarProps) {
  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Input
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              className="h-8 w-full md:w-64 text-sm font-semibold"
              placeholder="Resume Title"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving} className="flex-1 md:flex-none">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
            <Button size="sm" onClick={handleDownload} disabled={isDownloading} className="flex-1 md:flex-none">
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-4">
        <Card className="p-3 shadow-lg bg-card/95 backdrop-blur border-primary/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex p-1 bg-muted rounded-xl overflow-x-auto scrollbar-hide w-full lg:w-auto">
              {templates.map(t => (
                <button
                  key={t.value}
                  onClick={() => setSelectedTemplate(t.value)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-200 ${
                    selectedTemplate === t.value 
                      ? 'bg-background text-primary shadow-sm ring-1 ring-black/5' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-black/5'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-6 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6 w-full lg:w-auto justify-center lg:justify-end">
              <div className="flex items-center gap-2 group">
                <div className="p-1.5 rounded-md group-hover:bg-accent transition-colors">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="relative w-8 h-8 rounded-full border-2 border-background shadow-inner cursor-pointer overflow-hidden ring-1 ring-border">
                  <input
                    type="color"
                    value={resumeData.styleSettings.primaryColor}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      styleSettings: { ...resumeData.styleSettings, primaryColor: e.target.value }
                    })}
                    className="absolute inset-0 w-full h-full scale-150 cursor-pointer border-none p-0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 group">
                <div className="p-1.5 rounded-md group-hover:bg-accent transition-colors">
                  <Type className="h-4 w-4 text-muted-foreground" />
                </div>
                <select
                  value={resumeData.styleSettings.fontFamily}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    styleSettings: { ...resumeData.styleSettings, fontFamily: e.target.value }
                  })}
                  className="bg-transparent text-sm font-medium border-none focus:ring-0 cursor-pointer hover:text-primary transition-colors"
                >
                  {fontOptions.map(font => (
                    <option key={font.value} value={font.value} className="bg-card text-foreground">{font.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex bg-muted rounded-lg p-1 ring-1 ring-black/5">
                {(['small', 'medium', 'large'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setResumeData({
                      ...resumeData,
                      styleSettings: { ...resumeData.styleSettings, fontSize: size }
                    })}
                    className={`px-3 py-1 text-[10px] uppercase font-bold rounded-md transition-all ${
                      resumeData.styleSettings.fontSize === size 
                        ? 'bg-background text-primary shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {size[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
