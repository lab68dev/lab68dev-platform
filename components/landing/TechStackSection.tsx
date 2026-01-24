"use client"

import Image from "next/image"

interface TechStackSectionProps {
  t: any
}

const techStack = [
  { name: "Next.js 16", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "React 19", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "TypeScript 5", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Supabase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
  { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "Tailwind CSS 4", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Socket.io", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" },
  { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Vercel", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" }
]

const poweredBy = [
  { name: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name: "Vercel", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" },
  { name: "Supabase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
  { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Socket.io", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" },
  { name: "Gmail SMTP", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300FF99'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/%3E%3C/svg%3E" },
  { name: "pnpm", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300FF99'%3E%3Cpath d='M0 0v7.5h7.5V0zm8.25 0v7.5h7.5V0zm8.25 0v7.5H24V0zM0 8.25v7.5h7.5v-7.5zm16.5 0v7.5H24v-7.5zM0 16.5V24h7.5v-7.5zm8.25 0V24h7.5v-7.5z'/%3E%3C/svg%3E" },
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
