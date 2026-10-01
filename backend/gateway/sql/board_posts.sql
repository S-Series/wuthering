create extension if not exists pgcrypto;

create table if not exists public.board_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.users (id) on delete cascade,
  category text not null default 'general'
    check (category in ('general', 'report', 'question', 'guide')),
  title varchar(120) not null
    check (char_length(trim(title)) between 1 and 120),
  content text not null
    check (char_length(trim(content)) between 1 and 20000),
  status text not null default 'published'
    check (status in ('draft', 'published', 'hidden')),
  is_pinned boolean not null default false,
  is_resolved boolean not null default false,
  view_count integer not null default 0 check (view_count >= 0),
  comment_count integer not null default 0 check (comment_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.board_posts
  add column if not exists is_resolved boolean not null default false;

alter table public.board_posts
  drop constraint if exists board_posts_category_check;

alter table public.board_posts
  add constraint board_posts_category_check
  check (category in ('general', 'report', 'question', 'guide'));

create index if not exists board_posts_public_list_idx
  on public.board_posts (is_pinned desc, created_at desc)
  where status = 'published';

create index if not exists board_posts_category_list_idx
  on public.board_posts (category, is_pinned desc, created_at desc)
  where status = 'published';

create index if not exists board_posts_author_id_idx
  on public.board_posts (author_id, created_at desc);

alter table public.board_posts enable row level security;

create table if not exists public.board_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.board_posts (id) on delete cascade,
  author_id uuid not null references public.users (id) on delete cascade,
  content text not null
    check (char_length(trim(content)) between 1 and 2000),
  status text not null default 'published'
    check (status in ('published', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists board_comments_post_id_idx
  on public.board_comments (post_id, created_at asc)
  where status = 'published';

create index if not exists board_comments_author_id_idx
  on public.board_comments (author_id, created_at desc);

alter table public.board_comments enable row level security;

create or replace function public.refresh_board_post_comment_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_post_id uuid;
begin
  if tg_op = 'DELETE' then
    target_post_id := old.post_id;
  else
    target_post_id := new.post_id;
  end if;

  update public.board_posts
  set comment_count = (
    select count(*)::integer
    from public.board_comments
    where post_id = target_post_id
      and status = 'published'
  )
  where id = target_post_id;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

revoke all on function public.refresh_board_post_comment_count() from public;

drop trigger if exists board_comments_refresh_count on public.board_comments;
create trigger board_comments_refresh_count
after insert or update of status or delete on public.board_comments
for each row execute function public.refresh_board_post_comment_count();

create or replace function public.increment_board_post_view(target_post_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  next_count integer;
begin
  update public.board_posts
  set view_count = view_count + 1
  where id = target_post_id
    and status = 'published'
  returning view_count into next_count;

  return next_count;
end;
$$;

revoke all on function public.increment_board_post_view(uuid) from public;
revoke all on function public.increment_board_post_view(uuid) from anon;
revoke all on function public.increment_board_post_view(uuid) from authenticated;
grant execute on function public.increment_board_post_view(uuid) to service_role;

comment on table public.board_posts is
  'Community board posts. Read and write access is mediated by the gateway service.';

comment on table public.board_comments is
  'Community board comments. Read and write access is mediated by the gateway service.';
