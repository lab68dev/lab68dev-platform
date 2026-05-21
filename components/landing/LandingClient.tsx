import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  Code2,
  FileText,
  Folders,
  Github,
  GitPullRequest,
  LayoutDashboard,
  Lock,
  MessageSquare,
  Network,
  PanelRight,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

const logoSrc = "/images/design-mode/lab68studio logo.png"

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Workflow", href: "#workflow" },
  { label: "Stack", href: "#stack" },
]

const metrics = [
  { value: "14+", label: "workspace tools" },
  { value: "100%", label: "open source" },
  { value: "Next 16", label: "modern app stack" },
]

const boardColumns = [
  {
    title: "Backlog",
    accent: "bg-zinc-500",
    tasks: ["Clarify auth states", "Write onboarding copy", "Map data model"],
  },
  {
    title: "In progress",
    accent: "bg-[#ff7a00]",
    tasks: ["Ship project dashboard", "Review issue filters", "Wire AI summary"],
  },
  {
    title: "Review",
    accent: "bg-emerald-400",
    tasks: ["Security headers", "Mobile QA pass", "Release notes"],
  },
]

const modules = [
  {
    icon: LayoutDashboard,
    title: "Project command center",
    description: "Kanban, backlog, sprint planning, issues, milestones, and team context in one view.",
  },
  {
    icon: BookOpen,
    title: "Knowledge base",
    description: "Docs, wiki pages, files, diagrams, and notes stay close to the work they explain.",
  },
  {
    icon: Sparkles,
    title: "AI-assisted flow",
    description: "Summarize blockers, draft documents, create task briefs, and keep momentum moving.",
  },
  {
    icon: Users,
    title: "Team collaboration",
    description: "Comments, chat, shared project spaces, and realtime updates for distributed teams.",
  },
]

const workflowSteps = [
  {
    icon: GitPullRequest,
    title: "Plan",
    description: "Turn goals into epics, tasks, sprints, and clear ownership.",
  },
  {
    icon: FileText,
    title: "Document",
    description: "Capture decisions, specs, diagrams, and project references.",
  },
  {
    icon: MessageSquare,
    title: "Coordinate",
    description: "Keep discussion, feedback, and team updates in context.",
  },
  {
    icon: Rocket,
    title: "Ship",
    description: "Track progress, reduce tool switching, and close the loop.",
  },
]

