"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle, Keyboard, MousePointerClick, Zap } from "lucide-react"

export function ResumeHelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-blue-500/10 text-gray-400 hover:text-blue-400 transition-colors">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-950 border-gray-800 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-white">Editor Guide</DialogTitle>
          <DialogDescription className="text-gray-400">
            Quick tips to help you build a professional resume.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <MousePointerClick className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-blue-200">Direct Editing</h4>
              <p className="text-sm text-gray-400">Click directly on any text in the resume preview to edit it instantly.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Keyboard className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-blue-200">Add Links</h4>
              <p className="text-sm text-gray-400">Highlight any text and press <kbd className="px-1 py-0.5 bg-gray-900 rounded text-xs border border-gray-800 font-mono text-gray-300">Ctrl + K</kbd> to insert a clickable link.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Zap className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-blue-200">Smart Formatting</h4>
              <p className="text-sm text-gray-400">The "Harvard" template is enforced for maximum ATS compatibility. No complex design choices needed.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
