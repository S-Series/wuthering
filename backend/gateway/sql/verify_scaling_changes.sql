-- Read-only verification after applying the two scaling SQL files.
begin read only;

-- Expected: JSONB data, UUID user_id, and a valid unique index on user_id.
select a.attname as column_name, format_type(a.atttypid, a.atttypmod) as data_type
from pg_attribute a
where a.attrelid = 'public.character_data'::regclass
  and a.attname in ('user_id', 'data', 'updated_at') and not a.attisdropped;

select i.indisunique, i.indisvalid, pg_get_indexdef(i.indexrelid) as definition
from pg_index i
where i.indrelid = 'public.character_data'::regclass and i.indisunique;

-- Expected: exists=true, security_invoker=true, service_role=true,
-- anon/authenticated=false. Existing table RLS/policies are not modified.
with target as (
  select to_regprocedure('public.merge_character_cloud_data(uuid,text,jsonb)')::oid as oid
)
select p.oid is not null as function_exists,
       not p.prosecdef as security_invoker,
       p.proconfig as function_settings,
       has_function_privilege('service_role', p.oid, 'execute') as service_role_can_execute,
       has_function_privilege('anon', p.oid, 'execute') as anon_can_execute,
       has_function_privilege('authenticated', p.oid, 'execute') as authenticated_can_execute
from target t left join pg_proc p on p.oid = t.oid;

-- Expected: GIN index using gin_trgm_ops, published-only predicate, valid=true.
select n.nspname as extension_schema, e.extversion
from pg_extension e join pg_namespace n on n.oid = e.extnamespace
where e.extname = 'pg_trgm';

select i.indisvalid as valid, pg_get_indexdef(i.indexrelid) as definition,
       pg_get_expr(i.indpred, i.indrelid) as predicate
from pg_index i
where i.indexrelid = to_regclass('public.board_posts_public_title_trgm_idx');

select c.relname, c.relrowsecurity as rls_enabled
from pg_class c
where c.oid in ('public.character_data'::regclass, 'public.board_posts'::regclass);

commit;
