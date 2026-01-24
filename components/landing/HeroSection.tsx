"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SparklesIcon, RocketLaunchIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import PixelBlast from "@/components/PixelBlast"
import RotatingText from "@/components/RotatingText"

interface HeroSectionProps {
  t: any
}

export function HeroSection({ t }: HeroSectionProps) {
  return (
    <section className="flex-1 border-b border-border relative overflow-hidden">
      {/* PixelBlast Background Animation - Hero Section Only */}
      <div className="absolute inset-0 z-0">
        <PixelBlast
          color="#4d3b3b"
          patternDensity={1.2}
          speed={0.8}
          rippleIntensityScale={1.2}
        />
      </div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <div className="mb-12 animate-fade-in">
            <Image
              src="/images/design-mode/lab68dev_logo.png"
              alt="Lab68dev"
              width={400}
              height={200}
              className="mx-auto hover:scale-105 transition-transform duration-300 rounded-2xl"
            />
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/50 bg-primary/10 mb-6 animate-fade-in-up">
            <SparklesIcon className="h-5 w-5 text-primary animate-spin-slow" />
            <span className="text-sm font-medium text-primary">Next-Gen Collaboration Platform</span>
          </div>
          

          <div className="flex justify-center items-center w-full mb-4">
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance animate-fade-in-up flex items-center justify-center gap-3">
              <RotatingText
                texts={['Think', 'Code', 'Test', 'Ship']}
                mainClassName="px-2 sm:px-2 md:px-3 bg-primary text-primary-foreground overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-300">
            {t.landing.hero.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in-up delay-500">
            <Button asChild size="lg" className="w-full sm:w-auto group hover:shadow-lg hover:shadow-primary/50 transition-all">
              <Link href="/login" className="flex items-center gap-2">
                {t.landing.hero.cta}
                <RocketLaunchIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-foreground/20 text-foreground hover:bg-foreground hover:text-background bg-transparent group"
            >
              <Link href="/#projects" className="flex items-center gap-2">
                {t.nav.projects}
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto animate-fade-in-up delay-700">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10+</div>
              <div className="text-sm text-muted-foreground">Features</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Open Source</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
