create table if not exists public.dev_analytics_daily (
  day date primary key,
  period_start timestamptz not null,
  period_end timestamptz not null,
  pageviews bigint not null default 0 check (pageviews >= 0),
  visitors bigint not null default 0 check (visitors >= 0),
  pages jsonb not null default '[]'::jsonb,
  countries jsonb not null default '[]'::jsonb,
  collected_at timestamptz not null default now(),
  constraint dev_analytics_daily_period_check check (period_end > period_start)
);

alter table public.dev_analytics_daily enable row level security;

comment on table public.dev_analytics_daily is
  'Vercel Web Analytics snapshots for 05:00 to 05:00 Asia/Seoul days. Read and written by the gateway service role.';
