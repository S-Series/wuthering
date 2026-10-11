# Gateway table grants

Supabase is removing automatic Data API grants for newly created public tables.
Existing projects adopt this on October 30, 2026; existing table grants remain
unchanged. See the [official announcement](https://github.com/orgs/supabase/discussions/45329).

The gateway uses `supabase-js` with server credentials. Its four tables need
explicit `SELECT`, `INSERT`, and `UPDATE` privileges for `service_role`:

| Tables | Operations |
| --- | --- |
| `board_posts`, `board_comments` | Read, create, edit, hide (soft delete) |
| `render_request_states` | Read, insert/update locks, release locks, upsert cooldowns |
| `dev_analytics_daily` | Read date ranges, insert/update daily snapshots |

The three original DDL files now include those grants. UUID/text/date keys have no
sequence dependencies in the repository DDL. The existing view-count RPC already
grants `EXECUTE` to `service_role` and excludes PUBLIC/anon/authenticated.

## Application

For fresh environments, apply the original table DDL after its dependencies
(including `public.users`). For existing environments, an authorized administrator
can review and apply `backend/gateway/sql/service_role_table_grants.sql` instead
of rerunning the full DDL. All four tables must already exist; a missing table
causes the transaction to fail rather than applying a partial patch.

The patch adds only table-level SELECT/INSERT/UPDATE. It does not revoke existing
privileges, change schema/default privileges, grant DELETE or sequence access,
or change RLS, policies, functions, or triggers. It grants nothing to browser roles.

Run `backend/gateway/sql/verify_service_role_table_grants.sql` before and after
application. This is a read-only catalog check. Required permissions and schema
USAGE must be true; policy and trigger definitions must remain unchanged. Investigate
unexpected sequence dependencies before granting any sequence privileges.

## Verification Limits

Static source review and `node --test sql/service_role_table_grants.test.cjs`
(from `backend/gateway`) check the grant statements and read-only verification scope.
No SQL has been executed against a database and no live API behavior is verified.

In an approved disposable test database, verify fresh creation and recreation,
board/comment CRUD (including soft delete), comment counts, view-count RPC,
render insert/update/upsert and lock release, and analytics insert/conflict update
and range reads. Memory fallback alone is not a successful render database test.
Do not test mutations on production; even a board GET with `view=1` updates data.

This review does not cover `users`, memberships, other tables, external policies,
custom `RENDER_STATE_TABLE` values, environment credentials, or actual project
Data API/schema settings. Catalog permissions alone do not prove API connectivity.
