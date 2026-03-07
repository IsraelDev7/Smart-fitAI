-- SmartFit AI Platform - Initial multi-tenant schema

create extension if not exists pgcrypto;

create type public.app_role as enum ('student', 'coach', 'admin', 'moderator');
create type public.subscription_plan as enum ('free', 'standard', 'vip');
create type public.profile_visibility as enum ('public', 'friends', 'private');
create type public.program_goal as enum ('fat_loss', 'muscle_gain', 'recomposition', 'health');
create type public.avatar_job_status as enum ('queued', 'processing', 'completed', 'failed');
create type public.payment_status as enum ('pending', 'succeeded', 'failed', 'refunded');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_tenant_id()
returns uuid
language sql
stable
as $$
  select nullif((current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id'), '')::uuid;
$$;

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  owner_user_id uuid not null,
  logo_url text,
  brand_primary text not null default '#10B981',
  brand_secondary text not null default '#22D3EE',
  commission_rate numeric(5,2) not null default 20.00,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  role public.app_role not null default 'student',
  full_name text not null,
  username text not null unique,
  bio text,
  country text,
  locale text not null default 'en',
  goal public.program_goal not null default 'health',
  fitness_level text not null default 'beginner',
  visibility public.profile_visibility not null default 'public',
  is_verified boolean not null default false,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, username)
);

create table public.tenant_memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  is_active boolean not null default true,
  joined_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create table public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  code public.subscription_plan not null,
  name text not null,
  price_monthly_usd numeric(10,2) not null,
  price_monthly_eur numeric(10,2) not null,
  price_monthly_gbp numeric(10,2) not null,
  price_monthly_brl numeric(10,2) not null,
  price_yearly_usd numeric(10,2) not null,
  price_yearly_eur numeric(10,2) not null,
  price_yearly_gbp numeric(10,2) not null,
  price_yearly_brl numeric(10,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.subscription_plans(id) on delete restrict,
  provider text not null,
  provider_customer_id text,
  provider_subscription_id text,
  status text not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  subscription_id uuid references public.user_subscriptions(id) on delete set null,
  provider text not null,
  provider_payment_id text,
  currency text not null,
  amount numeric(10,2) not null,
  status public.payment_status not null default 'pending',
  method text not null,
  metadata jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.coach_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  specialty text not null,
  biography text,
  certifications jsonb not null default '[]'::jsonb,
  verification_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  coach_user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  goal public.program_goal not null,
  difficulty text not null,
  duration_days integer not null,
  price_amount numeric(10,2) not null,
  price_currency text not null,
  billing_type text not null,
  is_published boolean not null default false,
  cover_image_url text,
  sales_page_slug text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, sales_page_slug)
);

create table public.program_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  program_id uuid not null references public.programs(id) on delete cascade,
  reviewer_user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  transformation_summary text,
  created_at timestamptz not null default now(),
  unique (program_id, reviewer_user_id)
);

create table public.program_enrollments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  program_id uuid not null references public.programs(id) on delete cascade,
  student_user_id uuid not null references public.profiles(id) on delete cascade,
  enrollment_status text not null default 'active',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (program_id, student_user_id)
);

create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  program_id uuid references public.programs(id) on delete set null,
  title text not null,
  focus text,
  estimated_duration_minutes integer,
  difficulty text,
  created_by uuid not null references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  workout_id uuid not null references public.workouts(id) on delete cascade,
  name text not null,
  equipment text,
  sets integer,
  reps text,
  rest_seconds integer,
  media_gif_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  workout_id uuid not null references public.workouts(id) on delete cascade,
  duration_minutes integer,
  calories_burned integer,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.nutrition_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  meal_type text not null,
  calories integer not null,
  protein numeric(10,2) not null,
  carbs numeric(10,2) not null,
  fats numeric(10,2) not null,
  off_diet boolean not null default false,
  logged_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.water_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  ml integer not null,
  logged_at timestamptz not null default now()
);

create table public.body_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  weight_kg numeric(6,2),
  body_fat_pct numeric(5,2),
  chest_cm numeric(6,2),
  waist_cm numeric(6,2),
  hips_cm numeric(6,2),
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  author_user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  media_url text,
  visibility public.profile_visibility not null default 'public',
  moderation_state text not null default 'approved',
  like_count integer not null default 0,
  comment_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.community_comments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_user_id uuid not null references public.profiles(id) on delete cascade,
  parent_comment_id uuid references public.community_comments(id) on delete cascade,
  body text not null,
  like_count integer not null default 0,
  moderation_state text not null default 'approved',
  created_at timestamptz not null default now()
);

