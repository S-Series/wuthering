create table if not exists public.render_request_states (
  user_key text primary key,
  lock_expires_at timestamptz not null default '1970-01-01T00:00:00Z',
  lock_token text,
  cooldown_expires_at timestamptz not null default '1970-01-01T00:00:00Z',
  updated_at timestamptz not null default now()
);

create index if not exists render_request_states_lock_expires_at_idx
  on public.render_request_states (lock_expires_at);

create index if not exists render_request_states_cooldown_expires_at_idx
  on public.render_request_states (cooldown_expires_at);

alter table public.render_request_states enable row level security;

comment on table public.render_request_states is
  'Shared render lock/cooldown state for gateway instances. Accessed by the gateway service role.';
