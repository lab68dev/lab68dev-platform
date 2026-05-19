# lab68studio Platform

<p align="center">
  <img src="public/images/design-mode/lab68studio%20logo.png" alt="lab68studio" width="128" />
</p>

<p align="center">
  <strong>Open developer workspace for projects, collaboration, knowledge, files, meetings, and AI-assisted delivery.</strong>
</p>

<p align="center">
  <a href="https://github.com/lab68dev/lab68dev-platform/actions/workflows/ci.yml">
    <img alt="CI" src="https://img.shields.io/github/actions/workflow/status/lab68dev/lab68dev-platform/ci.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=CI" />
  </a>
  <a href="./LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-Apache%202.0-1f6feb?style=for-the-badge" />
  </a>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Postgres-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white" />
  <img alt="Groq" src="https://img.shields.io/badge/Groq-AI-f55036?style=for-the-badge" />
</p>

---

## Overview

`lab68studio Platform` is a modern, self-hostable developer workspace built with Next.js App Router and Supabase. It combines project execution, team collaboration, documentation, file management, planning, realtime tools, and Groq-powered AI assistance in one focused dashboard.

The product is intentionally operational: dense enough for daily work, clean enough to scan quickly, and structured for maintainable team development.

## Core Features

- **Dashboard workspace**: project counts, todos, meetings, activity, calendar, and system status.
- **Project management**: projects, Kanban, backlog, issues, labels, sprints, and collaborators.
- **Collaborator access**: invite registered users, manage project roles, and enforce owner/admin actions.
- **AI tools**: Groq-backed assistant with streaming responses and rich text rendering.
- **Knowledge and files**: wiki, file management, diagrams, whiteboard, and planning surfaces.
- **Meetings and todos**: schedule work, track tasks, and keep execution context nearby.
- **Security baseline**: Supabase auth, protected dashboard routes, rate limiting, and security headers.
- **Responsive app shell**: desktop sidebar, mobile bottom navigation, and tablet-friendly dashboard layouts.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 App Router with `proxy.ts` |
| UI | React 19, Tailwind CSS v4, Radix UI primitives, Lucide/Heroicons |
| Language | TypeScript 5.9 |
| Backend | Supabase PostgreSQL, Auth, Storage, Realtime |
| AI | AI SDK v6 with Groq provider |
| Testing | ESLint, TypeScript build, Playwright e2e |
| Package manager | npm 10 |

## Project Structure

```text
lab68dev-platform/
├── app/
│   ├── api/                    # Route handlers
│   ├── dashboard/              # Authenticated product workspace
│   ├── login/                  # Auth entry
│   └── signup/                 # Account creation
├── components/
│   ├── dashboard/              # Dashboard shell and widgets
│   ├── landing/                # Marketing/landing sections
│   ├── ui/                     # Shared primitives
│   └── ai/                     # AI chat presentation components
├── lib/
│   ├── database/               # Supabase clients and shared data access
│   ├── features/               # Feature-level operations
│   ├── middleware/             # Auth, API guard, rate limit, headers
│   └── services/               # Client services and project workflows
├── e2e/                        # Playwright specs
├── proxy.ts                    # Next.js 16 proxy middleware
└── package.json
```

## Getting Started

### Requirements

- Node.js 20+
- npm 10+
- Supabase project
- Groq API key for AI tools

### Install

```bash
git clone https://github.com/lab68dev/lab68dev-platform.git
cd lab68dev-platform
npm install
```

### Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

GROQ_API_KEY=your_groq_api_key

# Optional
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_USE_SUPABASE_BACKEND=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EMAIL_API_URL=
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Next.js dev server with Webpack |
| `npm run dev:turbo` | Start the local dev server with Turbopack |
| `npm run build` | Create a production build and run TypeScript checks |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint across TS/TSX/JS/JSX files |
| `npm run test:e2e` | Run Playwright e2e tests |
| `npm run test:e2e:ui` | Open Playwright UI mode |

## Production Notes

- Keep Supabase RLS policies aligned with project ownership and collaborator roles.
- Keep `proxy.ts` as the source of dashboard route protection and auth redirects.
- Use server-only Supabase clients only inside route handlers, server components, or server actions.
- Run `npm run build` before deploying; it is the current typecheck gate.
- Add new dashboard routes to sidebar, global search, and mobile navigation only when the feature is production-ready.

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before opening a pull request.

Recommended flow:

```bash
git checkout -b feat/your-change
npm run build
npm run lint
```

Use focused PRs, keep UI changes consistent with the dashboard design language, and avoid unrelated refactors.

## License

Apache-2.0. See [LICENSE](./LICENSE).