create table public.post_likes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create table public.comment_likes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  comment_id uuid not null references public.community_comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (comment_id, user_id)
);

create table public.user_follows (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  follower_user_id uuid not null references public.profiles(id) on delete cascade,
  following_user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (follower_user_id, following_user_id),
  check (follower_user_id <> following_user_id)
);

create table public.direct_threads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (tenant_id, user_a, user_b),
  check (user_a <> user_b)
);

create table public.direct_messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  thread_id uuid not null references public.direct_threads(id) on delete cascade,
  sender_user_id uuid not null references public.profiles(id) on delete cascade,
  body text,
  media_url text,
  is_deleted boolean not null default false,
  sent_at timestamptz not null default now()
);

create table public.moderation_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  reporter_user_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  reason text not null,
  status text not null default 'open',
  ai_score numeric(5,2),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  channel text not null,
  title text not null,
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete set null,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reward text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.challenge_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null default 0,
  rank_position integer,
  joined_at timestamptz not null default now(),
  unique (challenge_id, user_id)
);

create table public.user_xp (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  xp integer not null default 0,
  level integer not null default 1,
  streak_days integer not null default 0,
  updated_at timestamptz not null default now()
);

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  code text not null,
  title text not null,
  description text,
  icon text,
  created_at timestamptz not null default now(),
  unique (tenant_id, code)
);

create table public.user_badges (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

create table public.avatar_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  goal public.program_goal not null,
  source_image_url text not null,
  status public.avatar_job_status not null default 'queued',
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.avatar_stages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  avatar_job_id uuid not null references public.avatar_jobs(id) on delete cascade,
  stage_percent integer not null check (stage_percent in (0, 20, 40, 60, 100)),
  image_url text not null,
  visibility public.profile_visibility not null default 'private',
  created_at timestamptz not null default now(),
  unique (avatar_job_id, stage_percent)
);

-- Indexes for scale
create index idx_profiles_tenant_role on public.profiles (tenant_id, role);
create index idx_programs_tenant_published on public.programs (tenant_id, is_published, created_at desc);
create index idx_workout_logs_user_completed on public.workout_logs (user_id, completed_at desc);
create index idx_nutrition_logs_user_logged on public.nutrition_logs (user_id, logged_at desc);
create index idx_posts_tenant_created on public.community_posts (tenant_id, created_at desc);
create index idx_comments_post_created on public.community_comments (post_id, created_at asc);
create index idx_messages_thread_sent on public.direct_messages (thread_id, sent_at asc);
create index idx_notifications_user_created on public.notifications (user_id, created_at desc);
create index idx_reports_tenant_status on public.moderation_reports (tenant_id, status, created_at desc);
create index idx_avatar_jobs_user_status on public.avatar_jobs (user_id, status, created_at desc);
create index idx_challenge_entries_challenge_score on public.challenge_entries (challenge_id, score desc);

-- Triggers
create trigger trg_tenants_updated_at before update on public.tenants for each row execute function public.set_updated_at();
create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger trg_subscription_plans_updated_at before update on public.subscription_plans for each row execute function public.set_updated_at();
create trigger trg_user_subscriptions_updated_at before update on public.user_subscriptions for each row execute function public.set_updated_at();
create trigger trg_payments_updated_at before update on public.payments for each row execute function public.set_updated_at();
create trigger trg_coach_profiles_updated_at before update on public.coach_profiles for each row execute function public.set_updated_at();
create trigger trg_programs_updated_at before update on public.programs for each row execute function public.set_updated_at();
create trigger trg_workouts_updated_at before update on public.workouts for each row execute function public.set_updated_at();
create trigger trg_exercises_updated_at before update on public.exercises for each row execute function public.set_updated_at();
create trigger trg_posts_updated_at before update on public.community_posts for each row execute function public.set_updated_at();
create trigger trg_challenges_updated_at before update on public.challenges for each row execute function public.set_updated_at();
create trigger trg_user_xp_updated_at before update on public.user_xp for each row execute function public.set_updated_at();
create trigger trg_avatar_jobs_updated_at before update on public.avatar_jobs for each row execute function public.set_updated_at();

