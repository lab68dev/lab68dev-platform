"use client"

import { 
  ClipboardDocumentListIcon, 
  LightBulbIcon, 
  UserGroupIcon, 
  FolderIcon, 
  PresentationChartLineIcon, 
  DocumentTextIcon, 
  FaceSmileIcon, 
  BookOpenIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { Layers } from "lucide-react"
import { motion } from "framer-motion"
import { SectionBadge } from "./SectionBadge"

interface ServicesSectionProps {
  t: any
}

export function ServicesSection({ t }: ServicesSectionProps) {
  const services = [
    {
      icon: ClipboardDocumentListIcon,
      colorClass: "text-sky-400",
      bgClass: "bg-sky-400/10",
      borderHover: "hover:border-sky-400/40",
      title: t.landing.services.projectManagement,
      description: t.landing.services.projectManagementDesc
    },
    {
      icon: LightBulbIcon,
      colorClass: "text-pink-500",
      bgClass: "bg-pink-500/10",
      borderHover: "hover:border-pink-500/40",
      title: t.landing.services.aiAssistant,
      description: t.landing.services.aiAssistantDesc
    },
    {
      icon: UserGroupIcon,
      colorClass: "text-yellow-400",
      bgClass: "bg-yellow-400/10",
      borderHover: "hover:border-yellow-400/40",
      title: t.landing.services.collaboration,
      description: t.landing.services.collaborationDesc
    },
    {
      icon: FolderIcon,
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
      borderHover: "hover:border-primary/40",
      title: t.landing.services.fileManagement,
      description: t.landing.services.fileManagementDesc
    },
    {
      icon: PresentationChartLineIcon,
      colorClass: "text-sky-400",
      bgClass: "bg-sky-400/10",
      borderHover: "hover:border-sky-400/40",
      title: t.landing.services.diagrams,
      description: t.landing.services.diagramsDesc
    },
    {
      icon: DocumentTextIcon,
      colorClass: "text-pink-500",
      bgClass: "bg-pink-500/10",
      borderHover: "hover:border-pink-500/40",
      title: t.landing.services.resumeEditor,
      description: t.landing.services.resumeEditorDesc
    },
    {
      icon: FaceSmileIcon,
      colorClass: "text-yellow-400",
      bgClass: "bg-yellow-400/10",
      borderHover: "hover:border-yellow-400/40",
      title: t.landing.services.gamesHub,
      description: t.landing.services.gamesHubDesc
    },
    {
      icon: BookOpenIcon,
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
      borderHover: "hover:border-primary/40",
      title: t.landing.services.wiki,
      description: t.landing.services.wikiDesc
    },
    {
      icon: CalendarIcon,
      colorClass: "text-sky-400",
      bgClass: "bg-sky-400/10",
      borderHover: "hover:border-sky-400/40",
      title: t.landing.services.meetingPlanning,
      description: t.landing.services.meetingPlanningDesc
    },
    {
      icon: ChatBubbleLeftRightIcon,
      colorClass: "text-pink-500",
      bgClass: "bg-pink-500/10",
      borderHover: "hover:border-pink-500/40",
      title: t.landing.services.liveSupport,
      description: t.landing.services.liveSupportDesc
    }
  ]

  return (
    <section id="services" className="border-b border-border">
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <SectionBadge title={t.landing.services.badge} icon={Layers} />
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.landing.services.title}</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.landing.services.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`group relative p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm ${service.borderHover} hover:bg-card transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-11 h-11 rounded-lg ${service.bgClass} flex items-center justify-center group-hover:scale-110 transition-transform ${service.colorClass}`}>
                    <service.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold mb-1 group-hover:text-foreground transition-colors leading-tight">{service.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
