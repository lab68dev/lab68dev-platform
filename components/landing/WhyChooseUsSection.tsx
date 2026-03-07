"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Zap, 
  ShieldCheck, 
  Layers, 
  Rocket,
  ArrowRight
} from "lucide-react"
import { motion } from "framer-motion"
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
      borderHover: "hover:border-yellow-400/40",
    },
    {
      title: t.landing.whyChoose.secure,
      description: t.landing.whyChoose.secureDesc,
      icon: ShieldCheck,
      color: "text-green-400",
      bg: "bg-green-400/10",
      borderHover: "hover:border-green-400/40",
    },
    {
      title: t.landing.whyChoose.allInOne,
      description: t.landing.whyChoose.allInOneDesc,
      icon: Layers,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      borderHover: "hover:border-blue-400/40",
    }
  ]

  return (
    <section id="why-choose" className="border-b border-border">
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <SectionBadge title="The Lab68 Edge" icon={Zap} />
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.landing.whyChoose.title}</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.landing.whyChoose.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`group relative p-7 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm ${feature.borderHover} hover:bg-card transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`mb-5 ${feature.color}`}>
                  <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                
                <h3 className="text-lg font-bold mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="mt-16 rounded-2xl p-8 md:p-12 border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 relative overflow-hidden"
          >
            <div className="relative z-10 text-center">
              <h3 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">
                {t.landing.whyChoose.ctaTitle}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                {t.landing.whyChoose.ctaSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="h-12 px-10 rounded-full font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
                  <Link href="/signup" className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    {t.landing.whyChoose.getStartedFree}
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="h-12 px-8 rounded-full font-medium hover:bg-primary/10 transition-all">
                  <Link href="/#services" className="flex items-center gap-2">
                    {t.landing.whyChoose.exploreFeatures}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
