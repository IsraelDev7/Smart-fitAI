# SmartFit AI Platform

Monorepo MVP for a multi-tenant fitness and nutrition SaaS platform.

## Apps

- `apps/mobile`: Expo app for iOS and Android
- `apps/web`: Next.js PWA app for web
- `packages/shared`: Shared types, contracts, and constants
- `infra/supabase`: SQL schema and migration files

## Stack

- Mobile: Expo + React Native + TypeScript
- Web: Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion
- Backend: Supabase PostgreSQL + RLS + Edge Functions (planned)
- AI: OpenAI integration contract + moderation pipelines (planned)

## Quick start

1. Install dependencies:
   - `pnpm install`
2. Run web:
   - `pnpm dev:web`
3. Run mobile:
   - `pnpm dev:mobile`

## Docs

- Architecture: `docs/architecture/system-architecture.md`
- API: `docs/architecture/api-routes.md`
- AI systems: `docs/architecture/ai-systems.md`
- Scaling plan: `docs/architecture/scaling-strategy.md`
- Product blueprint: `docs/product/mvp-scope.md`
- Supabase auth setup: `docs/architecture/supabase-auth-setup.md`
- Billing setup: `docs/architecture/billing-setup.md`