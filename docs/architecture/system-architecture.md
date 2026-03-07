# System Architecture - SmartFit AI Platform

## 1. High-level architecture

SmartFit AI is structured as a multi-tenant SaaS platform with independent scale domains:

- Client layer
  - Mobile app (Expo / React Native) for iOS and Android
  - Web app (Next.js App Router) as installable PWA
- API and application layer
  - Next.js Route Handlers + Server Actions
  - Supabase Edge Functions for webhook and async business logic
- Data layer
  - Supabase PostgreSQL with row-level security
  - Supabase Storage for media and avatar stages
- AI layer
  - Nutri Muzy AI service for coaching
  - Moderation service for text and image safety
  - Avatar generation pipeline (queue + worker)
- Event and notification layer
  - Event queue for async workloads
  - Push, in-app, and email channels

## 2. Multi-tenant model

- Every business entity stores `tenant_id`
- RLS policies enforce tenant isolation with `current_tenant_id()`
- Auth token carries `tenant_id` claim for scoped queries
- Shared global rows (plan templates, default badges) use nullable tenant_id

## 3. Service boundaries

- Identity Service: auth, profile, role permissions, membership
- Billing Service: plans, subscriptions, payments, invoices, commissions
- Program Service: coach onboarding, programs, enrollments, reviews
- Fitness Service: workouts, exercises, logs, streaks, completion
- Nutrition Service: meals, macros, hydration, off-diet events
- Community Service: feed, comments, likes, follows, messaging
- Gamification Service: XP, levels, missions, badges, leaderboards
- AI Service: Nutri Muzy prompts, moderation, avatar generation jobs
- Notification Service: transactional and behavior-triggered messaging
- Analytics Service: event collection, funnels, retention dashboards

## 4. Runtime topology

- Edge CDN serves static assets and PWA shell globally
- Region-aware API routing for lower latency
- Queue-backed workers for heavy asynchronous tasks
- Read-optimized indexes on feed, messaging, and logs

## 5. Mobile/Web UX architecture

- Mobile bottom navigation: Home, Workout, Diet, Community, Progress
- Web information architecture:
  - Landing and funnel
  - Dashboard and daily execution
  - Marketplace
  - Community feed
- Design tokens shared via `packages/shared`

## 6. Security controls

- Supabase Auth with short-lived access tokens
- Strict RLS with tenant + role checks
- API rate limiting and payload validation
- Encrypted transport and secrets isolation
- AI moderation for harmful community content

## 7. Deployment model

- Web: Vercel edge network
- Mobile: Expo EAS builds and stores
- Database: Supabase managed Postgres + storage
- Observability: logs, metrics, traces, SLO alerts
