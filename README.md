# Lab68 Dev Platform

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/lab68dev/lab68dev-platform)
[![Version](https://img.shields.io/github/package-json/v/F4P1E/lab68dev-platform?style=for-the-badge)](https://github.com/F4P1E/lab68dev-platform)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/F4P1E/lab68dev-platform/issues)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-donate-yellow.svg?style=for-the-badge&logo=buymeacoffee)](https://www.buymeacoffee.com/lab68dev)

**Lab68 Dev Platform** is a monorepo that powers a collaborative product development workspace. It provides dashboards for planning, documentation, meetings, AI-assisted workflows, and role-aware access controls—built on top of **Next.js App Router**, **TypeScript**, and a modular component system.

---

## Highlights

- **Role-Based Collaboration** – project-level roles (owner, admin, editor, viewer) with granular permission checks and activity logging.
- **Multilingual UI** – centralized translation registry (`lib/i18n.ts`) covering nine locales with automatic English fallbacks.
- **Productivity Surface** – dashboards for projects, kanban, meetings, files, wiki, diagrams, community discussions, and AI tools.
- **Client-Side Auth Utilities** – mock authentication and user preference helpers ready to swap for a real provider.
- **Theme & Layout Framework** – dark/light theme support, sidebar navigation, reusable UI primitives, and responsive Tailwind styling.
- **Automation Scripts** – translation restoration and encoding-fix utilities for keeping locale data consistent.

---

## Tech Stack

| Layer | Details |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) with the App Router |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | Tailwind CSS + custom utility components |
| Package Manager | pnpm |
| Tooling | ESLint, Prettier, PostCSS |
| Deployment Ready | Vercel (configuration included in `next.config.mjs`) |

---

## Repository Structure

```text
lab68dev-platform/
├── app/                      # Route groups and feature areas
│   ├── api/chat/route.ts     # Edge-friendly chat endpoint
│   ├── dashboard/            # Authenticated workspace experience
│   ├── login/, signup/       # Auth flows (mocked)
│   └── layout.tsx            # Root layout with theme provider
├── components/               # Reusable UI atoms/molecules (sidebar, header, etc.)
├── lib/                      # Domain logic (auth, RBAC, i18n, team utilities)
├── public/                   # Static assets
├── styles/                   # Tailwind extension layer
├── scripts/                  # Translation repair helpers (see root *.js files)
├── next.config.mjs           # Next.js configuration
├── tsconfig.json             # Type checking configuration
└── package.json              # Workspace scripts
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 8 (`corepack enable` recommended)

### Installation

```bash
git clone https://github.com/lab68dev/lab68dev-platform.git
cd lab68dev-platform
pnpm install
```

### Development

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) while the dev server is running.

### Authentication Setup

This project uses **Supabase** for authentication. Follow these steps to set up:

1. **Create a Supabase project** at [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Get your API credentials** from Project Settings → API
3. **Add them to `.env.local`**:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Run the database schema** by executing `supabase-schema.sql` in the SQL Editor
5. **Restart your dev server**

For detailed setup instructions, see **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**.

### Production Build

```bash
pnpm build
pnpm start
```

The build step runs Next.js static analysis, type-checking, and route bundling.

---

## Feature Tour

| Area | Summary |
| --- | --- |
| **Dashboard Overview** | Snapshot of active projects, AI assistant, system metrics, and notifications. |
| **Projects & Kanban** | Create projects, assign collaborators, manage roles, and move cards across kanban columns. |
| **Team Management** | `lib/team.ts` exposes helpers for permissions, activity logging, and "time ago" formatting. |
| **Authentication** | Secure user authentication powered by [Supabase Auth](https://supabase.com) with email/password, session management, and protected routes. |
| **Chat & Messaging** | Real-time team communication with chat rooms, direct messages, typing indicators, reactions, and @mentions. |
| **Comments System** | Contextual collaboration on tasks, diagrams, and projects with threaded comments, mentions, and resolution tracking. |
| **Whiteboard** | Collaborative drawing canvas with freehand pen, shapes (rectangle, circle, line), text, color picker, stroke width, fill options, undo/redo, export to PNG/SVG, and collaborator invitations. |
| **Files Library** | Upload files from your computer (max 10MB), add external links, categorize by project/task/meeting, search and filter by type and category. |
| **Meetings & Planning** | Schedule meetings, capture plans/milestones, and log progress. |
| **Wiki & Community** | Knowledge base articles, category filtering, and community discussion threads. |
| **AI Tools** | Scaffolding for AI-assisted workflows via the `/dashboard/ai-tools` route. |
| **Localization** | `getTranslations` deep-merges locale entries with English defaults to prevent missing key errors. |

---

## Localization Workflow

- Base copy lives in the English dictionary inside `lib/i18n.ts`.
- Additional locales provide override objects; missing keys automatically fall back to English.
- Translation maintenance scripts (e.g., `restore_translations.js`, `fix_final_issues.js`) exist for bulk fixes and encoding repair.
- To add a new locale, extend the `Language` union and append a dictionary entry mirroring the existing structure.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Next.js development server on port 3000 (auto reload + hot module replacement). |
| `pnpm build` | Compile the production build, run type checks, and output `.next/`. |
| `pnpm start` | Serve the production build (requires `pnpm build` first). |
| `pnpm lint` | Run ESLint across the project (configure in `package.json`). |

> Some automation scripts live in the repository root and are intended for one-off translation repair tasks. They read/write `lib/i18n.ts`—use with caution and commit the results after validation.

---

## Environment Configuration

Create a `.env.local` file for runtime secrets (API keys, analytics, auth providers, etc.). Next.js automatically loads this file in development. Sensitive values are not committed to the repository.

---

## Contribution Guidelines

1. Fork the repository and create a feature branch (`git checkout -b feature/amazing-idea`).
2. Keep commits scoped and descriptive.
3. Run `pnpm build` (or at minimum `pnpm lint`) before pushing.
4. Open a pull request with context about the change and screenshots when UI elements are involved.

We welcome enhancements to the workspace features, translation coverage, accessibility, and DX tooling.

---

## License

This project is licensed under the [Apache License 2.0](./LICENSE).

---

## Support & Feedback

- GitHub Issues: [lab68dev-platform/issues](https://github.com/lab68dev/lab68dev-platform/issues)
- Maintainer: [@F4P1E](https://github.com/F4P1E)

Let us know how you are using Lab68 Dev Platform or what you would like to see next!
