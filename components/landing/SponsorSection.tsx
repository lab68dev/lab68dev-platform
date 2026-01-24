"use client"

interface SponsorSectionProps {
  t: any
}

export function SponsorSection({ t }: SponsorSectionProps) {
  return (
    <section id="sponsor" className="border-b border-border bg-muted/30">
      <div className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/50 bg-primary/10 mb-6">
              <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className="text-sm font-medium text-primary">Support Our Work</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.landing.sponsor.title}</h2>
          </div>
        </div>
      </div>
    </section>
  )
}
