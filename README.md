<div align="center">

# **Lab68 Dev Platform**

<!-- Classic badges (no for-the-badge) -->
<a href="./LICENSE">
  <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" />
</a>
<a href="https://nextjs.org/">
  <img src="https://img.shields.io/badge/Next.js-16-black.svg" />
</a>
<a href="https://www.typescriptlang.org/">
  <img src="https://img.shields.io/badge/TypeScript-5.9.3-blue.svg" />
</a>
<img src="https://img.shields.io/github/commit-activity/w/lab68dev/lab68dev-platform" />
<a href="https://github.com/F4P1E/lab68dev-platform">
  <img src="https://img.shields.io/github/package-json/v/F4P1E/lab68dev-platform" />
</a>
<a href="https://github.com/F4P1E/lab68dev-platform/issues">
  <img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg" />
</a>
<a href="https://www.buymeacoffee.com/lab68dev">
  <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-donate-yellow.svg?logo=buymeacoffee" />
</a>

<!-- Added Tool Badges -->
<a href="https://github.com/">
  <img src="https://img.shields.io/badge/GitHub-181717.svg?logo=github&logoColor=white" />
</a>
<a href="https://vercel.com/">
  <img src="https://img.shields.io/badge/Vercel-000000.svg?logo=vercel&logoColor=white" />
</a>
<a href="https://supabase.com/">
  <img src="https://img.shields.io/badge/Supabase-3ECF8E.svg?logo=supabase&logoColor=white" />
</a>
<a href="https://jwt.io/">
  <img src="https://img.shields.io/badge/JWT-000000.svg?logo=jsonwebtokens&logoColor=white" />
</a>

---

**Lab68 Dev Platform** is a comprehensive collaborative product development workspace with integrated staff management.  
It provides dashboards for planning, documentation, meetings, AI-assisted workflows, role-aware access controls, live customer support, and a complete staff portal — built with **Next.js App Router**, **TypeScript**, and a modular component system.

</div>

---

## Highlights

- **Enterprise-Grade Security** – bcrypt password hashing, JWT sessions, Two-Factor Authentication (2FA), rate limiting, and automated email notifications.
- **Role-Based Collaboration** – project-level roles (owner, admin, editor, viewer) with granular permission checks and activity logging.
- **Staff Management Portal** – dedicated staff authentication, user management, support queue, analytics dashboard, and approval workflows.
- **Live Customer Support** – real-time chat widget with staff dashboard for 24/7 support management.
- **Supabase Backend** – PostgreSQL database with Row-Level Security (RLS), indexed queries, and automatic session cleanup.
- **Multilingual UI** – centralized translation registry (`lib/i18n.ts`) covering nine locales with automatic English fallbacks.
- **Productivity Surface** – dashboards for projects, kanban, meetings, files, wiki, diagrams, community discussions, and AI tools.
- **Theme & Layout Framework** – dark/light theme support, sidebar navigation, reusable UI primitives, and responsive Tailwind styling.
- **Automation Scripts** – translation restoration and encoding-fix utilities for keeping locale data consistent.

---

## Tech Stack

