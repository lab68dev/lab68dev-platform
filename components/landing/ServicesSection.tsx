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
import { Sparkles, Layers } from "lucide-react"
import { SectionBadge } from "./SectionBadge"
import PixelCard from "@/components/PixelCard"

interface ServicesSectionProps {
  t: any
}

export function ServicesSection({ t }: ServicesSectionProps) {
  const services = [
    {
      variant: "blue",
      icon: ClipboardDocumentListIcon,
      colorClass: "text-sky-400",
      bgClass: "bg-sky-400/10",
      hoverBgClass: "group-hover:bg-sky-400/20",
      title: t.landing.services.projectManagement,
      description: t.landing.services.projectManagementDesc
    },
    {
      variant: "pink",
      icon: LightBulbIcon,
      colorClass: "text-pink-500",
      bgClass: "bg-pink-500/10",
      hoverBgClass: "group-hover:bg-pink-500/20",
      title: t.landing.services.aiAssistant,
      description: t.landing.services.aiAssistantDesc
    },
    {
      variant: "yellow",
      icon: UserGroupIcon,
      colorClass: "text-yellow-400",
      bgClass: "bg-yellow-400/10",
      hoverBgClass: "group-hover:bg-yellow-400/20",
      title: t.landing.services.collaboration,
      description: t.landing.services.collaborationDesc
    },
    {
      variant: "default",
      icon: FolderIcon,
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
      hoverBgClass: "group-hover:bg-primary/20",
      title: t.landing.services.fileManagement,
      description: t.landing.services.fileManagementDesc
    },
    {
      variant: "blue",
      icon: PresentationChartLineIcon,
      colorClass: "text-sky-400",
      bgClass: "bg-sky-400/10",
      hoverBgClass: "group-hover:bg-sky-400/20",
      title: t.landing.services.diagrams,
      description: t.landing.services.diagramsDesc
    },
    {
      variant: "pink",
      icon: DocumentTextIcon,
      colorClass: "text-pink-500",
      bgClass: "bg-pink-500/10",
      hoverBgClass: "group-hover:bg-pink-500/20",
      title: t.landing.services.resumeEditor,
      description: t.landing.services.resumeEditorDesc
    },
    {
      variant: "yellow",
      icon: FaceSmileIcon,
      colorClass: "text-yellow-400",
      bgClass: "bg-yellow-400/10",
      hoverBgClass: "group-hover:bg-yellow-400/20",
      title: t.landing.services.gamesHub,
      description: t.landing.services.gamesHubDesc
    },
    {
      variant: "default",
      icon: BookOpenIcon,
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
      hoverBgClass: "group-hover:bg-primary/20",
      title: t.landing.services.wiki,
      description: t.landing.services.wikiDesc
    },
    {
      variant: "blue",
      icon: CalendarIcon,
      colorClass: "text-sky-400",
      bgClass: "bg-sky-400/10",
      hoverBgClass: "group-hover:bg-sky-400/20",
      title: t.landing.services.meetingPlanning,
      description: t.landing.services.meetingPlanningDesc
    },
    {
      variant: "pink",
      icon: ChatBubbleLeftRightIcon,
      colorClass: "text-pink-500",
      bgClass: "bg-pink-500/10",
      hoverBgClass: "group-hover:bg-pink-500/20",
      title: t.landing.services.liveSupport,
      description: t.landing.services.liveSupportDesc
    }
  ]

  return (
    <section id="services" className="border-b border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <SectionBadge title={t.landing.services.badge} icon={Layers} />
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.landing.services.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.landing.services.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <PixelCard key={index} variant={service.variant as any} className="w-full h-full min-h-[300px] border border-border/50 bg-card p-0">
                <div className="p-8 h-full flex flex-col relative z-20 pointer-events-none">
                  <div className={`mb-6 ${service.colorClass}`}>
                    <div className={`w-14 h-14 rounded-lg ${service.bgClass} flex items-center justify-center ${service.hoverBgClass} group-hover:scale-110 transition-all`}>
                      <service.icon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className={`text-xl font-bold mb-3 group-hover:${service.colorClass} transition-colors`}>{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <div className={`mt-4 flex items-center gap-2 text-sm ${service.colorClass} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <span>Learn more</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>
              </PixelCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
