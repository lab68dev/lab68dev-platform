"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Coffee, Github, Heart } from "lucide-react"

interface SponsorSectionProps {
  t: any
}

// Custom PayPal 'P' Component
const PayPalIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.729C5.074 2.857 5.8 2.2 6.643 2.2h8.048c4.352 0 6.666 2.15 6.134 5.75-.41 2.766-2.071 4.398-4.57 5.068-1.545.414-3.14.364-4.664.364h-1.282c-.443 0-.825.297-.914.746l-.997 4.904c-.035.174-.11.328-.21.455a.692.692 0 0 1-.506.25l-.006-.001z" />
  </svg>
)

export function SponsorSection({ t }: SponsorSectionProps) {
  const sponsors = [
    {
      title: t.landing.sponsor.buyMeCoffee,
      description: t.landing.sponsor.buyMeCoffeeDesc,
      icon: Coffee,
      href: "https://www.buymeacoffee.com/lab68dev",
      colorClass: "text-yellow-400",
      bgClass: "bg-yellow-400/10",
      borderColor: "group-hover:border-yellow-500/50",
    },
    {
      title: t.landing.sponsor.paypal,
      description: t.landing.sponsor.paypalDesc,
      icon: PayPalIcon,
      href: "https://paypal.me/DDuong884",
      colorClass: "text-blue-500",
      bgClass: "bg-blue-500/10",
      borderColor: "group-hover:border-blue-500/50",
    },
    {
      title: t.landing.sponsor.githubSponsors,
      description: t.landing.sponsor.githubSponsorsDesc,
      icon: Github,
      href: "https://github.com/sponsors/lab68dev",
      colorClass: "text-pink-500",
      bgClass: "bg-pink-500/10",
      borderColor: "group-hover:border-pink-500/50",
    }
  ]

  return (
    <section id="sponsor" className="border-b border-border bg-muted/30">
      <div className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/50 bg-primary/10 mb-6">
              <Heart className="h-5 w-5 text-primary fill-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">{t.landing.sponsor.badge}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.landing.sponsor.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.landing.sponsor.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sponsors.map((sponsor, index) => (
              <Card key={index} className={`group relative h-full flex flex-col border border-border/50 bg-card hover:bg-card/80 transition-all duration-300 ${sponsor.borderColor}`}>
                 <div className="p-8 flex flex-col h-full">
                  <div className={`mb-6 ${sponsor.colorClass}`}>
                    <div className={`w-14 h-14 rounded-xl ${sponsor.bgClass} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                      <sponsor.icon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-foreground">
                    {sponsor.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed flex-1">
                    {sponsor.description}
                  </p>
                  <div className="mt-8">
                    <Button asChild variant="outline" className="w-full transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Link href={sponsor.href} target="_blank" rel="noopener noreferrer">
                        Support Now
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
