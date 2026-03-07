# MVP Scope and Build Order

## MVP included in this repository

- Mobile foundation with key tabs and gamification primitives
- Web PWA with landing, dashboard, marketplace, and community skeleton
- Shared domain contracts package
- Supabase multi-tenant schema with RLS baseline
- Architecture docs for services, APIs, AI, and scaling

## Recommended implementation order

1. Supabase project bootstrap and migration apply
2. Auth and tenant claim injection in JWT
3. Billing flow with Stripe + PIX + manual Zelle proof flow
4. Program creation and enrollment workflows
5. Community write path + moderation queue
6. AI coach and avatar workers
7. Analytics instrumentation and dashboards
