# Supabase Auth Setup

## 1) Configure env files

Create local env files based on examples:

- `c:/Users/Dell/Desktop/conversor-tech/.env.example`
- `c:/Users/Dell/Desktop/conversor-tech/apps/web/.env.example`
- `c:/Users/Dell/Desktop/conversor-tech/apps/mobile/.env.example`

Required values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 2) Apply database migration

Run your Supabase migration using:

- `c:/Users/Dell/Desktop/conversor-tech/infra/supabase/migrations/0001_init.sql`
- `c:/Users/Dell/Desktop/conversor-tech/infra/supabase/seed.sql`

This migration includes automatic user bootstrap:

- Creates tenant on signup
- Creates profile with role admin
- Creates tenant membership
- Initializes XP row

## 3) Run apps

- Web: `cmd /c npx pnpm dev:web`
- Mobile: `cmd /c npx pnpm dev:mobile`

## 4) Test flow

1. Open `/auth` on web and create account
2. Confirm login works and dashboard unlocks
3. Login on mobile with same credentials
4. Verify user row, tenant row, and membership row in Supabase