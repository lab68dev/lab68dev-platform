"use client"

import { useLanguage } from "@/lib/config"
import CardNav, { CardNavItem } from "@/components/CardNav"
import { HeroSection } from "./HeroSection"
import { MissionSection } from "./MissionSection"
import { TechStackSection } from "./TechStackSection"
import { ServicesSection } from "./ServicesSection"
import { WhyChooseUsSection } from "./WhyChooseUsSection"
import { TeamSection } from "./TeamSection"
import { SponsorSection } from "./SponsorSection"
import { Footer } from "@/components/footer"

const navItems: CardNavItem[] = [
  {
    label: "Platform",
    bgColor: "oklch(0.08 0 0)", // matches --card
    textColor: "oklch(1 0 0)", // white
    links: [
      { label: "Features", href: "#services", ariaLabel: "Platform Features" },
      { label: "Tech Stack", href: "#stack", ariaLabel: "Technology Stack" },
      { label: "Sponsor", href: "#sponsor", ariaLabel: "Sponsor the Project" }
    ]
  },
  {
    label: "Community",
    bgColor: "oklch(0.12 0 0)", // slightly lighter than card
    textColor: "oklch(1 0 0)",
    links: [
      { label: "GitHub", href: "https://github.com/lab68dev", ariaLabel: "GitHub Profile" },
      { label: "Instagram", href: "https://www.instagram.com/lab68dev/", ariaLabel: "Join Discord" },
      { label: "Youtube", href: "https://www.youtube.com/@lab68dev", ariaLabel: "Community Discussions" }
    ]
  },
  {
    label: "About",
    bgColor: "oklch(0.16 0 0)", // even lighter
    textColor: "oklch(1 0 0)",
    links: [
      { label: "Mission", href: "#mission", ariaLabel: "Our Mission" },
      { label: "Team", href: "#founder", ariaLabel: "Meet the Team" },
      { label: "Contact", href: "mailto:lab68dev@gmail.com", ariaLabel: "Contact Us" }
    ]
  }
];

export function LandingClient() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      <div className="relative z-10">
        <CardNav 
          logo="/images/design-mode/lab68dev_logo.png"
          logoAlt="Lab68Dev"
          items={navItems}
          baseColor="var(--background)" 
          menuColor="var(--foreground)"
          buttonBgColor="var(--primary)"
          buttonTextColor="var(--primary-foreground)"
        />

        <HeroSection t={t} />
        <MissionSection t={t} />
        <TechStackSection t={t} />
        <ServicesSection t={t} />
        <WhyChooseUsSection t={t} />
        <TeamSection t={t} />
        <SponsorSection t={t} />
        
        <Footer />
      </div>
    </div>
  )
}
