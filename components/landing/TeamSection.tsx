"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { SectionBadge } from "./SectionBadge"

interface TeamSectionProps {
  t: any
}

export function TeamSection({ t }: TeamSectionProps) {
  return (
    <section id="founder" className="border-b border-border bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <SectionBadge title={t.landing.team.title} icon={Users} />
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.landing.team.title}</h2>
            <p className="text-lg text-muted-foreground">
              Dedicated to building powerful tools for developers and teams
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Founder */}
            <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 bg-card hover:shadow-xl hover:shadow-primary/10">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="flex-shrink-0 group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-white group-hover:border-primary/40 transition-all group-hover:scale-105">
                    <Image
                      src="/images/logos/fdag.jpg"
                      alt="F4P1E - Duong Phu Dong"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">F4P1E (Duong Phu Dong)</h3>
                  <p className="text-primary font-medium mb-4">Founder & Lead Developer</p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Creator of Lab68 Dev Platform. Passionate about building tools that enhance productivity, streamline workflows, and foster innovation.
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <Button asChild variant="default" className="hover:shadow-lg hover:shadow-primary/50 transition-all">
                      <Link href="https://github.com/DongDuong2001" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 justify-center">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        GitHub Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* co-founder */}
            <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 bg-card hover:shadow-xl hover:shadow-primary/10">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="flex-shrink-0 group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-white group-hover:border-primary/40 transition-all group-hover:scale-105">
                    <Image
                      src="/images/logos/mtthu.jpg"
                      alt="mthutt"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">mthutt</h3>
                  <p className="text-primary font-medium mb-4">Co-Founder & Assistant</p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Supporting the vision and development of Lab68 Platform. Committed to creating innovative solutions for the developer community.
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <Button asChild variant="default" className="hover:shadow-lg hover:shadow-primary/50 transition-all">
                      <Link href="https://github.com/mthutt" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 justify-center">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        GitHub Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Repository Link */}
          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg" className="border-foreground/20">
              <Link href="https://github.com/lab68dev/lab68dev-platform" target="_blank" rel="noopener noreferrer">
                {t.landing.team.viewRepo}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
