"use client"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ProgressIndicatorProps {
  progress?: number // 0-100
  message?: string
  variant?: "linear" | "circular" | "dots"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ProgressIndicator({
  progress,
  message,
  variant = "linear",
  size = "md",
  className = "",
}: ProgressIndicatorProps) {
  if (variant === "circular") {
    return <CircularProgress progress={progress} message={message} size={size} className={className} />
  }

  if (variant === "dots") {
    return <DotsProgress message={message} size={size} className={className} />
  }

  return <LinearProgress progress={progress} message={message} size={size} className={className} />
}

function LinearProgress({
  progress,
  message,
  size,
  className,
}: ProgressIndicatorProps) {
  const heights = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  return (
    <div className={cn("w-full space-y-2", className)}>
      {message && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{message}</span>
          {progress !== undefined && (
            <span className="font-medium">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      <div className={cn("w-full bg-muted overflow-hidden", heights[size || "md"])}>
        <div
          className={cn(
            "h-full bg-primary transition-all duration-300 ease-out",
            progress === undefined && "animate-pulse"
          )}
          style={{
            width: progress !== undefined ? `${progress}%` : "100%",
          }}
        />
      </div>
    </div>
  )
}

function CircularProgress({
  progress,
  message,
  size,
  className,
}: ProgressIndicatorProps) {
  const sizes = {
    sm: 32,
    md: 48,
    lg: 64,
  }

  const sizeValue = sizes[size || "md"]
  const strokeWidth = sizeValue / 8
  const radius = (sizeValue - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = progress !== undefined
    ? circumference - (progress / 100) * circumference
    : 0

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative" style={{ width: sizeValue, height: sizeValue }}>
        {/* Background circle */}
        <svg
          className="transform -rotate-90"
          width={sizeValue}
          height={sizeValue}
        >
          <circle
            cx={sizeValue / 2}
            cy={sizeValue / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-muted"
          />
          <circle
            cx={sizeValue / 2}
            cy={sizeValue / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn(
              "text-primary transition-all duration-300",
              progress === undefined && "animate-spin"
            )}
          />
        </svg>
        {progress !== undefined && (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
            {Math.round(progress)}%
          </div>
        )}
      </div>
      {message && <p className="text-sm text-muted-foreground text-center">{message}</p>}
    </div>
  )
}

function DotsProgress({ message, size, className }: ProgressIndicatorProps) {
  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  }

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full bg-primary animate-pulse",
              dotSizes[size || "md"]
            )}
            style={{
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
      {message && <p className="text-sm text-muted-foreground text-center">{message}</p>}
    </div>
  )
}

// Inline usage component for file uploads, etc.
export function UploadProgress({ fileName, progress }: { fileName: string; progress: number }) {
  return (
    <div className="border border-border bg-card p-3 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="truncate flex-1 mr-2">{fileName}</span>
        <span className="font-medium text-primary">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-1.5 bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
