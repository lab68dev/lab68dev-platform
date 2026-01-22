# Lab68 Dev Platform

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E)](https://supabase.com/)
[![Sponsor](https://img.shields.io/badge/♥_Sponsor-Support_Us-fe8184)](https://github.com/sponsors/lab68dev)

**Lab68 Dev Platform** is a comprehensive collaborative product development workspace with integrated staff management.
It provides dashboards for planning, documentation, meetings, AI-assisted workflows, role-aware access controls, live customer support, and a complete staff portal — built with **Next.js App Router**, **TypeScript**, and a modular component system.

---

## Highlights

- **Enterprise-Grade Security** – bcrypt password hashing, JWT sessions, Two-Factor Authentication (2FA), rate limiting, and automated email notifications.
- **Role-Based Collaboration** – project-level roles (owner, admin, editor, viewer) with granular permission checks and activity logging.
- **Staff Management Portal** – dedicated staff authentication, user management, support queue, analytics dashboard, and approval workflows.
- **Live Customer Support** – real-time chat widget with staff dashboard for 24/7 support management.
- **Supabase Backend** – PostgreSQL database with Row-Level Security (RLS), indexed queries, and automatic session cleanup.
- **Multilingual UI** – centralized translation registry covering nine locales with automatic English fallbacks.
- **Productivity Surface** – dashboards for projects, kanban, meetings, files, wiki, diagrams, community discussions, and AI tools.
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
| Styling | Tailwind CSS + custom utility components |
| Package Manager | pnpm |

---

## Features

### AI Tools

The AI Tools feature (`/dashboard/ai-tools`) provides an intelligent development assistant with RAG (Retrieval-Augmented Generation).

- **RAG-Enhanced AI** – AI powered by your documentation and codebase.
- **Privacy First** – All processing stays on your infrastructure (Ollama + Supabase pgvector).
- **Cost Free** – Local Ollama models mean zero API fees.
- **Modern Chat UI** – Complete chat interface with history and code highlighting.

### Resume Editor

The Live Resume Editor (`/dashboard/resume`) is a WYSIWYG resume builder.

- **Live Preview** – A4 paper format with instant updates.
- **Customization** – Fonts, colors, and 5 professional templates.
- **Data Persistence** – Auto-saves to local storage.

### Staff Portal

Full admin interface at `/staff/dashboard` with user management, analytics, activity logging, and role-based access control.

### Projects & Kanban

Create projects, assign collaborators, manage roles, and track work with Kanban boards.

### Chat & Messaging

Real-time messaging with Socket.io, supporting direct messages, group chats, online presence, and typing indicators.

### Whiteboard

Collaborative drawing canvas with shapes, text, and export capabilities.

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

1. **Database**: Create a Supabase project and run `supabase-staff-schema.sql`.
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
├── components/               # Reusable UI atoms/molecules
├── lib/                      # Domain logic (auth, email, i18n, team)
├── docs/                     # Comprehensive documentation
├── public/                   # Static assets
└── scripts/                  # Utilities
```

---

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server. |
| `pnpm build` | Compile the production build. |
| `pnpm start` | Serve the production build. |
| `pnpm lint` | Run ESLint. |

---

## Support & Feedback

- GitHub Issues: [lab68dev-platform/issues](https://github.com/lab68dev/lab68dev-platform/issues)
- Maintainers: [@DongDuong2001](https://github.com/DongDuong2001)
- Scrum Master: [@mthutt](https://github.com/mthutt)
