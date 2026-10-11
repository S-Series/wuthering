-- Existing installations: run as the table owner / an authorized administrator.
-- Fresh installations receive these grants from each table's original DDL.
-- Add only gateway-required privileges; preserve RLS, policies and existing ACLs.
-- No DELETE, sequence grants, or schema-wide default privileges are added.
begin;

grant select, insert, update on table
  public.board_posts,
  public.board_comments,
  public.render_request_states,
  public.dev_analytics_daily
to service_role;

commit;
