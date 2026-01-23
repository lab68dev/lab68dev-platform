"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  stagger?: number
  animationType?: "fade" | "slide" | "scale" | "rotate"
}

export function SplitText({
  text,
  className = "",
  delay = 0,
  duration = 0.6,
  stagger = 0.03,
  animationType = "slide",
}: SplitTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const charsRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const chars = charsRef.current.filter(Boolean) as HTMLSpanElement[]
    if (chars.length === 0) return

    // Set initial state based on animation type
    const getInitialProps = () => {
      switch (animationType) {
        case "fade":
          return { opacity: 0 }
        case "slide":
          return { opacity: 0, y: 50 }
        case "scale":
          return { opacity: 0, scale: 0 }
        case "rotate":
          return { opacity: 0, rotateX: -90, y: 20 }
        default:
          return { opacity: 0, y: 50 }
      }
    }

    const getFinalProps = () => {
      switch (animationType) {
        case "fade":
          return { opacity: 1 }
        case "slide":
          return { opacity: 1, y: 0 }
        case "scale":
          return { opacity: 1, scale: 1 }
        case "rotate":
          return { opacity: 1, rotateX: 0, y: 0 }
        default:
          return { opacity: 1, y: 0 }
      }
    }

    // Set initial state
    gsap.set(chars, getInitialProps())

    // Animate
    gsap.to(chars, {
      ...getFinalProps(),
      duration,
      stagger: {
        each: stagger,
        from: "start",
      },
      delay,
      ease: "power3.out",
    })

    // Cleanup
    return () => {
      gsap.killTweensOf(chars)
    }
  }, [text, delay, duration, stagger, animationType])

  // Split text into characters, preserving spaces
  const characters = text.split("")

  return (
    <span ref={containerRef} className={`inline-block ${className}`} style={{ perspective: "1000px" }}>
      {characters.map((char, index) => (
        <span
          key={`${char}-${index}`}
          ref={(el) => {
            charsRef.current[index] = el
          }}
          className="inline-block"
          style={{
            display: char === " " ? "inline" : "inline-block",
            whiteSpace: char === " " ? "pre" : "normal",
            transformStyle: "preserve-3d",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  )
}
