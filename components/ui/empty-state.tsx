import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    icon: LucideIcon
    title: string
    description: string
    action?: React.ReactNode
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
    ...props
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center h-full w-full min-h-[250px] space-y-4 p-8 text-center animate-in fade-in duration-500",
                className
            )}
            {...props}
        >
            <div className="relative flex items-center justify-center">
                {/* Glow effect behind icon */}
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <div className="relative rounded-full border border-primary/30 bg-background/50 p-4">
                    <Icon className="h-10 w-10 text-primary" />
                </div>
            </div>

            <div className="space-y-2 max-w-[280px]">
                <h3 className="font-mono text-lg font-semibold tracking-tight text-foreground">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground font-sans">
                    {description}
                </p>
            </div>

            {action && (
                <div className="pt-2">
                    {action}
                </div>
            )}
        </div>
    )
}
