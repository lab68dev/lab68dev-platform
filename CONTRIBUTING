# Contributing to Lab68 Development Platform

Thank you for your interest in contributing to **lab68dev Platform**.  
This document outlines how to report issues, propose features, and submit contributions effectively.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [Development Workflow](#development-workflow)
3. [Coding Standards](#coding-standards)
4. [Commit Guidelines](#commit-guidelines)
5. [Pull Request Process](#pull-request-process)
6. [Reporting Issues](#reporting-issues)
7. [Community Standards](#community-standards)
8. [Contact](#contact)

---

## Project Setup

### 1. Fork and Clone
Fork the repository and clone your fork locally:
```bash
git clone https://github.com/lab68dev/lab68dev-platform.git
cd lab68dev-platform
````

### 2. Install Dependencies

The project uses **pnpm** as its package manager.

```bash
pnpm install
```

### 3. Run the Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to verify the setup.

### 4. Build for Production

```bash
pnpm build
pnpm start
```

---

## Development Workflow

We follow a standard GitHub flow:

1. Create a new branch for your change:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and verify that all tests and builds pass:

   ```bash
   pnpm lint
   pnpm build
   ```

3. Commit and push your changes:

   ```bash
   git commit -m "feat: add new API route for Gemini integration"
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request (PR) from your branch to the `main` branch.

---

## Coding Standards

Please follow these guidelines to maintain consistency across the project:

* **Language:** TypeScript
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS and CSS Modules
* **Formatting:** Prettier
* **Linting:** ESLint

Before committing, ensure that your changes are formatted and linted:

```bash
pnpm prettier --write .
pnpm lint
```

Avoid committing code with lint or type errors. Each PR should build successfully without warnings.

---

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

**Commit message format:**

```
<type>: <short summary>
```

**Types:**

| Type     | Description                                           |
| -------- | ----------------------------------------------------- |
| feat     | A new feature                                         |
| fix      | A bug fix                                             |
| docs     | Documentation updates                                 |
| style    | Code style or formatting only                         |
| refactor | Code changes that neither fix a bug nor add a feature |
| test     | Adding or updating tests                              |
| chore    | Maintenance tasks or tooling updates                  |

**Examples:**

```
feat: integrate Gemini API for text generation
fix: resolve Next.js build error in production
docs: add setup instructions for contributors
```

---

## Pull Request Process

* Ensure that your branch is up to date with `main`:

  ```bash
  git pull origin main --rebase
  ```
* Write a clear, concise title and description for your PR.
* Reference related issues if applicable (e.g., “Closes #42”).
* Provide enough context for reviewers to understand your change.
* Include documentation updates if your change affects usage or configuration.
* Wait for CI checks (build/lint) to pass before requesting review.

Large PRs are discouraged — prefer smaller, focused contributions.

---

## Reporting Issues

If you encounter a bug, performance issue, or missing feature, please:

1. Search existing [issues](https://github.com/F4P1E/lab68dev-platform/issues) before opening a new one.
2. Include clear steps to reproduce the problem.
3. Describe the expected and actual behavior.
4. Provide screenshots or logs when applicable.
5. Use a concise, descriptive title.

Feature suggestions are welcome — please include the problem statement and potential benefits.

---

## Community Standards

By participating in this project, you agree to uphold our [Code of Conduct](./CODE_OF_CONDUCT.md).
We are committed to providing a respectful, inclusive, and collaborative environment for all contributors.

Unacceptable behavior, including harassment or discrimination, will not be tolerated in any form.

---

## Contact

If you have questions about contributing, reach out through:

* GitHub Issues: [https://github.com/F4P1E/lab68dev-platform/issues](https://github.com/F4P1E/lab68dev-platform/issues)
* GitHub Discussions (if enabled)
* Maintainer: **@F4P1E**

---

### Thank You

Your contributions help make **Lab68 Development Platform** better for everyone.
Every bug report, feature request, and pull request strengthens the project and its community.
