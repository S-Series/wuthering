create extension if not exists pgcrypto;

create table if not exists public.board_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.users (id) on delete cascade,
  category text not null default 'general'
    check (category in ('general', 'question', 'guide')),
  title varchar(120) not null
    check (char_length(trim(title)) between 1 and 120),
  content text not null
    check (char_length(trim(content)) between 1 and 20000),
  status text not null default 'published'
    check (status in ('draft', 'published', 'hidden')),
  is_pinned boolean not null default false,
  view_count integer not null default 0 check (view_count >= 0),
  comment_count integer not null default 0 check (comment_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists board_posts_public_list_idx
  on public.board_posts (is_pinned desc, created_at desc)
  where status = 'published';

create index if not exists board_posts_category_list_idx
  on public.board_posts (category, is_pinned desc, created_at desc)
  where status = 'published';

create index if not exists board_posts_author_id_idx
  on public.board_posts (author_id, created_at desc);

alter table public.board_posts enable row level security;

comment on table public.board_posts is
  'Community board posts. Read and write access is mediated by the gateway service.';
