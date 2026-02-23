# Lab68 Developer Platform

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E)](https://supabase.com/)
[![Sponsor](https://img.shields.io/badge/%E2%99%A5_Sponsor-Support_Us-fe8184)](https://github.com/sponsors/lab68dev)

**Lab68 Developer Platform** is a premium, open-source collaborative workspace engineered for modern teams. Featuring a striking, high-contrast Cyberpunk/Brutalist aesthetic, it unifies project management, documentation, and team communications into a single, blazing-fast interface. Built on **Next.js 16** with the App Router and powered by **Supabase**.

---

## Highlights

- **Instant Passwordless Auth** – Seamlessly magic login without passwords or typical email-link delays. Our deterministic authentication layer secures accounts effortlessly upon email entry.
- **Premium Dual-Typography** – Optimized readability utilizing `IBM Plex Sans` for long-form prose and `JetBrains Mono` for data and code.
- **Next.js 16 Proxy Architecture** – Utilizing the brand-new `proxy.ts` routing convention for sub-millisecond route guarding.
- **Supabase Backend** – PostgreSQL database with Row-Level Security (RLS) and real-time subscriptons.
- **Productivity Suite** – Integrated Kanban boards, intelligent AI developer tools, and an interactive meeting scheduler.
- **Dynamic Empty States** – Every view is curated; even empty dashboards feel alive with beautifully designed glowing call-to-action widgets.

---

## Tech Stack

| Layer | Details |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router & `proxy.ts`) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Database | [Supabase](https://supabase.com/) PostgreSQL + Edge Functions |
| Authentication | Deterministic Email-Only Identity (Instant Auth) |
| AI Models | Local Ollama Integration for zero-cost RAG |
| Styling | Tailwind CSS V4 + Lucide Icons + Custom UI Primitives |
| Package Manager | pnpm 8+ |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Installation

```bash
git clone https://github.com/lab68dev/lab68dev-platform.git
cd lab68dev-platform
pnpm install
```

### Quick Setup

1. **Database**: Spin up a free Supabase project and execute our SQL migrations in the SQL Editor.
2. **Environment**: We use an instant-auth mechanism that depends on the Supabase URL. Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Development

Boot the application:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the platform.

---

## Repository Structure

```text
lab68dev-platform/
├── app/                      # Next.js 16 App Router maps
│   └── dashboard/            # Cyberpunk Dashboard views
│       ├── projects/         # Kanban & Issues
│       ├── ai-tools/         # Local Ollama AI Assistant
│       ├── meeting/          # Scheduler & Reminders
│       └── ...
├── components/               # 
│   ├── dashboard/            # Complex Dashboard Assemblies 
│   └── ui/                   # Reusable Tailwind Primitives via Radix
├── lib/                      # Core domain logic (auth context, database)
├── proxy.ts                  # Next.js 16 Route Interception & Hydration
└── tailwind.config.ts        # Theme tokens
```

---

## Contributing

We heavily encourage community pull requests to enhance the platform. Please read our newly updated [CONTRIBUTING.md](./CONTRIBUTING.md) for specifics on local environments, the instant auth requirement, and our strict dual-typography standards.

1. **Fork & Branch**: Create a feature branch (`feat/amazing-dashboard-widget`).
2. **Code Style**: Ensure you are utilizing our `<EmptyState />` UI component where data arrays are empty. 
3. **Commit**: Use [Conventional Commits](https://www.conventionalcommits.org/).
4. **Pull Request**: Open a PR against `main`.

Please adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md).

---

## Support & Feedback

- GitHub Issues: [lab68dev-platform/issues](https://github.com/lab68dev/lab68dev-platform/issues)
- Maintainers: [@DongDuong2001](https://github.com/DongDuong2001)
- Scrum Master: [@mthutt](https://github.com/mthutt)
