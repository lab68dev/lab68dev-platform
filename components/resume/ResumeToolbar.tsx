"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Save, Download, Loader2, Type, FileText } from "lucide-react"
import { ResumeData } from "@/lib/types/resume"
import { FontSelector } from "./FontSelector"
import { ResumeHelpDialog } from "./ResumeHelpDialog"

interface ResumeToolbarProps {
  resumeTitle: string
  setResumeTitle: (val: string) => void
  isSaving: boolean
  handleSave: () => void
  isDownloading: boolean
  handleDownload: () => void
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
  resumeData,
  setResumeData,
  fontOptions
}: ResumeToolbarProps) {
  return (
    <div className="sticky top-6 z-50 px-4 mb-8 print:hidden">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gray-950/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 rounded-2xl p-2.5 pr-3 flex items-center justify-between gap-4 ring-1 ring-white/5 transition-all hover:bg-gray-950/95 hover:shadow-blue-900/10">
          
          {/* Group 1: File Info */}
          <div className="flex items-center gap-3 pl-2">
            <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
               <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-0.5">Filename</span>
              <Input
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="h-6 w-40 md:w-52 bg-transparent border-none shadow-none focus-visible:ring-0 font-semibold text-base px-0 p-0 text-gray-200 placeholder:text-gray-700 focus:text-blue-400 transition-colors"
                placeholder="Untitled Resume"
              />
            </div>
          </div>

          <div className="h-10 w-[1px] bg-white/10 mx-2 hidden md:block" />

          {/* Group 2: Editor Tools */}
          <div className="hidden md:flex items-center gap-2 bg-gray-900/50 p-1.5 rounded-xl border border-white/5">
             <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                       <FontSelector
                        value={resumeData.styleSettings.fontFamily}
                        onChange={(val) => setResumeData({
                          ...resumeData,
                          styleSettings: { ...resumeData.styleSettings, fontFamily: val }
                        })}
                        fonts={fontOptions}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 border-gray-800 text-gray-300">Change Font</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="w-[1px] h-6 bg-white/10 mx-1" />

              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                     <div className="flex items-center bg-gray-950 rounded-lg px-2 h-9 border border-white/10 shadow-sm focus-within:ring-1 focus-within:ring-blue-500/50 transition-all hover:border-white/20">
                        <Type className="h-4 w-4 text-gray-500 mr-2" />
                        <Input
                            type="number"
                            value={resumeData.styleSettings.fontSize.replace('pt', '')}
                            onChange={(e) => setResumeData({
                              ...resumeData,
                              styleSettings: { ...resumeData.styleSettings, fontSize: e.target.value } 
                            })}
                            className="w-10 h-full p-0 bg-transparent border-none text-sm font-medium text-center focus-visible:ring-0 appearance-none text-gray-300"
                            min={8}
                            max={24}
                        />
                        <span className="text-[10px] font-medium text-gray-600 ml-1 select-none">pt</span>
                     </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 border-gray-800 text-gray-300">Font Size</TooltipContent>
                </Tooltip>
              </TooltipProvider>
          </div>

          {/* Group 3: Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <ResumeHelpDialog />
            
            <div className="w-2" />

            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleSave} disabled={isSaving} className="rounded-xl h-10 w-10 bg-transparent border-white/10 text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">
                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 border-gray-800 text-gray-300">Save Progress</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    onClick={handleDownload} 
                    disabled={isDownloading} 
                    className="rounded-xl px-5 h-10 font-semibold shadow-lg shadow-blue-500/10 bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 border-gray-800 text-gray-300">Export to PDF</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
