# Contributing to LegitSMM

Thank you for your interest in contributing to **LegitSMM**! We welcome contributions from the community to help make our social media growth infrastructure faster, safer, and more reliable.

Please take a moment to review this document before submitting issues or pull requests.

---

## 1. Code of Conduct

We are committed to providing an open, inclusive, and harassment-free environment for everyone. Please be respectful, constructive, and considerate when interacting with other maintainers and contributors.

---

## 2. Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **npm** or **pnpm**
- **Git**
- A free [Supabase](https://supabase.com) account for local database development

### Setting Up Your Local Environment

1. **Fork and Clone the Repository:**
   ```bash
   git clone https://github.com/shivamkoder/legitsmm.git
   cd legitsmm
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase project URL, anon key, service role key, and provider keys.

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Development Guidelines

### Branching Convention

Create dedicated feature branches branching off of `main`:
- `feat/feature-name` — New user-facing features or major additions
- `fix/bug-description` — Bug fixes and error resolutions
- `docs/doc-topic` — Documentation additions or improvements
- `refactor/scope` — Code refactoring without changing behavior
- `test/test-scope` — Adding or updating test suites
- `chore/task-name` — Dependency updates, tooling, or build configuration

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<optional scope>): <short description in present tense>

[optional body explaining motivation and context]

[optional footer(s)]
```

**Allowed Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (whitespace, formatting)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

*Examples:*
- `feat(orders): add live price calculation to order form`
- `fix(auth): handle expired session token redirect in middleware`
- `docs(api): document Web3 deposit verification endpoints`

---

## 4. Coding Standards & Principles

1. **Strict TypeScript:**
   - Avoid `any` types wherever possible. Use explicit types, interfaces, or generics.
   - Run type checks before opening PRs (`npx --package typescript tsc --noEmit`).

2. **Server vs. Client Components:**
   - Keep components server-rendered by default.
   - Use `"use client"` only when interactive state, hooks, or browser-only APIs are strictly required.
   - Avoid importing heavy client libraries (such as wallet adapters or Web3 providers) in server bundles; use dynamic imports with `ssr: false` when necessary.

3. **Financial & Security Invariants:**
   - **Zero Client Trust:** Never calculate or trust order prices, supplier cost rates, or account balance updates on the client.
   - All balance mutations must pass through the `apply_transaction` or `place_order` stored procedures inside PostgreSQL.
   - Ensure Row Level Security (RLS) is applied to any new database tables.

4. **Tailwind CSS Styling:**
   - Follow existing theme palettes (primary neon green `#7FFF00`, dark background `#000000` / `#050a02`).
   - Group layout, sizing, typography, and color utilities logically.

---

## 5. Submitting a Pull Request

1. Ensure the code builds cleanly (`npm run build`).
2. Verify all TypeScript types and lint checks pass.
3. Push your branch to your fork:
   ```bash
   git push origin feat/your-feature
   ```
4. Open a Pull Request against the `main` branch of `shivamkoder/legitsmm`.
5. Clearly describe the problem your PR solves, your implementation details, and any manual verification performed.
