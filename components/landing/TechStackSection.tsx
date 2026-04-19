"use client"

import Image from "next/image"

interface TechStackSectionProps {
  t: any
}

const techStack = [
  { name: "Next.js 16", logo: "/icons/brands/nextdotjs.svg" },
  { name: "React 19", logo: "/icons/brands/react.svg" },
  { name: "TypeScript 5", logo: "/icons/brands/typescript.svg" },
  { name: "Supabase", logo: "/icons/brands/supabase.svg" },
  { name: "PostgreSQL", logo: "/icons/brands/postgresql.svg" },
  { name: "Tailwind CSS 4", logo: "/icons/brands/tailwind-css.svg" },
  { name: "Node.js", logo: "/icons/brands/nodedotjs.svg" },
  { name: "Vercel", logo: "/icons/brands/vercel.svg" },
]

const poweredBy = [
  { name: "GitHub", logo: "/icons/brands/github.svg" },
  { name: "Vercel", logo: "/icons/brands/vercel.svg" },
  { name: "Supabase", logo: "/icons/brands/supabase.svg" },
  { name: "PostgreSQL", logo: "/icons/brands/postgresql.svg" },
  { name: "Node.js", logo: "/icons/brands/nodedotjs.svg" },
  { name: "Gmail SMTP", logo: "/icons/brands/gmail.svg" },
  { name: "npm", logo: "/icons/brands/npm.svg" },
]

export function TechStackSection({ t }: TechStackSectionProps) {
  return (
    <>
      <section id="stack" className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance text-center">{t.landing.techStack.title}</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Built with modern, production-ready technologies for performance, scalability, and privacy
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {techStack.map((tech) => (
                <div 
                  key={tech.name} 
                  className="border border-border/50 p-6 hover:border-primary hover:bg-card transition-all duration-300 flex flex-col items-center justify-center gap-3 group hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                >
                  <div className="relative w-16 h-16">
                    <Image
                      src={tech.logo}
                      alt={tech.name}
                      width={64}
                      height={64}
                      unoptimized
                      className="object-contain group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <p className="text-sm font-medium text-center group-hover:text-primary transition-colors">{tech.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h3 className="text-2xl font-bold text-center mb-8">Powered By</h3>
            <div className="relative overflow-hidden">
              <div className="flex animate-scroll">
                {[...poweredBy, ...poweredBy].map((tech, index) => (
                  <div
                    key={`${tech.name}-${index}`}
                    className="flex-shrink-0 mx-8 flex flex-col items-center justify-center"
                  >
                    <div className="h-16 w-16 flex items-center justify-center mb-2">
                      <Image
                        src={tech.logo}
                        alt={tech.name}
                        width={64}
                        height={64}
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm font-medium text-center whitespace-nowrap">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
