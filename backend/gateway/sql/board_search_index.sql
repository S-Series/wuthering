-- Optional migration for title ILIKE '%term%' searches.
-- Run in the Supabase SQL editor after board_posts.sql.
-- Existing pg_trgm installations may live in public or extensions; preserve
-- their schema and qualify the operator class rather than changing search_path.
begin;
set local lock_timeout = '3s';
set local statement_timeout = '30s';
create schema if not exists extensions;
create extension if not exists pg_trgm with schema extensions;

do $$
declare
  trgm_schema text;
begin
  select n.nspname into strict trgm_schema
  from pg_extension e
  join pg_namespace n on n.oid = e.extnamespace
  where e.extname = 'pg_trgm';

  execute format(
    'create index if not exists board_posts_public_title_trgm_idx
       on public.board_posts using gin (title %I.gin_trgm_ops)
       where status = %L',
    trgm_schema, 'published'
  );
end;
$$;
commit;

-- This index supports existing case-insensitive substring semantics. Patterns
-- without extractable trigrams (often 1-2 character substrings) may still scan.
-- For a large live table, plan a separate CREATE INDEX CONCURRENTLY rollout
-- outside a transaction/DO block to avoid blocking writes during index build.
