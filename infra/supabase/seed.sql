-- Baseline subscription plans (global)
insert into public.subscription_plans (
  tenant_id,
  code,
  name,
  price_monthly_usd,
  price_monthly_eur,
  price_monthly_gbp,
  price_monthly_brl,
  price_yearly_usd,
  price_yearly_eur,
  price_yearly_gbp,
  price_yearly_brl
)
values
  (null, 'free', 'Free', 0, 0, 0, 0, 0, 0, 0, 0),
  (null, 'standard', 'Standard', 29, 29, 29, 39.9, 290, 290, 290, 399),
  (null, 'vip', 'VIP', 89, 89, 89, 99.9, 890, 890, 890, 999)
on conflict do nothing;

-- Baseline badges
insert into public.badges (tenant_id, code, title, description)
values
  (null, 'first_workout', 'First Workout', 'Completed your first logged workout'),
  (null, 'streak_7', '7 Day Streak', 'Maintained consistency for 7 days'),
  (null, 'streak_30', '30 Day Streak', 'Maintained consistency for 30 days'),
  (null, 'community_helper', 'Community Helper', 'Supports other users consistently')
on conflict do nothing;
