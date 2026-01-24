# Lab68 Dev Platform

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E)](https://supabase.com/)
[![Sponsor](https://img.shields.io/badge/%E2%99%A5_Sponsor-Support_Us-fe8184)](https://github.com/sponsors/lab68dev)

**Lab68 Dev Platform** is a comprehensive collaborative product development workspace with integrated staff management. It provides dashboards for planning, documentation, meetings, AI-assisted workflows, role-aware access controls, live customer support, and a complete staff portal — built with **Next.js App Router**, **TypeScript**, and a modular component system.

---

## Highlights

- **Enterprise-Grade Security** – bcrypt password hashing, JWT sessions, Two-Factor Authentication (2FA), rate limiting, and automated email notifications.
- **Role-Based Collaboration** – project-level roles (owner, admin, editor, viewer) with granular permission checks and activity logging.
- **Staff Management Portal** – dedicated staff authentication, user management, support queue, analytics dashboard, and approval workflows.
- **Live Customer Support** – real-time chat widget with staff dashboard for 24/7 support management.
- **Supabase Backend** – PostgreSQL database with Row-Level Security (RLS), indexed queries, and automatic session cleanup.
- **Multilingual UI** – centralized translation registry with English and Vietnamese support.
- **Productivity Suite** – dashboards for projects, kanban, meetings, files, wiki, diagrams, community discussions, and AI tools.
- **Theme & Layout Framework** – dark/light theme support, sidebar navigation, reusable UI primitives, and responsive Tailwind styling.

---

## Tech Stack

| Layer | Details |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) with the App Router |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Database | [Supabase](https://supabase.com/) PostgreSQL with RLS policies |
| Authentication | JWT sessions, bcrypt password hashing, TOTP-based 2FA |
| Real-Time | [Socket.io](https://socket.io/) for instant messaging and presence |
| AI Models | Ollama (local) - Privacy-first, no API costs |
| Email | Nodemailer with SMTP |
| Security | Rate limiting, session management, activity logging |
| Styling | Tailwind CSS + Radix UI components |
| Package Manager | pnpm |

---

## Features

### Dashboard

The main dashboard (`/dashboard`) provides an overview of your workspace with:

- **Quick Stats** – Projects, tasks, meetings, and activity metrics
- **Calendar Widget** – Upcoming meetings with visual indicators
- **Recent Activity** – Latest actions across your workspace
- **Weather Widget** – Current weather conditions
- **Meeting Reminders** – Configurable notifications with browser/sound alerts

### Projects & Kanban

Create projects, assign collaborators, manage roles, and track work:

- **Issue Tracking** – Create, assign, and manage issues with labels and sprints
- **Kanban Boards** – Drag-and-drop task management
- **Collaborators** – Invite team members with role-based permissions
- **Activity Logging** – Track all project changes

### Meeting Management

Schedule and manage meetings (`/dashboard/meeting`):

- **Meeting Scheduler** – Create meetings with date, time, and duration
- **Smart Reminders** – Configurable alerts (5, 10, 15, 30, 60 min before)
- **Browser Notifications** – System-level alerts when permitted
- **Sound Alerts** – Audio notifications with volume control
- **Snooze Functionality** – 5-minute snooze on reminders

### Todo & Pomodoro

Task management with productivity tools (`/dashboard/todo`):

- **Task Management** – Create, prioritize, and complete tasks
- **Pomodoro Timer** – Focus timer with work/break cycles
- **Visual Coffee Cup** – Animated progress indicator
- **Lofi Music Integration** – Focus music player
- **Session Tracking** – Daily goal progress

### AI Tools

Intelligent development assistant (`/dashboard/ai-tools`):

- **RAG-Enhanced AI** – AI powered by your documentation and codebase
- **Privacy First** – All processing stays on your infrastructure (Ollama)
- **Cost Free** – Local Ollama models mean zero API fees
- **Modern Chat UI** – Complete chat interface with history and code highlighting

### Resume Editor

WYSIWYG resume builder (`/dashboard/resume`):

- **Live Preview** – A4 paper format with instant updates
- **Customization** – Fonts, colors, and professional templates
- **PDF Export** – Download your resume as PDF
- **Data Persistence** – Auto-saves to local storage

### Wiki & Documentation

Knowledge base (`/dashboard/wiki`):

- **Article Management** – Create and organize documentation
- **Category Support** – Organize articles by topic
- **Search** – Find articles quickly

### Files & Storage

File management (`/dashboard/files`):

- **File Upload** – Upload and organize files
- **Category Filtering** – Filter by file type
- **Project Association** – Link files to projects

### Diagrams & Whiteboard

Visual collaboration tools:

- **Flowcharts** – Create flow diagrams
- **Mermaid Support** – Text-to-diagram rendering
- **Whiteboard** – Freeform drawing canvas

### Entertainment

Brain games and relaxation (`/dashboard/entertainment`):

- **Tetris** – Classic block puzzle game
- **Snake** – Classic snake game
- **Sudoku** – Number puzzle
- **Typing Game** – Speed typing practice
- **Math Sprint** – Quick math challenges
- **Word Scramble** – Word puzzle game
- **Sliding Puzzle** – Tile sliding puzzle

### Staff Portal

Full admin interface (`/staff/dashboard`):

- **User Management** – Manage platform users
- **Analytics Dashboard** – Usage statistics
- **Activity Logging** – Track all staff actions
- **Role-Based Access** – Admin privileges
- **Support Queue** – Manage customer support tickets

### Settings

User preferences (`/dashboard/settings`):

- **Profile Management** – Update name, bio, avatar
- **Language Settings** – English/Vietnamese
- **Notification Preferences** – Configure meeting reminders
- **Theme Selection** – Dark/light mode
- **Security Settings** – Password management

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

1. **Database**: Create a Supabase project and run the schema migrations.
2. **Environment**: Copy `.env.example` to `.env.local` and fill in your Supabase credentials and JWT secret.

   ```bash
   cp .env.example .env.local
   ```

   Generate a JWT secret:

   ```bash
   openssl rand -base64 32
   ```

3. **AI Setup (Optional)**: Install [Ollama](https://ollama.com) and pull a model (e.g., `ollama pull deepseek-r1:7b`).

### Development

```bash
# Start with Socket.io real-time support
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Repository Structure

```text
lab68dev-platform/
├── app/                      # Route groups and feature areas
│   ├── api/                  # API routes
│   ├── dashboard/            # Main dashboard features
│   │   ├── ai-tools/         # AI assistant
│   │   ├── collaborators/    # Team management
│   │   ├── community/        # Discussions
│   │   ├── diagrams/         # Flow diagrams
│   │   ├── entertainment/    # Games
│   │   ├── files/            # File management
│   │   ├── meeting/          # Meeting scheduler
│   │   ├── planning/         # Sprint planning
│   │   ├── projects/         # Project management
│   │   ├── resume/           # Resume builder
│   │   ├── settings/         # User settings
│   │   ├── support/          # Customer support
│   │   ├── todo/             # Task management
│   │   ├── whiteboard/       # Drawing canvas
│   │   └── wiki/             # Documentation
│   └── staff/                # Staff portal
├── components/               # Reusable UI components
├── lib/                      # Domain logic (auth, email, i18n, database)
├── docs/                     # Documentation
├── public/                   # Static assets
└── scripts/                  # Utility scripts
```

---

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server with Socket.io |
| `pnpm dev:next` | Start Next.js dev server only |
| `pnpm build` | Compile the production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |

---

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

### Quick Guide

1. **Fork & Branch**: Create a new branch for your feature (`feat/amazing-feature`) or fix (`fix/bug-name`).
2. **Code Style**: We use **Next.js App Router**, **TypeScript**, and **Tailwind CSS**. Ensure your code matches the existing style.
3. **Commit**: Use [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat: add new dashboard widget`).
4. **Pull Request**: Open a PR against `main`. Describe your changes and link any related issues.

Please adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md) in all interactions.

---

## Support & Feedback

- GitHub Issues: [lab68dev-platform/issues](https://github.com/lab68dev/lab68dev-platform/issues)
- Maintainers: [@DongDuong2001](https://github.com/DongDuong2001)
- Scrum Master: [@mthutt](https://github.com/mthutt)
