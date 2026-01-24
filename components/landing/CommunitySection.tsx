"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CommunitySectionProps {
  t: any
}

export function CommunitySection({ t }: CommunitySectionProps) {
  return (
    <section id="community" className="border-b border-border bg-muted/30">
      <div className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-balance">{t.landing.community.title}</h2>
          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">{t.landing.community.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="w-full sm:w-auto hover:shadow-lg hover:shadow-primary/50 transition-all">
              <Link href="https://github.com/lab68dev" target="_blank">
                Visit our GitHub
              </Link>
            </Button>
          </div>
          <div className="pt-8">
            <p className="text-sm font-medium mb-4">Stay updated with our latest developments:</p>
            <div className="flex gap-2">
              <Input type="email" placeholder="your@email.com" className="max-w-sm bg-card border-border" />
              <Button
                variant="outline"
                className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background bg-transparent"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
