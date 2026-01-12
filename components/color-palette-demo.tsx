"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Info, AlertTriangle, CheckCircle, XCircle, Sparkles } from "lucide-react"

/**
 * Color Palette Demo Component
 * Showcases the Enhanced Cyberpunk color palette
 */
export function ColorPaletteDemo() {
  return (
    <div className="space-y-6">
      {/* Accent Colors Showcase */}
      <Card className="p-6 border-border bg-card">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Enhanced Cyberpunk Palette
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Neon Green */}
          <div className="space-y-2">
            <div 
              className="h-20 border border-border flex items-center justify-center transition-all hover:shadow-[0_0_20px_var(--primary)]"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <Zap className="h-8 w-8" style={{ color: 'var(--primary-foreground)' }} />
            </div>
            <div className="text-xs">
              <div className="font-bold text-primary">Neon Green</div>
              <div className="text-muted-foreground">Primary</div>
            </div>
          </div>

          {/* Cyan */}
          <div className="space-y-2">
            <div 
              className="h-20 border border-border flex items-center justify-center transition-all hover:shadow-[0_0_20px_var(--accent-cyan)]"
              style={{ backgroundColor: 'var(--accent-cyan)' }}
            >
              <Info className="h-8 w-8" style={{ color: 'var(--background)' }} />
            </div>
            <div className="text-xs">
              <div className="font-bold" style={{ color: 'var(--accent-cyan)' }}>Electric Cyan</div>
              <div className="text-muted-foreground">Info</div>
            </div>
          </div>

          {/* Purple */}
          <div className="space-y-2">
            <div 
              className="h-20 border border-border flex items-center justify-center transition-all hover:shadow-[0_0_20px_var(--accent-purple)]"
              style={{ backgroundColor: 'var(--accent-purple)' }}
            >
              <Sparkles className="h-8 w-8" style={{ color: 'var(--background)' }} />
            </div>
            <div className="text-xs">
              <div className="font-bold" style={{ color: 'var(--accent-purple)' }}>Neon Purple</div>
              <div className="text-muted-foreground">Accent</div>
            </div>
          </div>

          {/* Pink */}
          <div className="space-y-2">
            <div 
              className="h-20 border border-border flex items-center justify-center transition-all hover:shadow-[0_0_20px_var(--accent-pink)]"
              style={{ backgroundColor: 'var(--accent-pink)' }}
            >
              <Zap className="h-8 w-8" style={{ color: 'var(--background)' }} />
            </div>
            <div className="text-xs">
              <div className="font-bold" style={{ color: 'var(--accent-pink)' }}>Neon Pink</div>
              <div className="text-muted-foreground">Highlight</div>
            </div>
          </div>

          {/* Yellow */}
          <div className="space-y-2">
            <div 
              className="h-20 border border-border flex items-center justify-center transition-all hover:shadow-[0_0_20px_var(--warning)]"
              style={{ backgroundColor: 'var(--warning)' }}
            >
              <AlertTriangle className="h-8 w-8" style={{ color: 'var(--background)' }} />
            </div>
            <div className="text-xs">
              <div className="font-bold" style={{ color: 'var(--warning)' }}>Electric Yellow</div>
              <div className="text-muted-foreground">Warning</div>
            </div>
          </div>

          {/* Red */}
          <div className="space-y-2">
            <div 
              className="h-20 border border-border flex items-center justify-center transition-all hover:shadow-[0_0_20px_var(--destructive)]"
              style={{ backgroundColor: 'var(--destructive)' }}
            >
              <XCircle className="h-8 w-8 text-destructive-foreground" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-destructive">Neon Red</div>
              <div className="text-muted-foreground">Error</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Status Badges */}
      <Card className="p-6 border-border bg-card">
        <h3 className="text-lg font-bold mb-4">Status Indicators</h3>
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2 border-0 font-medium text-sm flex items-center gap-2" style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}>
            <CheckCircle className="h-4 w-4" />
            Success
          </div>
          <div className="px-4 py-2 border-0 font-medium text-sm flex items-center gap-2" style={{ backgroundColor: 'var(--info)', color: 'var(--info-foreground)' }}>
            <Info className="h-4 w-4" />
            Info
          </div>
          <div className="px-4 py-2 border-0 font-medium text-sm flex items-center gap-2" style={{ backgroundColor: 'var(--warning)', color: 'var(--warning-foreground)' }}>
            <AlertTriangle className="h-4 w-4" />
            Warning
          </div>
          <div className="px-4 py-2 bg-destructive text-destructive-foreground border-0 font-medium text-sm flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Error
          </div>
        </div>
      </Card>

      {/* Glow Effects */}
      <Card className="p-6 border-border bg-card">
        <h3 className="text-lg font-bold mb-4">Neon Glow Effects</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button 
            className="border-0 font-bold transition-all hover:shadow-[0_0_30px_var(--primary)]" 
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            Green Glow
          </Button>
          <Button 
            className="border-0 font-bold transition-all hover:shadow-[0_0_30px_var(--accent-cyan)]" 
            style={{ backgroundColor: 'var(--accent-cyan)', color: 'var(--background)' }}
          >
            Cyan Glow
          </Button>
          <Button 
            className="border-0 font-bold transition-all hover:shadow-[0_0_30px_var(--accent-purple)]" 
            style={{ backgroundColor: 'var(--accent-purple)', color: 'var(--background)' }}
          >
            Purple Glow
          </Button>
          <Button 
            className="border-0 font-bold transition-all hover:shadow-[0_0_30px_var(--accent-pink)]" 
            style={{ backgroundColor: 'var(--accent-pink)', color: 'var(--background)' }}
          >
            Pink Glow
          </Button>
          <Button 
            className="border-0 font-bold transition-all hover:shadow-[0_0_30px_var(--warning)]" 
            style={{ backgroundColor: 'var(--warning)', color: 'var(--background)' }}
          >
            Yellow Glow
          </Button>
          <Button 
            className="bg-destructive text-destructive-foreground border-0 font-bold transition-all hover:shadow-[0_0_30px_var(--destructive)]"
          >
            Red Glow
          </Button>
        </div>
      </Card>

      {/* Gradient Backgrounds */}
      <Card className="p-6 border-border bg-card">
        <h3 className="text-lg font-bold mb-4">Cyberpunk Gradients</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className="h-32 border border-border flex items-center justify-center font-bold text-lg p-4 text-center"
            style={{ 
              background: 'linear-gradient(to bottom right, var(--accent-cyan), var(--accent-purple))',
              color: 'var(--background)'
            }}
          >
            Cyan → Purple
          </div>
          <div 
            className="h-32 border border-border flex items-center justify-center font-bold text-lg p-4 text-center"
            style={{ 
              background: 'linear-gradient(to bottom right, var(--primary), var(--accent-cyan))',
              color: 'var(--background)'
            }}
          >
            Green → Cyan
          </div>
          <div 
            className="h-32 border border-border flex items-center justify-center font-bold text-lg p-4 text-center"
            style={{ 
              background: 'linear-gradient(to bottom right, var(--accent-pink), var(--accent-purple))',
              color: 'var(--background)'
            }}
          >
            Pink → Purple
          </div>
          <div 
            className="h-32 border border-border flex items-center justify-center font-bold text-lg p-4 text-center"
            style={{ 
              background: 'linear-gradient(to right, var(--primary), var(--accent-cyan), var(--accent-purple), var(--accent-pink))',
              color: 'var(--background)'
            }}
          >
            Rainbow Cyberpunk
          </div>
        </div>
      </Card>
    </div>
  )
}