const stack = [
  { name: "Next.js 16", logo: "/icons/brands/nextdotjs.svg" },
  { name: "React 19", logo: "/icons/brands/react.svg" },
  { name: "TypeScript", logo: "/icons/brands/typescript.svg" },
  { name: "Supabase", logo: "/icons/brands/supabase.svg" },
  { name: "PostgreSQL", logo: "/icons/brands/postgresql.svg" },
  { name: "Tailwind CSS", logo: "/icons/brands/tailwind-css.svg" },
]

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <div className="overflow-hidden rounded-[8px] border border-white/12 bg-[#0b0b0b] shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
        <div className="flex h-12 items-center justify-between border-b border-white/10 bg-[#111111] px-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff7a00]" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            </div>
            <span className="hidden text-xs font-medium text-zinc-300 sm:inline">lab68studio / workspace</span>
          </div>
          <div className="hidden items-center gap-2 rounded-[6px] border border-white/10 bg-black px-3 py-1.5 text-xs text-zinc-400 sm:flex">
            <Search className="h-3.5 w-3.5" />
            Search projects, docs, files
          </div>
        </div>

        <div className="grid min-h-[500px] lg:grid-cols-[220px_1fr_280px]">
          <aside className="hidden border-r border-white/10 bg-[#080808] p-4 lg:block">
            <div className="mb-6 flex items-center gap-3">
              <Image src={logoSrc} alt="" width={34} height={34} className="rounded-[6px]" />
              <div>
                <div className="text-sm font-bold text-white">Launch Room</div>
                <div className="text-xs text-zinc-300">Product team</div>
              </div>
            </div>

            <div className="space-y-1">
              {[
                { icon: LayoutDashboard, label: "Dashboard", active: true },
                { icon: GitPullRequest, label: "Projects" },
                { icon: BookOpen, label: "Wiki" },
                { icon: Network, label: "Diagrams" },
                { icon: Folders, label: "Files" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 rounded-[6px] px-3 py-2 text-sm ${
                    item.active ? "bg-[#ff7a00] text-black" : "text-zinc-400"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              ))}
            </div>
          </aside>

          <div className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-[6px] border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Production workspace
                </div>
                <h2 className="text-xl font-black text-white sm:text-2xl">Q2 Platform Sprint</h2>
                <p className="mt-1 text-sm text-zinc-300">Plan, document, and ship from the same surface.</p>
              </div>
              <div className="grid grid-cols-3 overflow-hidden rounded-[8px] border border-white/10 bg-black">
                {metrics.map((metric) => (
                  <div key={metric.label} className="border-r border-white/10 px-3 py-3 last:border-r-0">
                    <div className="text-sm font-black text-white">{metric.value}</div>
                    <div className="mt-1 text-[10px] uppercase text-zinc-400">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {boardColumns.map((column) => (
                <section key={column.title} className="rounded-[8px] border border-white/10 bg-[#101010] p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${column.accent}`} />
                      <h3 className="text-sm font-bold text-zinc-200">{column.title}</h3>
                    </div>
                    <span className="text-xs text-zinc-400">{column.tasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {column.tasks.map((task, index) => (
                      <div key={task} className="rounded-[6px] border border-white/10 bg-black p-3">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <p className="text-sm font-medium leading-5 text-zinc-200">{task}</p>
                          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                        </div>
                        <div className="flex items-center justify-between text-xs text-zinc-400">
                          <span>LAB-{index + 24}</span>
                          <span>{index === 0 ? "High" : "Normal"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>

          <aside className="border-t border-white/10 bg-[#080808] p-4 lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Project intelligence</h3>
              <Sparkles className="h-4 w-4 text-[#ff7a00]" />
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-[8px] border border-[#ff7a00]/20 bg-[#ff7a00]/10 p-4">
                <div className="mb-2 text-xs font-semibold uppercase text-[#ffb36b]">AI brief</div>
                <p className="text-sm leading-6 text-zinc-200">
                  Two blockers need owner review. Auth docs and mobile QA are ready for final pass.
                </p>
              </div>
              <div className="rounded-[8px] border border-white/10 bg-black p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-zinc-200">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Guardrails
                </div>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    Supabase auth flow
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    Security headers
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    TypeScript strict
                  </li>
                </ul>
              </div>
              <div className="rounded-[8px] border border-white/10 bg-black p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-zinc-200">
                  <BarChart3 className="h-4 w-4 text-cyan-300" />
                  Focus score
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full w-[78%] rounded-full bg-[#ff7a00]" />
                </div>
                <p className="mt-3 text-xs text-zinc-400">Less context switching across planning, docs, and collaboration.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export function LandingClient() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="lab68studio home">
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[8px] border border-white/15 bg-black">
              <Image src={logoSrc} alt="lab68studio logo" fill sizes="40px" className="object-cover" priority />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-bold leading-none tracking-normal text-white">lab68studio</span>
              <span className="mt-1 block text-xs leading-none text-zinc-300">Developer workspace</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden text-zinc-300 hover:bg-white/10 hover:text-white sm:inline-flex">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm" className="rounded-[6px] border-[#ff7a00] bg-[#ff7a00] px-4 font-bold text-black hover:bg-[#ff932e]">
              <Link href="/signup">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px]"
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#211307]/60 to-transparent" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:py-24">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-[999px] border border-[#ff7a00]/35 bg-black/60 px-3 py-1.5 text-xs font-semibold text-[#ffb36b] shadow-[0_0_0_1px_rgba(255,122,0,0.08)]">
                <Lock className="h-3.5 w-3.5" />
                Open-source workspace for serious product teams
              </div>

              <h1 className="text-5xl font-black leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
                Build, document, and ship from one focused workspace.
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                lab68studio brings project planning, docs, files, diagrams, collaboration, and AI support into one practical developer platform.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 w-full rounded-[6px] border-[#ff7a00] bg-[#ff7a00] px-7 font-bold text-black hover:bg-[#ff932e] sm:w-auto">
                  <Link href="/signup">
                    Start building
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 w-full rounded-[6px] border-white/15 bg-black/40 px-7 text-white hover:bg-white hover:text-black sm:w-auto">
                  <Link href="https://github.com/lab68dev/lab68dev-platform" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    View GitHub
                  </Link>
                </Button>
              </div>

              <div className="mt-10 flex flex-col items-center gap-5">
                <div className="flex w-full max-w-[860px] flex-col items-center justify-center gap-3 md:flex-row md:flex-wrap md:items-stretch md:justify-center">
                  <a
                    href="https://forg.to/products/lab68studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-16 w-64 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-white/10 bg-white/5 px-2 transition-colors hover:border-[#ff7a00]/40"
                    aria-label="Upvote lab68studio on Forg"
                  >
                    <img
                      src="https://forg.to/api/badges/upvote/lab68studio?theme=dark&shape=rounded"
                      alt="lab68studio - Upvote on Forg"
                      width="256"
                      height="64"
                      className="h-16 w-64 object-contain"
                    />
                  </a>

                  <a
                    href="https://unikorn.vn/p/lab68studio?ref=embed-lab68studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-16 w-64 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-white/10 bg-white px-2 transition-colors hover:border-[#ff7a00]/40"
                    aria-label="View lab68studio on Unikorn.vn"
                  >
                    <img
                      src="https://unikorn.vn/api/widgets/badge/lab68studio?theme=light"
                      alt="lab68studio trên Unikorn.vn"
                      width="256"
                      height="64"
                      className="h-16 w-64 object-contain"
                    />
                  </a>

                  <a
                    href="https://www.producthunt.com/products/lab68studio?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-lab68studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-16 w-64 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-white/10 bg-white/5 px-2 transition-colors hover:border-[#ff7a00]/40"
                    aria-label="View lab68studio on Product Hunt"
                  >
                    <img
                      src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1152387&theme=dark&t=1779355389680"
                      alt="lab68studio - Build, document, and ship from one focused workspace. | Product Hunt"
                      width="256"
                      height="64"
                      className="h-16 w-64 object-contain"
                    />
                  </a>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Achievement</p>
                  <a
                    href="https://unikorn.vn/p/lab68studio?ref=embed-lab68studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-16 w-64 items-center justify-center overflow-hidden rounded-[8px] border border-[#ff7a00]/20 bg-[#120b04] px-2 shadow-[0_12px_30px_rgba(255,122,0,0.08)] transition-colors hover:border-[#ff7a00]/40"
                    aria-label="View lab68studio daily rank on Unikorn.vn"
                  >
                    <img
                      src="https://unikorn.vn/api/widgets/badge/lab68studio/rank?theme=light&type=daily"
                      alt="lab68studio - Hàng ngày"
                      width="256"
                      height="64"
                      className="h-16 w-64 object-contain"
                    />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <ProductPreview />
            </div>
          </div>
        </section>

        <section id="product" className="border-b border-white/10 bg-[#080808]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <p className="text-sm font-bold uppercase text-[#ff7a00]">Product scope</p>
                <h2 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-normal text-white md:text-4xl">
                  The useful parts of a developer operating system, without the noise.
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
                Use it as the place where planning, knowledge, assets, collaboration, and AI assistance stay connected to the software delivery loop.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {modules.map((module) => (
                <article key={module.title} className="rounded-[8px] border border-white/10 bg-black p-5 transition-colors hover:border-[#ff7a00]/45">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-white/10 bg-[#121212] text-[#ff7a00]">
                    <module.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-white">{module.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">{module.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="border-b border-white/10 bg-[#050505]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase text-cyan-300">Workflow</p>
                <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal text-white md:text-4xl">
                  One loop from idea to shipped work.
                </h2>
              </div>
              <Button asChild variant="outline" className="w-full rounded-[6px] border-white/15 bg-transparent text-white hover:bg-white hover:text-black sm:w-auto">
                <Link href="/login">
                  Open workspace
                  <PanelRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              {workflowSteps.map((step, index) => (
                <article key={step.title} className="relative rounded-[8px] border border-white/10 bg-[#0d0d0d] p-5">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#ff7a00] text-black">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-zinc-400">0{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="stack" className="border-b border-white/10 bg-[#080808]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase text-emerald-300">Engineering base</p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal text-white md:text-4xl">
                Built on a stack contributors already understand.
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400 md:text-base">
                Next.js, React, TypeScript, Supabase, PostgreSQL, and Tailwind keep the platform familiar, portable, and maintainable.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {stack.map((tech) => (
                <div key={tech.name} className="flex items-center gap-3 rounded-[8px] border border-white/10 bg-black p-4">
                  <Image src={tech.logo} alt={tech.name} width={30} height={30} unoptimized className="h-7 w-7 object-contain" />
                  <span className="text-sm font-bold text-zinc-200">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <div className="overflow-hidden rounded-[8px] border border-[#ff7a00]/30 bg-[#120b04]">
              <div className="grid gap-8 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
                <div>
                  <p className="mb-3 text-sm font-bold uppercase text-[#ffb36b]">Ready when you are</p>
                  <h2 className="text-3xl font-black leading-tight tracking-normal text-white">
                    Start with a workspace that keeps the team close to the work.
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
                    Practical by design, open by default, and shaped for developer teams that care about shipping.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="rounded-[6px] border-[#ff7a00] bg-[#ff7a00] font-bold text-black hover:bg-[#ff932e]">
                    <Link href="/signup">
                      Create account
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-[6px] border-white/15 bg-black/30 text-white hover:bg-white hover:text-black">
                    <Link href="https://github.com/lab68dev/lab68dev-platform" target="_blank" rel="noopener noreferrer">
                      <Code2 className="h-4 w-4" />
                      Source code
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
