"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Zap, 
  ShieldCheck, 
  Layers, 
  Rocket,
  ArrowRight,
  Sparkles
} from "lucide-react"
import { SectionBadge } from "./SectionBadge"

interface WhyChooseUsSectionProps {
  t: any
}

export function WhyChooseUsSection({ t }: WhyChooseUsSectionProps) {
  const features = [
    {
      title: t.landing.whyChoose.fast,
      description: t.landing.whyChoose.fastDesc,
      icon: Zap,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "group-hover:border-yellow-500/50",
    },
    {
      title: t.landing.whyChoose.secure,
      description: t.landing.whyChoose.secureDesc,
      icon: ShieldCheck,
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "group-hover:border-green-500/50",
    },
    {
      title: t.landing.whyChoose.allInOne,
      description: t.landing.whyChoose.allInOneDesc,
      icon: Layers,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "group-hover:border-blue-500/50",
    }
  ]

  return (
    <section id="why-choose" className="border-b border-border bg-muted/10">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <SectionBadge title="The Lab68 Edge" icon={Zap} />
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.landing.whyChoose.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.landing.whyChoose.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`group relative p-8 h-full flex flex-col border border-border/50 bg-card hover:bg-card/80 transition-all duration-500 hover:-translate-y-2 ${feature.border} overflow-hidden`}
              >
                {/* Decorative background glow */}
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${feature.bg}`} />
                
                <div className={`mb-6 ${feature.color}`}>
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-4 group-hover:text-foreground transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed flex-1">
                  {feature.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
                  <span>Learn more</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-20 rounded-3xl p-1 md:p-12 border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-purple-500/10 relative overflow-hidden group shadow-2xl shadow-primary/5">
            <div className="absolute inset-0 bg-grid-white/5 mask-gradient" />
            <div className="relative z-10 text-center py-8 md:py-0">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 italic tracking-tight uppercase">
                {t.landing.whyChoose.ctaTitle}
              </h3>
              <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg">
                {t.landing.whyChoose.ctaSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button asChild size="lg" className="h-14 px-10 rounded-full font-bold text-base group/btn bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95">
                  <Link href="/signup" className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    {t.landing.whyChoose.getStartedFree}
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="h-14 px-10 rounded-full font-bold text-base hover:bg-primary/10 transition-all">
                  <Link href="/#services" className="flex items-center gap-2">
                    {t.landing.whyChoose.exploreFeatures}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