-- RLS
alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.tenant_memberships enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.coach_profiles enable row level security;
alter table public.programs enable row level security;
alter table public.program_reviews enable row level security;
alter table public.program_enrollments enable row level security;
alter table public.workouts enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_logs enable row level security;
alter table public.nutrition_logs enable row level security;
alter table public.water_logs enable row level security;
alter table public.body_metrics enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.post_likes enable row level security;
alter table public.comment_likes enable row level security;
alter table public.user_follows enable row level security;
alter table public.direct_threads enable row level security;
alter table public.direct_messages enable row level security;
alter table public.moderation_reports enable row level security;
alter table public.notifications enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_entries enable row level security;
alter table public.user_xp enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.avatar_jobs enable row level security;
alter table public.avatar_stages enable row level security;

create policy tenant_read_own_tenant on public.tenants
  for select using (id = public.current_tenant_id());

create policy tenant_admin_update_tenant on public.tenants
  for update using (
    id = public.current_tenant_id()
    and exists (
      select 1 from public.tenant_memberships tm
      where tm.tenant_id = tenants.id
      and tm.user_id = auth.uid()
      and tm.role in ('admin', 'coach')
      and tm.is_active = true
    )
  );

create policy profiles_tenant_isolation on public.profiles
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy membership_tenant_isolation on public.tenant_memberships
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_subscription_plans on public.subscription_plans
  for all using (tenant_id is null or tenant_id = public.current_tenant_id())
  with check (tenant_id is null or tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_user_subscriptions on public.user_subscriptions
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_payments on public.payments
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_coach_profiles on public.coach_profiles
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_programs on public.programs
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_program_reviews on public.program_reviews
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_program_enrollments on public.program_enrollments
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_workouts on public.workouts
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_exercises on public.exercises
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_workout_logs on public.workout_logs
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_nutrition_logs on public.nutrition_logs
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_water_logs on public.water_logs
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_body_metrics on public.body_metrics
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_community_posts on public.community_posts
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_community_comments on public.community_comments
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_post_likes on public.post_likes
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_comment_likes on public.comment_likes
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_user_follows on public.user_follows
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_direct_threads on public.direct_threads
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_direct_messages on public.direct_messages
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_moderation_reports on public.moderation_reports
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_notifications on public.notifications
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_challenges on public.challenges
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_challenge_entries on public.challenge_entries
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_user_xp on public.user_xp
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_badges on public.badges
  for all using (tenant_id is null or tenant_id = public.current_tenant_id())
  with check (tenant_id is null or tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_user_badges on public.user_badges
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_avatar_jobs on public.avatar_jobs
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

create policy generic_tenant_isolation_avatar_stages on public.avatar_stages
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

-- Tenant bootstrap for newly created auth users
create or replace function public.current_tenant_id()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  claim_tenant uuid;
  profile_tenant uuid;
begin
  claim_tenant := nullif((current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id'), '')::uuid;

  if claim_tenant is not null then
    return claim_tenant;
  end if;

  select p.tenant_id
  into profile_tenant
  from public.profiles p
  where p.id = auth.uid()
  limit 1;

  return profile_tenant;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_tenant_id uuid;
  display_name text;
  username_base text;
  final_username text;
  tenant_slug text;
begin
  display_name := coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1), 'SmartFit User');
  username_base := lower(regexp_replace(coalesce(split_part(new.email, '@', 1), 'user'), '[^a-z0-9_]', '', 'g'));

  if username_base = '' then
    username_base := 'user';
  end if;

  final_username := username_base || '_' || substr(replace(new.id::text, '-', ''), 1, 6);
  tenant_slug := 'tenant-' || substr(replace(new.id::text, '-', ''), 1, 10);

  insert into public.tenants (slug, name, owner_user_id)
  values (tenant_slug, display_name || ' Studio', new.id)
  returning id into new_tenant_id;

  insert into public.profiles (
    id,
    tenant_id,
    role,
    full_name,
    username,
    locale,
    goal,
    country
  ) values (
    new.id,
    new_tenant_id,
    'admin',
    display_name,
    final_username,
    coalesce(new.raw_user_meta_data ->> 'locale', 'en'),
    'health',
    coalesce(new.raw_user_meta_data ->> 'country', 'US')
  );

  insert into public.tenant_memberships (tenant_id, user_id, role, is_active)
  values (new_tenant_id, new.id, 'admin', true)
  on conflict (tenant_id, user_id) do nothing;

  insert into public.user_xp (user_id, tenant_id, xp, level, streak_days)
  values (new.id, new_tenant_id, 0, 1, 0)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
