# Contributing to Lab68 Development Platform

Welcome to the **Lab68 Development Platform**! We're thrilled you want to contribute. This living document outlines our architecture, design principles, and how to successfully merge your code into this high-performance collaborative environment.

---

## Technical Architecture

Before you dive in, here is a quick overview of our cutting-edge stack:

- **Framework:** Next.js 16 (App Router & `proxy.ts`)
- **Language:** TypeScript 5
- **Package Manager:** pnpm 8+
- **Database & Auth:** Supabase (PostgreSQL with RLS)
- **Styling:** Tailwind CSS V4 + Pre-built UI Primitives (`components/ui`)
- **Aesthetic:** High-Contrast Cyberpunk / Brutalist Dark Mode

---

## Local Development Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 8
- A free [Supabase](https://supabase.com/) account for database provisioning.

### 2. Up & Running
Clone the repository and install the dependencies:
```bash
git clone https://github.com/lab68dev/lab68dev-platform.git
cd lab68dev-platform
pnpm install
```

### 3. Environment Configuration
We utilize **Instant Passwordless Authentication**. This means you must connect the app to a Supabase project.

1. Go to your Supabase Dashboard -> Project Settings -> API.
2. Form a `.env.local` file at the root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```
3. Boot the development server:
```bash
pnpm dev
```
> **Note**: Our authentication automatically deterministically secures users based on their email. Do NOT introduce or submit PRs containing `bcrypt` or standard password-hashing logic.

---

## Code & Design Guidelines

### Typography System
To maintain our premium, developer-centric aesthetic, we employ a strict dual-font system natively enforced in `app/layout.tsx`:
- **IBM Plex Sans** (`font-sans`): MUST be used for all body text, paragraphs, descriptions, and prose. 
- **JetBrains Mono** (`font-mono`): MUST be used for headings, numerics, code blocks, navigation elements, and dashboard statistics.

### Component Design (Empty States)
When building lists, tables, or sections that fetch data, you **MUST** account for empty data arrays.
Do not use plain text `No results found`. Always import and utilize the `<EmptyState />` component from `components/ui/empty-state.tsx`.
```tsx
import { EmptyState } from "@/components/ui/empty-state"
import { Sparkles } from "lucide-react"

<EmptyState 
  icon={Sparkles}
  title="No data found"
  description="Your new data will appear right here."
/>
```

### Routing Convention
Next.js 16 deprecated `middleware.ts`. All middleware logic is now co-located and routed through `proxy.ts`. If you need to intercept routes or manipulate headers, modify `proxy.ts`.

---

## Pull Request Lifecycle

1. **Branch Naming**: Prefix branches cleanly: `feat/cool-widget`, `fix/navbar-contrast`, or `chore/deps-update`.
2. **Commit Convention**: We enforce [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). E.g. `feat(dashboard): add weather widget`.
3. **Lint & Test**: Ensure `pnpm lint` and `pnpm build` exhibit zero warnings. 
4. **Draft PR**: Open a PR against `main`. It is highly encouraged to attach screenshots of UI changes.

Thank you for building Lab68dev with us! 🚀