| Layer | Details |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) with the App Router |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Database | [Supabase](https://supabase.com/) PostgreSQL with RLS policies |
| Authentication | JWT sessions, bcrypt password hashing, TOTP-based 2FA |
| Email | Nodemailer with SMTP (Gmail, SendGrid, Mailgun, SES) |
| Security | Rate limiting, session management, activity logging |
| Styling | Tailwind CSS + custom utility components |
| Package Manager | pnpm |
| Tooling | ESLint, Prettier, PostCSS |
| Deployment Ready | Vercel (configuration included in `next.config.mjs`) |

---

## Repository Structure

```text
lab68dev-platform/
├── app/                      # Route groups and feature areas
│   ├── api/
│   │   ├── chat/route.ts     # Edge-friendly chat endpoint
│   │   └── staff/            # Staff authentication APIs
│   │       ├── signup/route.ts    # Staff registration with rate limiting
│   │       ├── login/route.ts     # JWT authentication with 2FA
│   │       └── 2fa/route.ts       # Two-Factor Auth management
│   ├── dashboard/            # Authenticated workspace experience
│   ├── staff/                # Staff portal
│   │   ├── login/, signup/   # Staff authentication flows
│   │   └── dashboard/        # Staff management dashboard
│   ├── login/, signup/       # User auth flows
│   └── layout.tsx            # Root layout with theme provider
├── components/               # Reusable UI atoms/molecules (sidebar, header, etc.)
├── lib/                      # Domain logic
│   ├── staff-security.ts     # Security infrastructure (bcrypt, JWT, 2FA)
│   ├── staff-email.ts        # Email notification system
│   ├── auth.ts, team.ts      # RBAC and user management
│   └── i18n.ts               # Internationalization
├── docs/                     # Comprehensive documentation
│   ├── SECURITY_QUICKSTART.md     # 5-minute security setup
│   ├── SECURITY_IMPLEMENTATION.md # Technical guide
│   ├── SECURITY_COMPLETE.md       # Complete summary
│   ├── STAFF_PORTAL.md            # Staff portal guide
│   └── SUPABASE_SETUP.md          # Database setup
├── public/                   # Static assets
├── scripts/                  # Translation repair helpers
├── supabase-staff-schema.sql # PostgreSQL database schema
├── .env.example              # Environment variable template
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

### Quick Setup (Security Features)

**Follow the 5-minute setup guide:** See **[docs/SECURITY_QUICKSTART.md](./docs/SECURITY_QUICKSTART.md)**

**Or manually configure:**

1. **Generate JWT Secret:**

   ```powershell
   # PowerShell (Windows)
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   
   # Or Linux/Mac
   openssl rand -base64 32
   ```

2. **Setup Gmail App Password:**
   - Enable 2FA on your Google account
   - Visit <https://myaccount.google.com/apppasswords>
   - Create an app password for "Mail"

3. **Create Supabase Project:**
   - Sign up at <https://supabase.com>
   - Create new project
   - Run `supabase-staff-schema.sql` in SQL Editor
   - Copy Project URL and Anon Key

4. **Configure Environment:**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

For detailed instructions, see **[docs/SECURITY_IMPLEMENTATION.md](./docs/SECURITY_IMPLEMENTATION.md)**.

### Development

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) while the dev server is running.

### Authentication Setup

This project uses **Supabase** for authentication and **enterprise-grade security**:

**Implemented Security Features:**

- **Password Hashing:** bcrypt with 12 salt rounds
- **JWT Sessions:** 24-hour expiry with signed tokens
- **Two-Factor Auth:** TOTP with QR codes and backup codes
- **Rate Limiting:** 5 login attempts per 15 minutes
- **Email Notifications:** Professional templates for all events
- **Supabase Database:** PostgreSQL with RLS policies

**Quick Setup:**

1. **Create a Supabase project** at [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Run the database schema:** Execute `supabase-staff-schema.sql` in the SQL Editor
3. **Configure environment variables** in `.env.local`:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   
   # JWT
   JWT_SECRET=your-generated-secret-from-above
   
   # Email (Gmail example)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM_EMAIL=your-email@gmail.com
   SMTP_FROM_NAME=Lab68 Dev Platform
   ```

4. **Restart your dev server:** `pnpm dev`

**Default Admin Account:**

- Email: `admin@lab68dev.com`
- Password: `Admin@123456`
- **Change this immediately in production!**

For detailed setup instructions, see **[docs/SECURITY_QUICKSTART.md](./docs/SECURITY_QUICKSTART.md)**.

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
| **Security** | Enterprise-grade security with bcrypt password hashing (12 rounds), JWT sessions (24h expiry), TOTP-based 2FA with QR codes, rate limiting (5 login/15min), professional email notifications (6 templates), and Supabase PostgreSQL with RLS policies. |
| **Staff Portal** | Dedicated staff authentication system with sign-up approval workflow, staff dashboard, user management, analytics, activity logging, and role-based access control (admin/support/moderator). |
| **Dashboard Overview** | Snapshot of active projects, AI assistant, system metrics, and notifications. |
| **Projects & Kanban** | Create projects, assign collaborators, manage roles, and move cards across kanban columns. |
| **Team Management** | `lib/team.ts` exposes helpers for permissions, activity logging, and "time ago" formatting. |
| **Authentication** | Secure user authentication powered by [Supabase Auth](https://supabase.com) with email/password, session management, and protected routes. |
| **Chat & Messaging** | Real-time team communication with chat rooms, direct messages, typing indicators, reactions, and @mentions. |
| **Comments System** | Contextual collaboration on tasks, diagrams, and projects with threaded comments, mentions, and resolution tracking. |
| **Whiteboard** | Collaborative drawing canvas with freehand pen, shapes (rectangle, circle, line), text, color picker, stroke width, fill options, undo/redo, export to PNG/SVG, and collaborator invitations. |
| **Files Library** | Upload files from your computer (max 10MB), add external links, categorize by project/task/meeting, search and filter by type and category. |
| **Resume Editor** | Live WYSIWYG resume builder with drag-and-drop section reordering, real-time color picker, 6 professional fonts, 3 font sizes, 5 customizable templates (Modern, Classic, Minimal, Creative, Professional with photo support), A4 paper preview (210mm × 297mm), section visibility controls, and localStorage persistence. Export-ready for PDF generation. |
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

## Resume Editor

The **Live Resume Editor** (`/dashboard/resume`) is a professional WYSIWYG resume builder with real-time preview and extensive customization options.

### Key Features

- **Live Preview** – A4 paper format (210mm × 297mm) with instant updates as you type
- **Drag-and-Drop Sections** – Reorder resume sections (Summary, Experience, Education, Skills, Certifications) by dragging
- **Color Customization** – Primary and secondary color pickers with hex input for brand consistency
- **Font Selection** – 6 professional fonts: Inter, Arial, Georgia, Roboto, Times New Roman, Courier New
- **Font Sizing** – Three size presets (Small, Medium, Large) for readability control
- **5 Professional Templates:**
  - **Modern** – Clean design with circular photo, blue accents, and modern borders
  - **Classic** – Traditional professional layout without photo
  - **Minimal** – Simple and elegant with lots of whitespace
  - **Creative** – Colorful gradient design with rounded cards and square photo
  - **Professional** – Executive 2-column layout with sidebar and photo
- **Section Visibility** – Show/hide sections without deleting content
- **Photo Upload** – Add profile photos to templates that support them (Modern, Creative, Professional)
- **Auto-save** – LocalStorage persistence to prevent data loss
- **Sample Data** – Pre-filled professional example for quick start

### Usage

1. Navigate to **Dashboard → Resume Editor**
2. Select a template from the left sidebar
3. Customize colors and fonts using the style controls
4. Fill in your information in the center panel
5. Drag sections to reorder them
6. Toggle section visibility with the eye icon
7. Upload a photo (for compatible templates)
8. View live changes in the A4 preview on the right
9. Click **Save** to persist to browser storage
10. Click **Download PDF** when ready (feature in development)

### Technical Details

- **Component:** `app/dashboard/resume/page.tsx`
- **State Management:** React hooks with TypeScript strict mode
- **Layout:** 12-column grid (2:4:6 ratio for controls:editor:preview)
- **Responsive:** Scrollable panels with hidden scrollbars for clean UI
- **Export Ready:** Structured for future PDF generation integration

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
