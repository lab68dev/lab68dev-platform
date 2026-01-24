"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BoltIcon, ShieldCheckIcon, CheckCircleIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'

interface WhyChooseUsSectionProps {
  t: any
}

export function WhyChooseUsSection({ t }: WhyChooseUsSectionProps) {
  return (
    <section className="border-b border-border">
      <div className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose Lab68?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built by developers, for developers. Experience the difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                <BoltIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Built on Next.js with optimized performance. Real-time updates and instant page loads for seamless workflow.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                <ShieldCheckIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security with JWT authentication, bcrypt encryption, and role-based access control.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                <CheckCircleIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">All-in-One Platform</h3>
              <p className="text-muted-foreground">
                Everything you need in one place. No more switching between multiple tools and losing your flow.
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-20 p-12 border border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Workflow?</h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the Lab68 community and experience the future of collaborative development.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="group hover:shadow-xl hover:shadow-primary/50 transition-all">
                  <Link href="/signup" className="flex items-center gap-2">
                    <RocketLaunchIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    Get Started Free
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-foreground/20">
                  <Link href="/#services">Explore Features</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
