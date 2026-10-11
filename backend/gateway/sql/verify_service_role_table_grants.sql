-- Read-only catalog inspection, not an API/integration test.
-- Capture policies/triggers before and after the grant patch; they must match.
begin read only;

-- Four rows expected: exists/RLS/schema usage/SELECT/INSERT/UPDATE all true.
-- DELETE is informational: existing privileges are intentionally not revoked.
with targets(table_name) as (
  values ('board_posts'), ('board_comments'),
         ('render_request_states'), ('dev_analytics_daily')
)
select t.table_name, c.oid is not null as table_exists,
       c.relrowsecurity as rls_enabled,
       has_schema_privilege(r.oid, 'public', 'USAGE') as schema_usage,
       has_table_privilege(r.oid, c.oid, 'SELECT') as can_select,
       has_table_privilege(r.oid, c.oid, 'INSERT') as can_insert,
       has_table_privilege(r.oid, c.oid, 'UPDATE') as can_update,
       has_table_privilege(r.oid, c.oid, 'DELETE') as can_delete
from targets t
left join pg_namespace n on n.nspname = 'public'
left join pg_class c on c.relnamespace = n.oid and c.relname = t.table_name
  and c.relkind in ('r', 'p')
left join pg_roles r on r.rolname = 'service_role'
order by t.table_name;

-- RPC exists/security definer/service execute=true; anon/auth/public=false.
with target as (
  select to_regprocedure('public.increment_board_post_view(uuid)')::oid as oid
)
select p.oid is not null as rpc_exists, p.prosecdef as security_definer,
       p.proconfig as function_settings,
       has_function_privilege((select oid from pg_roles where rolname = 'service_role'), p.oid, 'EXECUTE') as service_role_execute,
       has_function_privilege((select oid from pg_roles where rolname = 'anon'), p.oid, 'EXECUTE') as anon_execute,
       has_function_privilege((select oid from pg_roles where rolname = 'authenticated'), p.oid, 'EXECUTE') as authenticated_execute,
       case when p.oid is null then null else exists (
         select 1 from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) a
         where a.grantee = 0 and a.privilege_type = 'EXECUTE'
       ) end as public_execute
from target t left join pg_proc p on p.oid = t.oid;

-- Repository DDL uses UUID/text/date keys, not sequences: expect zero rows.
-- Does not rule out sequence calls inside function bodies or dynamic SQL.
with targets as (
  select c.oid from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind in ('r', 'p')
    and c.relname in ('board_posts', 'board_comments', 'render_request_states', 'dev_analytics_daily')
), dependencies as (
  select t.oid as table_oid, a.attname as column_name, s.oid as sequence_oid,
         'owned sequence' as dependency
  from targets t join pg_depend d
    on d.refclassid = 'pg_class'::regclass and d.refobjid = t.oid
    and d.classid = 'pg_class'::regclass and d.deptype in ('a', 'i')
  join pg_class s on s.oid = d.objid and s.relkind = 'S'
  join pg_attribute a on a.attrelid = t.oid and a.attnum = d.refobjsubid
  union all
  select t.oid, a.attname, s.oid, 'default references sequence'
  from targets t join pg_attrdef ad on ad.adrelid = t.oid
  join pg_attribute a on a.attrelid = t.oid and a.attnum = ad.adnum
  join pg_depend d on d.classid = 'pg_attrdef'::regclass and d.objid = ad.oid
    and d.refclassid = 'pg_class'::regclass
  join pg_class s on s.oid = d.refobjid and s.relkind = 'S'
)
select table_oid::regclass as table_name, column_name,
       sequence_oid::regclass as sequence_name, dependency
from dependencies order by 1, 2, 3, 4;

-- Original DDL creates no policies; existing external policies are preserved.
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies where schemaname = 'public'
  and tablename in ('board_posts', 'board_comments', 'render_request_states', 'dev_analytics_daily')
order by tablename, policyname;

-- Expect board_comments_refresh_count, tgenabled='O'; do not execute it.
select c.relname as table_name, t.tgname, t.tgenabled, pg_get_triggerdef(t.oid) as trigger_definition
from pg_trigger t join pg_class c on c.oid = t.tgrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname = 'board_comments' and not t.tgisinternal
order by t.tgname;

commit;
